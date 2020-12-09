import React, { useState } from "react";
import { Link } from "react-router-dom";

import csx from "./style.scss"

export interface Item {
    name: string,
    address: string
}

export const Navbar = () => {
    const [items, setItems] = useState<Item[]>([
        { name: "Home", address: "/" },
        { name: "Map", address: "/map" },
        { name: "About", address: "/about" },
        { name: "Contact us", address: "/contact" }
    ])

    return (
        <div className={csx.navbar}>
            <ul>
                {items.map((e, index) => {
                    return (
                        <li
                            key={index}
                            style={{ color: "black" }}>
                            <Link to={e.address}>
                                {e.name}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}