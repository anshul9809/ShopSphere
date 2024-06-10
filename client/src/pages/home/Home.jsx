import React from "react";
import styles from "./home.module.scss";
import Slider from "../../components/Slider/Slider";
import { productData } from "../../components/Carousel/productData";
import CarouselItem from "../../components/Carousel/CarouselItem";
import ProductCarousel from "../../components/Carousel/Carousel";
import ProductCategory from "../../components/ProductCategory/ProductCategory";
import FooterLinks from "../../components/Footer/FooterLinks/FooterLinks";



const Pageheading = ({heading, buttonText})=>{
    return (
        <>
            <div className={styles.headingParent}>
                <h2>{heading}</h2>
                <button className={`btn ${styles.button}`}>{buttonText}</button>
            </div>
            <hr />
        </>
    );
}


const Home = ()=>{
    const productss = productData.map((item, index)=>{
        return (
            <>
                <div>
                    <CarouselItem id={item.id} name={item.name} url={item.imageurl} price={item.price} description={item.description} />
                </div>
            </>
        );
    });
    return (
        <>
            <Slider />
            <section>
                <Pageheading heading="Featured Products" buttonText="View All" />
                <ProductCarousel products={productss} />
            </section>
            <section>
                <h3 className={styles.heading}>Latest Products</h3>
                <hr />
                <ProductCategory products={productss} />
            </section>
            
            <section>
                <Pageheading heading="Mobile Products" buttonText="View All" />
                <ProductCarousel products={productss} />
            </section>
            <FooterLinks />
        </>
    );
}
export default Home; 