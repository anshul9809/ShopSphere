import React from "react";
import styles from "./productcategory.module.scss";
import { useNavigate } from "react-router-dom";

const categories = [
    {
      id: 1,
      title: "Gadgets",
      image: "https://i.ibb.co/5GVkd3m/c1.jpg",
    },
    {
      id: 2,
      title: "Womens Fashion",
      image: "https://i.ibb.co/nQKLjrW/c2.jpg",
    },
    {
      id: 3,
      title: "Sport Sneakers",
      image: "https://i.ibb.co/fNkBYgr/c3.jpg",
    },
];

const Category = ({title, image})=>{
    const navigate = useNavigate();
    return (
        <div className={styles.category}>
            <h3>{title}</h3>
            <img src={image} alt="img" className={styles.category_image} />
            <button className={`btn ${styles.shop_button}`} onClick={() => navigate("/shop")}>
                {"Shop Now"}
            </button>
        </div>
    );
}

const ProductCategory = ()=>{
    return(
        <>
            <div className={styles.categories}>
                {categories.map((cat) => {
                    return (
                    <div key={cat.id}>
                        <Category title={cat.title} image={cat.image} />
                    </div>
                    );
                })}
            </div>
        </>
    );
}

export default ProductCategory;