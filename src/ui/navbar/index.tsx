import React from "react";

import csx from "./style.scss"

export interface Props {
    items: {
        name: string,
        active: boolean
    }[]
}

export const Navbar = ({ items }: Props) => {

    return (
        <div className={csx.navbar}>
            <ul>
                {items.map(e => <li className={`${e.active && csx.active}`}>{e.name}</li>)}
            </ul>
        </div>
    )
}