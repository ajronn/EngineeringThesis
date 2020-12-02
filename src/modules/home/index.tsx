import React from "react";

import { useMonuments } from "shared/monuments-provider"

import Knight from "../../ui/images/knight1.png";

import csx from "./style.scss"
import SimpleMap from "../map";

export const Home = () => {
    const { data } = useMonuments();

    return (
        <>
            <SimpleMap />
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
            {
                data.map((e: any) => {
                    // return <div>{`id: ${e.id}, protect: ${e.protect}, positionAccuracy: ${e.positionAccuracy}, name: ${e.name}, chronology: ${e.chronology}, fun: ${e.fun}, document: ${e.document}, date: ${e.date}, region: ${e.region}, district: ${e.district}, community: ${e.community}, town: ${e.town}, number: ${e.number}`}</div>
                    return <p>{`name: ${e.name}, chronology: ${e.chronology}, region: ${e.region}`}</p>
                })
            }
        </>

    )
}