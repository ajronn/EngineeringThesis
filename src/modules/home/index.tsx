import React from "react";

import "images/castle.jpg";

import csx from "./style.scss"

export const Home = () => {

    return (
        <div className={csx.home}>
            <div className={csx.content}>
                <h1>Monument</h1>
            </div>
            <div className={csx.graphic}>
                <img src="" />
            </div>
        </div>

    )
}