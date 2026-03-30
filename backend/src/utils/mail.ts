import { env } from "../config/env.js";
import nodemailer from "nodemailer";
import { resend } from "../config/resend.js";
import { ApiError } from "./apiError.js";
import { getOTPTemplate } from "../constants/index.js";

const devTransporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // Or your preferred dev SMTP host
  port: 2525,
  auth: {
    user: env.MAILTRAP_USER,
    pass: env.MAILTRAP_PASS,
  },
});

export const sendOTP = async (email: string, otp: string) => {
  const { subject, text, html } = getOTPTemplate(otp);

  if (env.NODE_ENV === "production") {
    const { data, error } = await resend.emails.send({
      from: "Test App <no-reply@rajmane.dev>",
      to: email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Error sending email via Resend:", error);
      throw new ApiError(500, "Failed to send verification email");
    }

    console.log("Message sent: %s", data.id);
    return;
  }

  try {
    const mailOptions = {
      from: `"Test App" <rajmane9594@gmail.com>`,
      to: email,
      subject,
      text,
      html,
    };

    const info = await devTransporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email via Nodemailer:", error);
    throw new ApiError(500, "Failed to send verification email");
  }
};
