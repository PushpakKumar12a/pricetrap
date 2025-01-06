"use client"
import {getAllProducts, scrapeAndStoreProduct} from "@/lib/actions";
import Image from "next/image";
// import { scrapeAmazonProduct } from "@/lib/scraper";
import { FormEvent,useState } from "react";

const isValidAmazonProductURL = (url:string)=>{
    try{
        const parsedUrl = new URL(url)
        const hostname = parsedUrl.hostname

        //check if the hostname contains amazon.countrycode
        if(
            hostname.includes("amazon.") ||
            hostname.endsWith("amazon")
        ){
            return true
        }
    }catch(error){
        return false
    }
    return false
}

const Searchbartop = () => {

    const [searchPrompt,setSearchPrompt]=useState("")
    const [isLoading,setIsLoading]=useState(false)

    const handleSubmit = async(event:FormEvent<HTMLFormElement>)=>{
        event.preventDefault()

        const isValidLink = isValidAmazonProductURL(searchPrompt)

        if(!isValidLink) return alert("Please enter a valid Amazon product link")

        try{
            setIsLoading(true);

            //Scrape the product page
            const product = await scrapeAndStoreProduct(searchPrompt)
        }catch(error){
            console.log(error)
        }finally{
            // setIsLoading(false)
            //Redirect to the last product
            const allProducts = await getAllProducts();
            const lastProduct = allProducts?.length ? allProducts[allProducts.length - 1] : null;
            window.open(`/products/${lastProduct?._id}`,"_self")
        }

    }
    return (
        <form onSubmit={handleSubmit} className={`relative flex items-center w-full max-w-lg`}>
            <div className={`relative w-full ${isLoading ? 'loading' : ''}`}>
                <input
                    type="text"
                    value={searchPrompt}
                    onChange={(e) => setSearchPrompt(e.target.value)}
                    placeholder="Enter Product link"
                    className="searchbartop-input"
                />
                <div className="absolute inset-0 rounded-lg pointer-events-none border-animation"></div>
            </div>
            <button
                className="searchbartop-btn"
                type="submit"
                disabled={searchPrompt === '' || isLoading}
            >
                {isLoading ? (
                    <div className="loader"></div>
                ) : (
                    <Image
                        src="/assets/icons/search.svg"
                        alt="search"
                        width={20}
                        height={20}
                    />
                )}
            </button>
        </form>
    );
}

export default Searchbartop