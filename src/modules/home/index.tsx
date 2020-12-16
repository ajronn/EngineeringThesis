import React, { useState } from "react";

import { useMonuments } from "shared/monuments-provider"

import Knight from "../../ui/images/knight1.png";

import csx from "./style.scss"

export const Home = () => {
    const { data } = useMonuments();
    const search = (e: any) => {
        fetch('https://api.opencagedata.com/geocode/v1/json?q=' + e.address.replace(" ", "%2C%20") + "%2C%20" + e.region + '&key=fd4a9dad69cc4049a458228d3ee82823')
            .then(response => response.json())
            .then(d => console.log(`{"id": "${e.id}", "protect": "${e.protect}", "positionAccuracy": "${e.positionAccuracy}", "name": "${e.name}", "chronology": "${e.chronology}", "fun": "${e.fun}", "document": "${e.document}", "date": "${e.date}", "region": "${e.region}", "district": "${e.district}", "community": "${e.community}", "town": "${e.town}", "street": "${e.street}", "number": "${e.number}", "address": "${e.address}", "lat": "${d.results[0].geometry.lat}", "lng": "${d.results[0].geometry.lng}"},`));
    }

    const fun = () => {
        console.clear()
        let counter = 3437;
        console.log(data.length)
        // setInterval(() => {
        //     if (counter < data.length) {
        //         search(data[counter])
        //     } counter++;
        // }, 100);
        // {
        //     data.map((e: any, index: number) => {
        //         if (e.id === "PL.1.9.ZIPOZ.NID_N_28_BK.148781") {
        //             console.log(index)
        //         }
        //     })
        // }
    }

    return (
        <>
            {/* <SimpleMap /> */}
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

            {/* {
                data.map((e: any) => {
                    // return <p key={e.id}>{`{"id": "${e.id}", "protect": "${e.protect}", "positionAccuracy": "${e.positionAccuracy}", "name": "${e.name}", "chronology": "${e.chronology}", "fun": "${e.fun}", "document": "${e.document}", "date": "${e.date}", "region": "${e.region}", "district": "${e.district}", "community": "${e.community}", "town": "${e.town}", "street": "${e.street}", "number": "${e.number}", "address": "${e.town !== "" ? e.town : ""}${e.street !== "" ? " " + e.street : ""}${e.number !== "" ? " " + e.number : ""}"},`}</p>
                    // const a = search(e.address);
                    // return <p key={e.id}>{`{"id": "${e.id}", "protect": "${e.protect}", "positionAccuracy": "${e.positionAccuracy}", "name": "${e.name}", "chronology": "${e.chronology}", "fun": "${e.fun}", "document": "${e.document}", "date": "${e.date}", "region": "${e.region}", "district": "${e.district}", "community": "${e.community}", "town": "${e.town}", "street": "${e.street}", "number": "${e.number}", "address": "${search(e.address)}", "lat": "", "lng": ""},`}</p>
                    // return <p key={e.id}>{search(e.address)}</p>
                })
            } */}
            <button onClick={() => fun()}>KLIK</button>
        </>

    )
}