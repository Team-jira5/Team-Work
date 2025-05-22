import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (req, res) => {
  const { prenom, nom, telephone, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: "New Contact - MAE(Assurence)",
      html: `
        <h2>Prenom: <strong>${prenom}</strong> </h2>
        <h2>Nom: <strong>${nom}</strong> </h2>
        <h2>Numéro de téléphone: <strong>${telephone}</strong> </h2>
        <h2>Email: <strong>${email}</strong> </h2>
        <h2>Message: <strong>${message}</strong> </h2>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
