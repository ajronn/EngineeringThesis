import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { API_KEY } from "utils"
import { useMonuments } from "shared/monuments-provider"
import { CheckBox } from "ui"
import PinYou from "ui/images/pin_you.png";
import PinMonument from "ui/images/pin_monument.png"

import csx from "./style.scss";

type MarkerItem = {
    lat: number,
    lng: number,
    name: string,
    fun: string
    address: string
}

export const SimpleMap = () => {
    const { data } = useMonuments();
    const [markers, setMarkers] = useState<MarkerItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [filters, setFilters] = useState<string[]>([]);
    const [range, setRange] = useState("10");
    const GOOGLE_URL = "http://www.google.com.pk/search?btnG=1&pws=0&q=";

    const [viewport, setViewport] = useState({
        width: 400,
        height: 400,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8,
    });

    const [here, setHere] = useState([0, 0]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getPosition, () => { }, { enableHighAccuracy: true });
        }
    }, [range])

    const getPosition = (position: any) => {
        setViewport({
            width: 1200,
            height: 400,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            // latitude: 53.72418680459322,
            // longitude: 20.472107390515273,
            zoom: 8,
        })
        setHere([position.coords.latitude, position.coords.longitude])
        const marks: MarkerItem[] = [];
        const cats: string[] = [];
        {
            data.map((e: any) => {

                marks.push({ lat: parseFloat(e.lat), lng: parseFloat(e.lng), name: e.name, fun: e.fun, address: e.address });
                if (!contain((e.fun + "").toLowerCase(), cats)) {
                    cats.push((e.fun + "").toLowerCase())
                }

            })
        }
        setCategories(cats.sort())
        setMarkers(marks);
    }

    const contain = (value: string, array: string[]): boolean => {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === value)
                return true;
        }
        return false;
    }

    // const calcDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    //     const a = (x2 - x1) * (x2 - x1);
    //     const b = Math.cos(x1 * Math.PI / 180) * (y2 - y1) * Math.cos(x1 * Math.PI / 180) * (y2 - y1);
    //     const c = Math.sqrt(a + b);
    //     return c * 40075.704 / 360;
    // }

    const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344;
            return dist;
        }
    }

    const select = (checked: boolean, name: string) => {
        if (checked) {
            setFilters([...filters, name]);
        } else {
            setFilters(filters.filter(e => e !== name));
        }
    }

    return (
        <div className={csx.map}>
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={API_KEY}
                onViewportChange={nextViewport => setViewport(nextViewport)}
            >
                <Marker latitude={here[0]} longitude={here[1]}>
                    <img src={PinYou}
                        height={viewport.zoom * 1.2 + ""} />
                    <span className={csx.label} style={{ fontSize: viewport.zoom * 1.5 + "px" }}>You</span>
                </Marker>
                {markers.map((e: MarkerItem) => {
                    if (contain(e.fun, filters)) {
                        return (
                            <Marker latitude={e.lat} longitude={e.lng}>
                                <a target="_blank" href={GOOGLE_URL + e.name + " " + e.address}>
                                    <img src={PinMonument}
                                        height={viewport.zoom * 1.5 + ""} />
                                </a>
                                <div className={csx.label} style={{ fontSize: viewport.zoom + "px" }}>
                                    {e.name}<br />
                                    {e.address}
                                </div>
                            </Marker>
                        )
                    }
                })}
            </ReactMapGL>
            Your position: lat: {here[0]}, lng: {here[1]}<br />
            Range {range}km <input type="range" min="0" max="300" step="10" defaultValue="10" onChange={(e) => setRange(e.target.value)} /><br />
            Monuments: {markers.length}/{data.length}<br />
            Types: {filters.length}/{ categories.length}<br /><br />
            { categories.map((e: string, index: number) => <CheckBox key={index} label={e} onClick={(evt: boolean) => select(evt, e)} />)}
        </div >
    );
}