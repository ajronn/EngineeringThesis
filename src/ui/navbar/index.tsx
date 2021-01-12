import { clearStorage } from "mapbox-gl";
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "shared/firebase"
import {Protected, Unprotected} from "shared/guard"

import csx from "./style.scss"

export interface Item {
    name: string,
    address: string
}

export const Navbar = () => {
    const ctx = useContext(UserContext);
    const [items, setItems] = useState<Item[]>([
        { name: "Home", address: "/" },
        { name: "Map", address: "/map" },
        { name: "About", address: "/about" },
        { name: "Contact us", address: "/contact" }
    ])

    return (
        <div className={csx.navbar}>
            <div className={csx.left} >
                {items.map((e, index) => {
                        return (
                            <div
                                key={index}
                                style={{ color: "black" }}>
                                <Link to={e.address} >
                                    {e.name}
                                </Link>
                            </div>
                        )
                    })}
            </div>
            <div className={csx.right} >
                <Unprotected>
                    <div onClick={ctx.login}>Login</div> 
                </Unprotected>
                <Protected>
                    <>
                        <div onClick={ctx.logout}>Logout</div>
                        <img src={ctx.photoURL} />
                    </>
                </Protected>
            </div>
        </div>
    )
}