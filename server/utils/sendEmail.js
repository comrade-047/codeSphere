import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "codeSphere <no-reply@code-sphere.dev>",
      to,
      subject,
      html,
    });
    // console.log(response);
    return response;
  } catch (error) {
    console.error("Resend email error:", error);
    throw new Error("Failed to send email");
  }
};
