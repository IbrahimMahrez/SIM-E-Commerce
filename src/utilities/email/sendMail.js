

import nodemailer from "nodemailer"
import { emailTemplate } from "./emailTemplate.js";


const transporter = nodemailer.createTransport({
 service:"gmail",

  secure: false, 
  auth: {
    user: "ibrahimmahrez726@gmail.com",
    pass: "skhh cvjm jpbg wdbp", 
  },
  tls:{
    rejectUnauthorized:false
  }
});

 const sendMail = async (email) => {
  const info = await transporter.sendMail({
    from: '"SIM E-COM" <ibrahimmahrez7@gmail.com>',

    to: email,

    subject: "Welcome to SIM E-COM", 
    text: "verify your email", 
    html: emailTemplate(email), 
  });

  console.log("Message sent:", info.messageId);
};

export { sendMail };
