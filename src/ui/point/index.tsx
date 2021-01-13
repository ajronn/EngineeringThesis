import React, {useState} from 'react';
import { Marker } from 'react-map-gl';
import {Protected} from "shared/guard"
import {Modal} from "ui"

import csx from "./style.scss"
import { IgnorePlugin } from 'webpack';

interface Props {
    image: string,
    imageHeight: string,
    lat: number,
    lng: number,
    link?: string,
    label: string[],
    id?: string,
    onClick?: (link:string, id:string) => void,
    fav: boolean
}

export const Point = ({ image, imageHeight, lat, lng, link, label, id, onClick, fav }: Props) => {

    return (
        <>
            <Marker offsetTop={-imageHeight} offsetLeft={-imageHeight / 2} latitude={lat} longitude={lng} >
                    <img src={image}
                        height={imageHeight}
                        onClick={()=>onClick(link, id)} />
                <div className={csx.label}>
                    {label.map((e: string, index: number) => {
                        return <>{e}<br/></>
                    })}
                </div>
            </Marker>
        </>
    )

}