import { NextResponse } from "next/server";
import { getR2SignedUrl } from "@/lib/r2";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    const expiresIn = Number(searchParams.get("expiresIn")) || 3600;

    if (!key) {
      return NextResponse.json(
        { error: "Query parameter 'key' is required (e.g. /api/r2/signed-url?key=videos/demo.mp4)." },
        { status: 400 }
      );
    }

    // Check credentials before attempting presign
    if (
      !process.env.CLOUDFLARE_R2_ACCOUNT_ID ||
      !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ||
      !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
      !process.env.CLOUDFLARE_R2_BUCKET_NAME
    ) {
      return NextResponse.json(
        {
          error: "Cloudflare R2 credentials are not fully configured in environment variables.",
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

    const url = await getR2SignedUrl(key, expiresIn);

    return NextResponse.json({
      success: true,
      url,
      key,
      expiresIn,
    });
  } catch (error: any) {
    console.error("[Cloudflare R2 Signed URL Error]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate signed URL." },
      { status: 500 }
    );
  }
}
