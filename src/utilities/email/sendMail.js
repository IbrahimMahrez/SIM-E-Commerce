

import nodemailer from "nodemailer"
import { emailTemplate } from "./emailTemplate.js";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
 service:"gmail",

  secure: false, // true for 465, false for other ports
  auth: {
    user: "ibrahimmahrez726@gmail.com",
    pass: "skhh cvjm jpbg wdbp", // must enable two step verification,=> app passwords=> create app password
  },
  tls:{
    rejectUnauthorized:false
  }
});

 const sendMail = async (email) => {
  const info = await transporter.sendMail({
    from: '"SIM E-COM" <ibrahimmahrez7@gmail.com>',

    to: email,

    subject: "Welcome to SIM E-COM", // Subject line
    text: "verify your email", // plain text body
    html: emailTemplate(email), 
  });

  console.log("Message sent:", info.messageId);
};

export { sendMail };