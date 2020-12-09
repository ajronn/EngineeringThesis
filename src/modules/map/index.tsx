import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { API_KEY } from "utils"
import { useMonuments } from "shared/monuments-provider"
import { CheckBox } from "ui"

import csx from "./style.scss";

type MarkerItem = {
    lat: number,
    lng: number,
    name: string,
    fun: string
}

export const SimpleMap = () => {
    const { data } = useMonuments();
    const [markers, setMarkers] = useState<MarkerItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [filters, setFilters] = useState<string[]>([]);

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
    }, [])

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
                if (calcDistance(position.coords.latitude, position.coords.longitude, parseFloat(e.lat), parseFloat(e.lng)) < 5) {
                    marks.push({ lat: parseFloat(e.lat), lng: parseFloat(e.lng), name: e.name, fun: e.fun });
                    if (!contain((e.fun + "").toLowerCase(), cats)) {
                        cats.push((e.fun + "").toLowerCase())
                    }
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

    const calcDistance = (x1: number, y1: number, x2: number, y2: number): number => {
        const a = (x2 - x1) * (x2 - x1);
        const b = Math.cos(x1 * Math.PI / 180) * (y2 - y1) * Math.cos(x1 * Math.PI / 180) * (y2 - y1);
        const c = Math.sqrt(a + b);
        return c * 40075.704 / 360;
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
                <Marker className={csx.marker} latitude={here[0]} longitude={here[1]}>
                    <img src="https://www.flaticon.com/svg/static/icons/svg/684/684908.svg"
                        height={viewport.zoom * 1.2 + ""} />
                    <span className={csx.label} style={{ fontSize: viewport.zoom * 1.5 + "px" }}>You</span>
                </Marker>
                {markers.map((e: MarkerItem) => {
                    if (contain(e.fun, filters)) {
                        return (
                            <Marker className={csx.marker} latitude={e.lat} longitude={e.lng}>
                                <img className={csx.image} src="https://www.flaticon.com/svg/static/icons/svg/715/715696.svg"
                                    height={viewport.zoom * 2 + ""} />
                                <span className={csx.label} style={{ fontSize: viewport.zoom * 1.5 + "px" }}>{e.name}</span>
                            </Marker>
                        )
                    }
                })}
            </ReactMapGL>
            Monuments: {markers.length}<br />
            Types: {filters.length}/{ categories.length}<br /><br />
            { categories.map((e: string, index: number) => <CheckBox key={index} label={e} onClick={(evt: boolean) => select(evt, e)} />)}
        </div >
    );
}