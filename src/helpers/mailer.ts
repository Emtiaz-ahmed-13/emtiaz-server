import nodemailer, { Transporter } from "nodemailer";

let cachedTransporter: Transporter | null = null;

const getTransporter = (): Transporter | null => {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });

  return cachedTransporter;
};

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export const sendEmail = async (options: SendMailOptions): Promise<boolean> => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      "[mailer] SMTP not configured — skipping email. Add SMTP_HOST/SMTP_USER/SMTP_PASS to .env to enable."
    );
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });
    return true;
  } catch (err) {
    console.error("[mailer] Failed to send email:", err);
    return false;
  }
};

export const buildContactEmail = (payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) => {
  const safe = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br />");

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #0a0a0a; color: #fafafa; border-radius: 12px;">
      <h2 style="margin: 0 0 16px; font-size: 18px; color: #fafafa;">New portfolio message</h2>
      <p style="margin: 0 0 20px; color: #a3a3a3; font-size: 13px;">Someone reached out through your portfolio contact form.</p>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #737373; width: 80px;">From</td>
          <td style="padding: 8px 0;"><strong>${safe(payload.name)}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #737373;">Email</td>
          <td style="padding: 8px 0;">
            <a href="mailto:${safe(payload.email)}" style="color: #60a5fa;">${safe(payload.email)}</a>
          </td>
        </tr>
        ${
          payload.subject
            ? `<tr>
                <td style="padding: 8px 0; color: #737373;">Subject</td>
                <td style="padding: 8px 0;">${safe(payload.subject)}</td>
              </tr>`
            : ""
        }
      </table>

      <div style="margin-top: 20px; padding: 16px; background: #171717; border-radius: 8px; border-left: 3px solid #fafafa;">
        ${safe(payload.message)}
      </div>

      <p style="margin-top: 24px; font-size: 11px; color: #525252; text-transform: uppercase; letter-spacing: 0.05em;">
        Sent from your portfolio API
      </p>
    </div>
  `;
};
