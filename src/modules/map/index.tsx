import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { API_KEY } from "utils"
import { useMonuments } from "shared/monuments-provider"
import { CheckBox, Point, Modal, Button, Icon } from "ui"
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

    const [here, setHere] = useState([0, 0]);
    const [markers, setMarkers] = useState<MarkerItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [filters, setFilters] = useState<string[]>([]);
    const [range, setRange] = useState("10");
    const [modal, setModal] = useState(false);

    const [viewport, setViewport] = useState({
        width: 400,
        height: 400,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8,
    });

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
            zoom: 8,
        })

        setHere([position.coords.latitude, position.coords.longitude])
        const marks: MarkerItem[] = [];
        const cats: string[] = [];
        {
            data.map((e: any) => {
                if (calcDistance(e.lat, e.lng, position.coords.latitude, position.coords.longitude) <= parseInt(range)) {
                    marks.push({ lat: parseFloat(e.lat), lng: parseFloat(e.lng), name: e.name, fun: e.fun, address: e.address });
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

    const handleRange = (value: string) => {
        setRange(value);
        setFilters([]);
        setCategories([])
    }

    const handleModal = (value: boolean) => {
        setModal(value);
    }

    return (
        <div className={csx.map}>
            <Icon image={PinYou} height="20" label={`lat: ${here[0]}, lng: ${here[1]}`} />
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={API_KEY}
                onViewportChange={nextViewport => setViewport(nextViewport)}
            >
                <Point
                    lat={here[0]}
                    lng={here[1]}
                    image={PinYou}
                    imageHeight={"15"}
                    label={"You"} />
                {markers.map((e: MarkerItem, index: number) => {
                    if (contain(e.fun, filters)) {
                        return (
                            <Point
                                key={index}
                                lat={e.lat}
                                lng={e.lng}
                                link={e.name + " " + e.address}
                                image={PinMonument}
                                imageHeight={"15"}
                                label={`${e.fun.charAt(0).toUpperCase()}${e.fun.slice(1)} / ${e.name} / ${e.address}`} />
                        )
                    }
                })}
            </ReactMapGL>
            <Button onClick={() => handleModal(true)} >{`Filters (${categories.length})`}</Button>
            <Modal open={modal} >
                <div>
                    <div className={csx.close} onClick={() => handleModal(false)} >
                        Close
                    </div>
                    <div className={csx.info} >
                        <p>Monuments: {markers.length}/{data.length}</p>
                        <p>Types: {filters.length}/{categories.length}</p>
                    </div>
                    <div className={csx.modal}>
                        {categories.map((e: string, index: number) =>
                            <CheckBox
                                key={index}
                                label={e}
                                onClick={(evt: boolean) => select(evt, e)} />
                        )}
                    </div>
                </div>
            </Modal>
            Range {range}km <input type="range" min="0" max="300" step="10" defaultValue="10" onChange={(e) => handleRange(e.target.value)} /><br />
        </div >
    );
}