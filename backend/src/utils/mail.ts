import { mailtrapClient, sender } from "../config/mailTrapClient.js";
import { env } from "../config/env.js";

export const sendOTP = async (email: string, otp: string) => {
  if (env.NODE_ENV === "production") {
    // Production no-op for now since we only configured Mailtrap for dev
    console.log(`[Production Sim] OTP for ${email} is: ${otp}`);
    return;
  }

  try {
    await mailtrapClient.send({
      from: sender,
      to: [{ email }],
      subject: "Your OTP for Registration Validation",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
      html: `<h3>Your OTP is: <b>${otp}</b></h3><p>It will expire in 5 minutes.</p>`,
      category: "OTP Verification",
    });
  } catch (error) {
    console.error("Error sending email via Mailtrap:", error);
    throw new Error("Failed to send verification email");
  }
};
