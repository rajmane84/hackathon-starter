import { env } from "../config/env.js";
import nodemailer from "nodemailer";

const devTransporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // Or your preferred dev SMTP host
  port: 2525,
  auth: {
    user: env.MAILTRAP_USER,
    pass: env.MAILTRAP_PASS,
  },
});

export const sendOTP = async (email: string, otp: string) => {
  if (env.NODE_ENV === "production") {
    // Production no-op for now since we only configured Mailtrap for dev
    console.log(`[Production Sim] OTP for ${email} is: ${otp}`);
    return;
  }

  try {
    const mailOptions = {
      from: `"Test App" <rajmane9594@gmail.com>`,
      to: email,
      subject: "Your OTP for Registration Validation",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
      html: `<h3>Your OTP is: <b>${otp}</b></h3><p>It will expire in 5 minutes.</p>`,
    };

    const info = await devTransporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email via Nodemailer:", error);
    throw new Error("Failed to send verification email");
  }
};
