import React, { useState, useEffect } from 'react';
import { useMonuments } from "shared/monuments-provider"
import InteractiveMap from 'react-map-gl';
import { API_KEY } from "utils"

import { CheckBox, Point, Modal, Button, Icon } from "ui"

import { ChangePositionModal } from "./change-position"

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

//typ Zabytek
type Monument = {
    name: string,
    fun: string,
    lat: string,
    lng: string
}

//typ Filtr
type Filter = {
    name: string,
    checked: boolean
}

export const SimpleMap = () => {
    const { data } = useMonuments(); //baza zabytkow

    const [here, setHere] = useState<null | number[]>(null); //aktualna pozycja
    const [temporaryHere, setTemporaryHere] = useState<null | number[]>(null); //tymczasowa pozycja
    const [range, setRange] = useState<number>(10); //zasieg szukania zabytkow
    const [openChangeHomePositionModal, setOpenChangeHomePositionModal] = useState<boolean>(false); //modal zmiany pozycji
    const [monuments, setMonuments] = useState<Monument[]>([]); //zabytki w promieniu range
    const [filters, setFilters] = useState<Filter[]>([]); //unikalne funkcje zabytkow monuments

    //zmien promien szukania zabytkow
    const changeRange = (value:string) => {
        setRange(parseInt(value));
    }

    //konfiguracja mapy
    const [viewport, setViewport] = useState({
        width: 400,
        height: 400,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8,
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                getPosition,
                () => { },
                { enableHighAccuracy: true }
            );
        }
    }, [range, here])

    //pobierz aktualna pozycje
    const getPosition = (position: any) => {
        setViewport({
            width: 1200,
            height: 400,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 8,
        })
        if(here === null) setHere([position.coords.latitude, position.coords.longitude]);
        if(here === null) {
            handleData(position.coords.latitude, position.coords.longitude);
        } else {
            handleData(here[0], here[1]);
        }
    }

    //pobierz dane
    const handleData = (coordsLat: number, coordsLng: number) => {
        const monuments: Monument[] = [];

        data.map((e:any) => {
            if(calcDistance(coordsLat,coordsLng, parseFloat(e.lat), parseFloat(e.lng)) <= range){
                monuments.push({name: e.name, fun: e.fun, lat: e.lat, lng: e.lng});
            }
        })

        makeFilters(monuments);
        setMonuments(monuments)
    }

    //stworz liste filtrow na podstawie zabytkow
    const makeFilters = (monuments: Monument[]) => {
        const temporaryFilters:Filter[] = [];

        monuments.map((e:Monument) => {
            if(!contain(temporaryFilters.map((e:Filter)=>e.name), e.fun.toLowerCase())){
                temporaryFilters.push({name: e.fun.toLowerCase(), checked: false});
            }
        })

        setFilters(temporaryFilters);
    }

    //czy element value zawiera sie w tablicy array?
    const contain = (array:string[], value: string):boolean => {
        for(let i = 0; i<array.length; i++){
            if(array[i] === value) return true;
        }
        return false;
    }

    //oblicz dystans pomiedzy punktami
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

    //otwiera modal zmiany pozycji
    const changeHomePositionHandle = (value: number[]) => {
        setOpenChangeHomePositionModal(true);
        setTemporaryHere([value[1],value[0]]);
    }

    //zmienia aktualna pozycje
    const changeHomePosition = () => {
        setHere(temporaryHere);
        setOpenChangeHomePositionModal(false);
    }

    const check = (value: boolean, name: string) => {
        let tmp:Filter[] = [];
        filters.map((e: Filter) => {
            if(e.name === name){
                tmp.push({name: e.name, checked: value})
            } else {
                tmp.push({name: e.name, checked: e.checked})
            }
        })
        setFilters(tmp)
    }

    return (
        <div className={csx.map}>
            <Icon 
                image={PinYou} 
                height="20" 
                label={`lat: ${Math.round((here !== null ? here[0] : 0) * 10000) / 10000}, lng: ${Math.round((here !== null ? here[1] : 0) * 10000) / 10000}`}
            />

            <InteractiveMap
                {...viewport}
                mapboxApiAccessToken={API_KEY}
                onViewportChange={nextViewport => setViewport(nextViewport)}
                onClick={ (e) => changeHomePositionHandle(e.lngLat)}
            >
                {/* Aktualne polozenie */}
                <Point
                    lat={(here !== null ? here[0] : 0)}
                    lng={(here !== null ? here[1] : 0)}
                    image={PinYou}
                    imageHeight={"15"}
                    label={["You"]} />

                {/*Zabytki w okregu poszukiwan wedlug filtrow*/}
                {monuments.map((e:Monument)=> {
                    for(let i = 0; i<filters.length; i++){
                        if(e.fun.toLocaleLowerCase() === filters[i].name && filters[i].checked === true){
                            return <Point 
                                        lat={parseFloat(e.lat)} 
                                        lng={parseFloat(e.lng)}
                                        image={PinMonument}
                                        imageHeight={"15"}
                                        label={[e.name]} />
                        }
                    }
                })}
            </InteractiveMap>

            {/*Kontrolka zmiany zasiegu szukania zabytkow */}
            Range
            <select onChange={(e)=> changeRange(e.target.value)}>
                <option selected value="10">10 km</option>
                {[...Array(9)].map((_, i) => <option value={(10*i+20).toString()}>{10*i+20} km</option>)}
            </select>

            {filters.map((e:Filter)=>{
                return <CheckBox label={e.name} onChange={(value, name)=>check(value, name)} value={e.checked} />
            })}

            {/*Modal zmiany pozycji*/}
            <Modal open = {openChangeHomePositionModal}>
                <ChangePositionModal 
                    accept={()=>changeHomePosition()} 
                    cancel={()=>setOpenChangeHomePositionModal(false)}
                    label={`${temporaryHere && Math.round(temporaryHere[0]*100)/100}, ${temporaryHere && Math.round(temporaryHere[1]*100)/100}`} />
            </Modal>
        </div >
    );
}