import nodemailer from 'nodemailer';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            // Configure your email service here
            // Example for Gmail:
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendEmail(to, subject, html) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to,
                subject,
                html
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
}

export default new EmailService();
