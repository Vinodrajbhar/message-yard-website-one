import { NextResponse } from "next/server";
import { getR2ObjectStream } from "@/lib/r2";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Query parameter 'key' is required (e.g. /api/r2/video?key=videos/demo.mp4)." },
        { status: 400 }
      );
    }

    if (
      !process.env.CLOUDFLARE_R2_ACCOUNT_ID ||
      !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ||
      !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
      !process.env.CLOUDFLARE_R2_BUCKET_NAME
    ) {
      return NextResponse.json(
        {
          error: "Cloudflare R2 credentials are not configured in environment variables.",
          required: [
            "CLOUDFLARE_R2_ACCOUNT_ID",
            "CLOUDFLARE_R2_ACCESS_KEY_ID",
            "CLOUDFLARE_R2_SECRET_ACCESS_KEY",
            "CLOUDFLARE_R2_BUCKET_NAME",
          ],
        },
        { status: 503 }
      );
    }

    const rangeHeader = req.headers.get("range") || undefined;
    const s3Response = await getR2ObjectStream(key, rangeHeader);

    if (!s3Response.Body) {
      return NextResponse.json({ error: "Object body not found." }, { status: 404 });
    }

    // Convert AWS SDK Stream to Web ReadableStream
    const webStream = s3Response.Body.transformToWebStream();

    // Set content type - ensure HTML5 video player compatibility (H.264 in QuickTime container plays best as video/mp4)
    const contentType =
      key.toLowerCase().endsWith(".mov")
        ? "video/mp4"
        : s3Response.ContentType || "video/mp4";

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Accept-Ranges", "bytes");

    if (s3Response.ContentLength !== undefined) {
      headers.set("Content-Length", s3Response.ContentLength.toString());
    }

    if (s3Response.ContentRange) {
      headers.set("Content-Range", s3Response.ContentRange);
    }

    // CDN & Browser Edge Caching:
    // Allow global Cloudflare / Vercel Edge CDNs to cache video segments for up to 1 year (immutable)
    headers.set("Cache-Control", "public, max-age=31536000, s-maxage=31536000, immutable");
    headers.set("CDN-Cache-Control", "max-age=31536000");
    headers.set("Cloudflare-CDN-Cache-Control", "max-age=31536000");
    headers.set("Access-Control-Allow-Origin", "*");

    const status = rangeHeader && s3Response.ContentRange ? 206 : 200;

    return new Response(webStream, {
      status,
      headers,
    });
  } catch (error: any) {
    console.error("[Cloudflare R2 Video Stream Error]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to stream video from Cloudflare R2." },
      { status: 500 }
    );
  }
}
