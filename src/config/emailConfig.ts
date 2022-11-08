import { registerAs } from "@nestjs/config";

export default registerAs('email', () => ({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASSWORD,
  },
  tls: {
    ciphers: process.env.EMAIL_TLS_CIPHERS
  }
}));