"use client"
import {getAllProducts, scrapeAndStoreProduct} from "@/lib/actions";
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

const Searchbar = () => {

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
            setIsLoading(false)
            //Redirect to the last product
            const allProducts = await getAllProducts();
            const lastProduct = allProducts?.length ? allProducts[allProducts.length - 1] : null;
            window.open(`/products/${lastProduct?._id}`,"_self")
        }

    }
    return (
        <form className="flex flex-wrap gap-4 mt-12"
        onSubmit={handleSubmit}
        >
            <input
            type="text"
            value={searchPrompt}
            onChange={(e)=>setSearchPrompt(e.target.value)}
            placeholder="Enter Product link"
            className="searchbar-input"
            />

            <button
                className="searchbar-btn"
                type="submit"
                disabled={searchPrompt===''}
            >
                {isLoading ? "Searching..." : "Search"}
            </button>
        </form>
    )
}

export default Searchbar