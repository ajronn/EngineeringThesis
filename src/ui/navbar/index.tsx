import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "shared/firebase"
import {Protected, Unprotected} from "shared/guard"

import FullHeart from "ui/images/fullheart.png"

import csx from "./style.scss"

export interface Item {
    name: string,
    address: string
}

export const Navbar = () => {
    const ctx = useContext(UserContext);
    const [openPopup, setOpenPopup] = useState(false);

    const items:Item[] = [
        { name: "Home", address: "/" },
        { name: "Map", address: "/map" },
        { name: "About", address: "/about" },
        { name: "Contact us", address: "/contact" }
    ];

    return (
        <div className={csx.navbar}>
            <div className={csx.left} >
                {items.map((e, index) => {
                        return (
                            <span key={index}>
                                <Link className={csx.link} to={e.address}  >
                                    {e.name}
                                </Link>
                            </span>
                    )
                })}
            </div>
            <div className={csx.right} >
                    <Unprotected>
                        <span onClick={ctx.login}>Login</span> 
                    </Unprotected>
                    <Protected>
                        <>
                            <span onClick={ctx.logout}>Logout</span>
                            <span className={csx.popupContainer} >
                                <img onClick={()=>setOpenPopup((state)=>!state)} src={ctx.photoURL}/>
                                    <div className={`${csx.popup} ${!openPopup && csx.popupClose}`} >
                                        <p><img src={FullHeart} />{ctx.favourites.length}</p>
                                    </div>
                                </span>
                        </>
                    </Protected>
            </div>
        </div>
    )
}