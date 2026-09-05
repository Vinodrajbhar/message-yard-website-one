import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      formMode,
      name,
      email,
      company,
      phone,
      volume,
      channels,
      duration,
      timeline,
      notes,
    } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required fields." },
        { status: 400 }
      );
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || "sales@messageyard.com";
    const subjectPrefix = formMode === "sales" ? "Enterprise Sales Inquiry" : "Live Demo Request";
    const subject = `[${subjectPrefix}] ${name} from ${company || "Prospective Client"}`;

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = Number(process.env.SMTP_PORT) || 587;
    const secure = process.env.SMTP_SECURE === "true";
    const fromAddress = process.env.SMTP_FROM || `"MessageYard Website" <${user || "notifications@messageyard.com"}>`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
          .header { background: #0b132b; color: #ffffff; padding: 24px 32px; }
          .header h2 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.02em; }
          .header p { margin: 4px 0 0; color: #94a3b8; font-size: 13px; }
          .badge { display: inline-block; padding: 4px 10px; background: rgba(37,99,235,0.15); border: 1px solid #2563eb; color: #60a5fa; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-top: 12px; text-transform: uppercase; }
          .content { padding: 32px; }
          .field-row { margin-bottom: 20px; }
          .field-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
          .field-value { font-size: 15px; font-weight: 500; color: #0f172a; line-height: 1.4; }
          .tag-pill { display: inline-block; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: 3px 8px; font-size: 13px; margin: 2px 4px 2px 0; color: #1e293b; }
          .notes-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; font-size: 14px; line-height: 1.5; color: #334155; margin-top: 6px; white-space: pre-wrap; }
          .footer { padding: 18px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Inquiry: ${formMode === "sales" ? "Enterprise Sales" : "Architecture Demo"}</h2>
            <p>Submitted via MessageYard Web Portal</p>
            <div class="badge">${formMode === "sales" ? "Sales Tier" : "Demo Session"}</div>
          </div>
          <div class="content">
            <div class="field-row">
              <div class="field-label">Full Name</div>
              <div class="field-value">${name}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Work Email</div>
              <div class="field-value"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></div>
            </div>
            <div class="field-row">
              <div class="field-label">Company</div>
              <div class="field-value">${company || "Not specified"}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Phone Number</div>
              <div class="field-value">${phone || "Not specified"}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Estimated Monthly Message Volume</div>
              <div class="field-value"><strong>${volume || "Not specified"}</strong></div>
            </div>
            <div class="field-row">
              <div class="field-label">Channels of Interest</div>
              <div class="field-value">
                ${
                  Array.isArray(channels) && channels.length > 0
                    ? channels.map((c: string) => `<span class="tag-pill">${c}</span>`).join(" ")
                    : "None selected"
                }
              </div>
            </div>
            <div class="field-row">
              <div class="field-label">Preferred Session / Duration</div>
              <div class="field-value">${duration || "30 Min Tech Deep Dive"}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Target Timeline</div>
              <div class="field-value">${timeline || "This Week"}</div>
            </div>
            ${
              notes
                ? `
            <div class="field-row">
              <div class="field-label">Technical Specs & Requirements</div>
              <div class="notes-box">${notes}</div>
            </div>
            `
                : ""
            }
          </div>
          <div class="footer">
            Delivered to <strong>${toEmail}</strong> · Configured via <code>CONTACT_TO_EMAIL</code> in environment.
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
=== NEW ${formMode === "sales" ? "ENTERPRISE SALES" : "DEMO"} INQUIRY ===
Name: ${name}
Email: ${email}
Company: ${company || "N/A"}
Phone: ${phone || "N/A"}
Estimated Volume: ${volume || "N/A"}
Channels: ${Array.isArray(channels) ? channels.join(", ") : "N/A"}
Duration: ${duration || "N/A"}
Timeline: ${timeline || "N/A"}
Technical Notes: ${notes || "None"}
==================================================
Target recipient: ${toEmail}
    `;

    // Check if SMTP is configured
    if (host && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
      });

      await transporter.sendMail({
        from: fromAddress,
        to: toEmail,
        replyTo: email,
        subject,
        text: textContent,
        html: htmlContent,
      });

      return NextResponse.json({
        success: true,
        message: `Email successfully sent to ${toEmail}.`,
      });
    } else {
      // Development fallback when SMTP is not configured
      console.log(`[MessageYard Contact] Destination: ${toEmail}`);
      console.log(textContent);

      return NextResponse.json({
        success: true,
        message: `Inquiry recorded. (SMTP not configured in env; logged to console for destination: ${toEmail})`,
        devMode: true,
      });
    }
  } catch (error: any) {
    console.error("[MessageYard Contact API Error]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process inquiry submission." },
      { status: 500 }
    );
  }
}
