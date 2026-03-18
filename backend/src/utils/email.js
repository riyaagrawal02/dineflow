import nodemailer from "nodemailer";

const getTransporter = () => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        throw new Error("SMTP is not configured");
    }
    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });
};

export const sendEmail = async ({ to, subject, html, text }) => {
    const from = process.env.EMAIL_FROM || "no-reply@myrestaurant.local";
    const transporter = getTransporter();
    await transporter.sendMail({ from, to, subject, html, text });
};
