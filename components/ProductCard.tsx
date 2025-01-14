import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'

interface Props {
  product: Product
}

const ProductCard = ({product}:Props) =>{
  return (
    <Link href={`/products/${product._id}`} className='product-card'>
        <div className='product-card_img-container'>
            <Image
                src={product.image}
                alt={product.title}
                width={200}
                height={200}
                className='product-card_img'
            />
        </div>

        <div className='flex flex-col gap-3 rounded-xl m-2.5 p-2'>
            <h3 className='product-title'>{product.title}</h3>
            <div className='flex justify-between gap-4'>
                <p className='text-black opacity-50 text-lg capitalize truncate'>
                    {product.category}
                </p>
                <p className='text-black text-lg font-semibold'>
                    <span>{product?.currency}</span>
                    <span>{product?.currentPrice}</span>
                </p>
            </div>
        </div>
    </Link>
  )
}

export default ProductCard