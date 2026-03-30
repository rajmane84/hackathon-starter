import { MailtrapClient } from "mailtrap";
import { env } from "./env";

export const mailtrapClient = new MailtrapClient({
  token: env.MAILTRAP_TOKEN || "",
});

export const sender = {
  email: "no-reply@example.com",
  name: "Auth Service Mailtrap",
};