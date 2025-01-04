import HeroCarousel from "@/components/HeroCarousel"
import Searchbar from "@/components/Searchbar"
import Image from "next/image"
import { getAllProducts } from "@/lib/actions"
import ProductCard from "@/components/ProductCard"
import TrendingProduct from "@/components/TrendingProduct"

const Home = async()=> {
  const allProducts = await getAllProducts();
  return (
    <>
    <section className="px-6 md:px-20 py-12">
      <div className="flex max-xl:flex-col gap-16">
        <div className="flex flex-col justify-center">
          <p className="small-text">
            Smart Shopping Starts Here:
            <Image
              src="/assets/icons/arrow-right.svg"
              alt="arrow-right"
              width={16}
              height={16}
            />
          </p>

          <h1 className="head-text">
            Unleash the Power of
            <span className="text-primary"> PriceTrap</span>
          </h1>

          <p className="mt-6">
            PriceTrap is a price comparison website that helps you find the best deals on the products you love. Never miss a deal with PriceTrap!
          </p>

          <Searchbar/>
        </div>
          <HeroCarousel/>
      </div>
    </section>

      <section className="trending-section">
        <h2 className="section-text">Trending</h2>

        <TrendingProduct/>
      </section>
    </>
  )
}

export default Home