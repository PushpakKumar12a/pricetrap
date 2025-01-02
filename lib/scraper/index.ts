import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url:string){
    if (!url) return

    //BrightData proxy configuration
    const username = String(process.env.BRIGH_TDATA_USERNAME)
    const password = String(process.env.BRIGH_TDATA_PASSWORD)
    const port=33335
    const session_id=(1000000 * Math.random()) | 0;
    const options={
        auth:{
            username:`${username}-session-${session_id}`,
            password,
        },
        host:'brd.superproxy.io',
        port,
        rejectUnauthorized:false,
    }

    try{
        //Fetch the product page
        const response = await axios.get(url,options);
        const $ = cheerio.load(response.data);
        //Extract the product title
        const title = $("#productTitle").text().trim();
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base')
        );

        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('#.a-size-base.a-color-base')
        );

        const images = 
        $('#imageBlkFront').attr('data-a-dynamic-image') ||
        $('#landingImage').attr('data-a-dynamic-image');

        const imageUrls = Object.keys(JSON.parse(images || '{}'));

        const currency = extractCurrency($('.a-price-symbol'));

        const outofStock = $('#availability span').text().trim().toLowerCase() === 'Currently unavailable' ;

        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '');

        const description = extractDescription($);

        const data ={
            url,
            title,
            image:imageUrls[0],
            currency:currency || '$',
            priceHistory:[],
            currentPrice:Number(currentPrice),
            originalPrice:Number(originalPrice),
            discountRate:Number(discountRate),
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            averagePrice: (Number(currentPrice) + Number(originalPrice))/2,
            reviewsCount:100,
            stars:4.5,
            isOutOfStock:outofStock,
            category:'category',
            description,
        }

        return data;


    }catch(error:any){
        throw new Error(`Failed to scrape product product: ${error.message}`)
    }

}