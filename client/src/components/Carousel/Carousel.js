import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { responsive } from "./productData";

import styles from "./carousel.module.scss";



const ProductCarousel = ({products}) => {

    return (
        <>
            <Carousel className={styles.carousel} showDots={false} responsive={responsive} infinite={true} autoPlay={true} autoPlaySpeed={2000} customTransition="all ease-in-out 300ms" transitionDuration={900}>

                {products}

            </Carousel>
        </>
    )
}

export default ProductCarousel;