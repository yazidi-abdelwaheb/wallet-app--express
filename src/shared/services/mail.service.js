import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../../config/env.config.js";

const transporter = nodemailer.createTransport({
  host: "127.0.0.1",
  port: 1025,
  secure: false,
  /*service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },*/
});

/**
 * Sends an email using gmail service
 *
 * @param {string} to email address to send
 * @param {string} subject subject to send
 * @param {string} body string to html template
 * @returns {Promise} promise
 */
export async function sendMail(to, subject, body) {
  await transporter.sendMail({
    from: `"Wallet PRO" <${EMAIL_USER}>`,
    to,
    subject,
    html: body,
  });
}

/**
 * Const for define subjects mails
 */
export const subjects = {
  reset_password: "Reset Password - Wallet PRO",
  verification_mail: "Sign Up Verification - Wallet PRO",
  verification_login: "Sign In Verification - Wallet PRO",
  message_received: "Message Received - Wallet PRO",
  transaction_confirmation: "Transaction Confirmation - Wallet PRO",
};

/**
 * Base template
 */
function baseTemplate({ title, message }) {
  return `
    <div style="font-family: Arial, sans-serif; padding:20px; background:#f9f9f9;">
      <h2 style="color:#2c3e50;">${title}</h2>
      <p style="color:#34495e; font-size:14px;">${message}</p>
      <hr style="margin-top:30px; border:none; border-top:1px solid #ddd;" />
      <p style="font-size:12px; color:#7f8c8d;">Wallet PRO © ${new Date().getFullYear()}</p>
    </div>
  `;
}

// 🔹 Transaction confirmation
export function transactionTemplate({ amount, receiver }) {
  return baseTemplate({
    title: "Transaction Confirmation",
    message: `You have successfully sent ${amount} TND to ${receiver}.`,
  });
}

// 🔹 Reset password with OTP code
export function resetPasswordTemplate({ code }) {
  return baseTemplate({
    title: "Reset Your Password",
    message: `Use the following code to reset your wallet password securely:<br/><br/>
              <strong style="font-size:18px; letter-spacing:2px;">${code}</strong><br/><br/>
              This code will expire in 10 minutes.`,
  });
}

// 🔹 Email verification with OTP code
export function verificationMailTemplate({ code }) {
  return baseTemplate({
    title: "Sign Up Verification",
    message: `Enter the following code in the app to verify your email:<br/><br/>
              <strong style="font-size:18px; letter-spacing:2px;">${code}</strong><br/><br/>
              This code will expire in 10 minutes.`,
  });
}

// 🔹 Login verification with OTP code
export function verificationLoginTemplate({ code }) {
  return baseTemplate({
    title: "Sign In Verification",
    message: `Enter the following code to complete your login:<br/><br/>
              <strong style="font-size:18px; letter-spacing:2px;">${code}</strong><br/><br/>
              This code will expire in 5 minutes.`,
  });
}

// 🔹 Balance notification
export function balanceTemplate({ balance }) {
  return baseTemplate({
    title: "Balance Update",
    message: `Your current wallet balance is <strong>${balance} TND</strong>.`,
  });
}
