"use client"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Image from "next/image";

const heroImages = [
    {imgUrl : '/assets/images/hero-1.svg',alt:'air fryer'},
    {imgUrl : '/assets/images/hero-2.svg',alt:'bag'},
    {imgUrl : '/assets/images/hero-3.svg',alt:'lamp'},
    {imgUrl : '/assets/images/hero-4.svg',alt:'chair'},
    {imgUrl : '/assets/images/hero-5.svg',alt:'smatchwatch'},
]

const HeroCarousel = () => {
  return (
    <div className="hero-carousel">
        <Carousel
            showThumbs={false}
            autoPlay
            infiniteLoop
            interval={2000}
            showArrows={false}
            showStatus={false}
        >
            {heroImages.map((image)=>(
                <Image
                    src={image.imgUrl}
                    alt={image.alt}
                    key={image.alt}
                    width={560}
                    height={560}
                    className="object-contain"
                />
            ))}
        </Carousel>

        <Image
            src="assets/icons/hand-drawn-arrow.svg"
            alt="arrow"
            width={175}
            height={175}
            className="max-xl:hidden absolute -left-[15%] bottom-0 z-0"
        />
    </div>
  )
}

export default HeroCarousel