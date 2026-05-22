import "dotenv/config";

import FormData from "form-data"; 
import Mailgun from "mailgun.js"; 

export const sendProductsMail = async (productList) => {
  let body = "";
  productList.forEach((item) => {
    body +=
      "<a href=' " +
      item.url +
      "'>" +
      item.name +
      "</a>" +
      " Antes: " +
      item.previousPrice +
      " - Ahora: " +
      item.newPrice +
      "</body>\n";
  });
  
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY || "API_KEY",
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net"
  });
  try {
    const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: "Scrap-bot <postmaster@"+process.env.MAILGUN_DOMAIN+">",
      to: [process.env.GOOGLE_EMAIL],
      subject: "Scrap-bot Alerta productos bajaron de precio",
      html: body,
    });
    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }
};
