"use server"

import { EmailContent, EmailProductInfo, NotificationType } from "@/types";
import nodemailer from "nodemailer";

const Notification ={
  WELCOME:"WELCOME",
  CHANGE_OF_STOCK:"CHANGE_OF_STOCK",
  LOWEST_PRICE:"LOWEST_PRICE",
  THRESHOLD_MET:"THRESHOLD_MET",
}

export async function generateEmailBody(
  product: EmailProductInfo,
  type: NotificationType
) {
  const THRESHOLD_PERCENTAGE = 40;
  // Shorten the product title
  const shortenedTitle =
    product.title.length > 20 ? `${product.title.substring(0, 20)}...` : product.title;

  let subject = "";
  let body = "";


  const productImage = `<img src="${product.image}" style="width: 100%; max-width: 300px; border-radius: 8px; margin: 20px auto; display: block;" />`;

  const buyButton = `<a href="${product.url}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; margin: 20px auto; color: #fff; background-color: #007BFF; border-radius: 5px; text-decoration: none; font-weight: bold; text-align: center;">Buy Now</a>`;

  switch (type) {
    case Notification.WELCOME:
      subject = `Welcome to Price Tracking for ${shortenedTitle}`;
      body = `
        <div style="font-family: Arial, sans-serif; padding: 15px; line-height: 1.6;">
          <h2 style="color: #333; text-align: center; font-weight: bold;">Welcome to PriceTrap 🚀</h2>
          <p style="text-align: center; font-weight: bold;">You are now tracking <strong>${product.title}</strong>.</p>
          ${productImage}
          <p style="text-align: center;">We'll notify you about updates, price drops, and stock changes for this product.</p>
          ${buyButton}
        </div>
      `;
      break;

    case Notification.CHANGE_OF_STOCK:
      subject = `${shortenedTitle} is now back in stock!`;
      body = `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
          <h2 style="color: #333; text-align: center; font-weight: bold;">Good News! 🎉</h2>
          <p style="text-align: center;">The product <strong>${product.title}</strong> is back in stock!</p>
          ${productImage}
          ${buyButton}
        </div>
      `;
      break;

    case Notification.LOWEST_PRICE:
      subject = `Lowest Price Alert for ${shortenedTitle}`;
      body = `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
          <h2 style="color: #333; text-align: center; font-weight: bold;">Lowest Price Alert! 💰</h2>
          <p style="text-align: center;">The product <strong>${product.title}</strong> is now at its lowest price ever!</p>
          ${productImage}
          ${buyButton}
        </div>
      `;
      break;

    case Notification.THRESHOLD_MET:
      subject = `Discount Alert for ${shortenedTitle}`;
      body = `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
          <h2 style="color: #333; text-align: center; font-weight: bold;">Big Discount Alert! 🔥</h2>
          <p style="text-align: center;">The product <strong>${product.title}</strong> is now available at a discount of more than <strong>${THRESHOLD_PERCENTAGE}%</strong>!</p>
          ${productImage}
          ${buyButton}
        </div>
      `;
      break;

    default:
      throw new Error("Invalid notification type.");
  }

  return { subject, body };
}


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: false,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
})

export const sendEmail = async (emailContent: EmailContent, sendTo: string[]) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: sendTo,
    html: emailContent.body,
    subject: emailContent.subject,
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}