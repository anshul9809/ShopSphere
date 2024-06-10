import React from "react";
import styles from "./slider.module.scss";
import { sliderData } from "./sliderData";
import { useNavigate } from "react-router-dom";
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";


const Slider = ()=>{
    const navigate = useNavigate();
    return (
        <>
            <Carousel autoPlay interval="2000" infiniteLoop showArrows={false} showThumbs={false} showIndicators={false} className={styles.slider}>
                
                {sliderData.map((slide,index)=>{
                    const {image, desc, heading} = slide;
                    return (
                        <div key={index}>
                            <img src={image} alt="slide" />
                            <div className={styles.content}>
                                <span className={styles.span1}></span>
                                <span className={styles.span2}></span>
                                <span className={styles.span3}></span>
                                <span className={styles.span4}></span>   
                                <div className={styles.slider_desc}>
                                    <h2>{heading}</h2>
                                    <p>{desc}</p>
                                    <button className={`btn ${styles.button}`} onClick={()=>navigate("/shop")}>
                                        Shop Now
                                    </button>
                                </div>

                            </div> 
                        </div>
                    );
                })}
            </Carousel>
        </>
    );
}
export default Slider;