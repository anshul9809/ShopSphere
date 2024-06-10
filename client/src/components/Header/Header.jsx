import React from "react";
import styles from "./header.module.scss";
import { useState} from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/img/logo.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart ,faBars, faTimes } from '@fortawesome/free-solid-svg-icons';


const Header = ()=>{
    const [showMenu, setShowMenu] = useState(false);
    const [scrollPage, setScrollPage] = useState(false);

    const stickNavbar = ()=>{
        if(window.scrollY > 90){
            setScrollPage(true);
        }
        else{
            setScrollPage(true);
        }
    }
    window.addEventListener("scroll", stickNavbar);

    const handleToggleMenu = () => {
        setShowMenu(!showMenu);
    };
    const cart = (
        <span className={styles.header_cart_icon}>
            <Link to='/cart' className="position-relative">
                <FontAwesomeIcon icon = {faShoppingCart} className={styles.header_icon}/>
            </Link>
            <p className={styles.header_cart_icon_number}>0</p>
        </span>
    );

    return(
        <>
            <header className={`${styles.header} ${scrollPage? styles.sticky:""}`}>
                <div className={styles.header_logo}>
                    <Link to="/">
                        <img src={logo} alt="" className={styles.header_logo_img} loading="lazy"/>
                    </Link>
                </div>
                <div className={`${styles.header_right}`}>
                    {/* <div className={styles.hamburger} onClick={handleToggleMenu}>
                        <div className={styles.line}></div>
                        <div className={styles.line}></div>
                        <div className={styles.line}></div>
                    </div> */}
                    <ul className={`${styles.header_menu} ${showMenu?styles.active:""}`}>
                        <li><NavLink className={styles.header_item}>Login / Register</NavLink></li>
                        <li><NavLink className={styles.header_item}>My Orders</NavLink></li>
                    </ul>
                    {cart}
                    <div className={styles.menu_icon} onClick={handleToggleMenu}>
                        <FontAwesomeIcon className={styles.header_icon} icon={showMenu ? faTimes : faBars} />
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;