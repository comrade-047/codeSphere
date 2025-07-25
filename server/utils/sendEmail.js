import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.NODEMAILER_USER,
        pass : process.env.NODEMAILER_APP_PASSWORD
    }
});

export const sendEmail = async({to, subject, html}) => {
    const mailOptions = {
        from : `"codeSphere", <${process.env.NODEMAILER_USER}>`,
        to,
        subject,
        html
    };

    return await transporter.sendMail(mailOptions);
}