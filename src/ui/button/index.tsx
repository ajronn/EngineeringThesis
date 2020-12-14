import React from "react";

import csx from "./style.scss"

interface Props {
    onClick(): void,
    children: string
}

export const Button = ({ children, onClick }: Props) => {

    return (
        <button className={csx.butt} onClick={() => onClick()}>
            {children}
        </button>
    )
}