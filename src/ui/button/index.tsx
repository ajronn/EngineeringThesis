import React from "react";

import csx from "./style.scss"

interface Props {
    onClick(): void,
    children: string | JSX.Element,
    variant?: 'large'
}

export const Button = ({ children, onClick, variant }: Props) => {

    return (
        <button className={`${csx.butt} ${variant && csx[variant]}`} onClick={() => onClick()}>
            {children}
        </button>
    )
}