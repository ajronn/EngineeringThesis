import React from 'react';
import { Marker } from 'react-map-gl';

import csx from "./style.scss"

interface Props {
    image: string,
    imageHeight: string,
    lat: number,
    lng: number,
    link?: string,
    label: string
}

export const Point = ({ image, imageHeight, lat, lng, link, label }: Props) => {
    const GOOGLE_URL = "http://www.google.com.pk/search?btnG=1&pws=0&q=";

    return (
        <Marker offsetTop={-imageHeight} offsetLeft={-imageHeight / 2} latitude={lat} longitude={lng}>
            <a target="_blank" href={link && GOOGLE_URL + link}>
                <img src={image}
                    height={imageHeight} />
            </a>
            <div className={csx.label}>
                {label}
            </div>
        </Marker>
    )

}