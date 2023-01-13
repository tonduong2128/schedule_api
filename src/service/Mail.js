import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASS,
    }
});
const MailService = {
    async sendMail(to, subject, text) {
        const mailOptions = {
            from: process.env.EMAIL_HOST,
            to,
            subject,
            text
        };
        return transporter.sendMail(mailOptions)
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            })
    }
}
export default MailService

