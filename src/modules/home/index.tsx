import React from "react";

import Knight from "../../ui/images/knight1.png";

import csx from "./style.scss"

export const Home = () => {

    return (
        <div className={csx.home}>
            <div className={csx.content}>
                <div>
                    <h1>Monument</h1>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                </div>
            </div>
            <div className={csx.graphic}>
                <img src={Knight} />
            </div>
        </div>

    )
}