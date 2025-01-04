import { getAllProducts } from "@/lib/actions";
import ProductCard from "./ProductCard";

const TrendingProduct = async() => {
  const allProducts = await getAllProducts();
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-16">
        {allProducts?.sort(() => 0.5 - Math.random()).slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product}/>
        ))}
    </div>
  )
}

export default TrendingProduct
