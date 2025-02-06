import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextResponse } from "next/server";

export const maxDuration =60; //1 hour
export const dynamic ='force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        connectToDB();
        const products = await Product.find({});
        if (!products) throw new Error("No products fetched");

        // 1. Scrape Latest Product Details & Update in DB
        const updatedProducts = await Promise.all(
            products.map(async (currentProduct) => {
                let scrapedProduct;
                try {
                    scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
                    if (!scrapedProduct || !scrapedProduct.currentPrice) {
                        console.error(`Scraping failed or returned no price for: ${currentProduct.url}`);
                        return;
                    }
                } catch (err:any) {
                    console.error(`Error scraping product ${currentProduct.url}:`, err.message);
                    return; // Skip this product and continue with others
                }

                const updatedPriceHistory = Array.isArray(currentProduct.priceHistory) 
                    ? [...currentProduct.priceHistory, { price: scrapedProduct.currentPrice }] 
                    : [{ price: scrapedProduct.currentPrice }];

                const product = {
                    ...scrapedProduct,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory),
                };

                const updatedProduct = await Product.findOneAndUpdate(
                    { url: product.url },
                    product,
                    { new: true }
                );

                // 2. Check Product Status & Send Email Notification
                if (updatedProduct) {
                    const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);

                    if (emailNotifType && updatedProduct?.users?.length > 0) {
                        const productInfo = {
                            title: updatedProduct.title,
                            url: updatedProduct.url,
                            image: updatedProduct.image,
                        };

                        const emailContent = await generateEmailBody(productInfo, emailNotifType);
                        const userEmails = updatedProduct.users.map((user: any) => user.email);

                        await sendEmail(emailContent, userEmails);
                    }
                }

                return updatedProduct;
            })
        );

        return NextResponse.json({
            message: "OK",
            data: updatedProducts.filter(Boolean), // Remove undefined values
        });
    } catch (e: any) {
        console.error(`Error in GET: ${e.message}`);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

