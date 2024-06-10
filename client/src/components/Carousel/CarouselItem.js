import React from "react";
import "react-multi-carousel/lib/styles.css";

import styles from "./carousel.module.scss";
import { shortenText } from "../../utils";
import { Link } from "react-router-dom";
const CarouselItem = ({id,url, name, price, description})=>{

    return (
        <div className={styles.carousel_item} key={id}>
            <Link to="/product-details" >
                <img src={url} alt={name} className={styles.carousel_image} />
                <div className={styles.carousel_desc}>
                    <p className={styles.carousel_price}>
                        &#8377; {price} 
                    </p>
                    <h4 className={styles.carousel_name}>{shortenText(name,18)}</h4>
                    <p className={styles.carousel_description}>{shortenText(description, 30)}</p>
                </div>  
            </Link>
                <button className={`btn ${styles.carousel_add_cart}`}>Add to Cart</button>

        </div>
    );
}

export default CarouselItem;