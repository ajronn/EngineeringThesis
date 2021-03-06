import React, { useState, useEffect, useContext } from 'react';
import { useMonuments } from "shared/monuments-provider"
import InteractiveMap from 'react-map-gl';
import { API_KEY } from "utils"
import {UserContext } from "shared/firebase"
import {Protected } from "shared/guard"

import { Point, Modal, Button, Icon } from "ui"

import { ChangePositionModal } from "./change-position"
import FiltersModal from './filters';
import PinModal from './pin-modal';

import PinYou from "ui/images/pin_you.png";
import PinMonument from "ui/images/pin_monument.png"
import FullHeart from "ui/images/fullheart.png"
import Share from "ui/images/share.png"

import csx from "./style.scss";

//typ Zabytek
type Monument = {
    id: string,
    name: string,
    fun: string,
    town: string,
    address: string,
    lat: string,
    lng: string,
    fav: boolean,
}

//typ Filtr
type Filter = {
    name: string,
    checked: boolean
}

export const SimpleMap = () => {
    const { data } = useMonuments(); //baza zabytkow
    const ctx = useContext(UserContext);

    const [here, setHere] = useState<null | number[]>(null); //aktualna pozycja
    const [temporaryHere, setTemporaryHere] = useState<null | number[]>(null); //tymczasowa pozycja
    const [range, setRange] = useState<number>(10); //zasieg szukania zabytkow
    const [openChangeHomePositionModal, setOpenChangeHomePositionModal] = useState<boolean>(false); //modal zmiany pozycji
    const [openFiltersModal, setOpenFiltersModal] = useState<boolean>(false); //modal zmiany filtrow
    const [openPinModal, setOpenPinModal] = useState<boolean>(false); //modal pinezki
    const [monuments, setMonuments] = useState<Monument[]>([]); //zabytki w promieniu range
    const [filters, setFilters] = useState<Filter[]>([]); //unikalne funkcje zabytkow monuments
    const [currentLink, setCurrentLink] = useState<string>('');
    const [currentMonument, setCurrentMonument] = useState<Monument>({
        id: '',
        name: '',
        fun: '',
        address: '',
        town: '',
        lat: '',
        lng: '',
        fav: false,
    });

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
                monuments.push({id: e.id, name: e.name, fun: e.fun, town: e.town,address: e.address , lat: e.lat, lng: e.lng, fav: false});
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

        setFilters(temporaryFilters.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))); //sortowanie listy obiektow wzgledem pola name
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

    //zmienia wartosc checkboxow
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

    //otwiera modal pinezki
    const openPinModalHandle = (link:string, id:string, name: string, fun: string, town: string, address: string, lat: string, lng: string, fav: boolean) => {
        setOpenPinModal(true);
        setCurrentLink(link)
        setCurrentMonument({
            id: id,
            name: name,
            fun: fun,
            address: address,
            town: town,
            lat: lat,
            lng: lng,
            fav: fav,
        })
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
                    label={["You"]}
                    fav={false} />

                {/*Zabytki w okregu poszukiwan wedlug filtrow*/}
                {monuments.map((e:Monument)=> {
                    for(let i = 0; i<filters.length; i++){
                        if(e.fun.toLocaleLowerCase() === filters[i].name && filters[i].checked === true){
                            return <Point
                                        id={e.id} 
                                        lat={parseFloat(e.lat)} 
                                        lng={parseFloat(e.lng)}
                                        image={PinMonument}
                                        imageHeight={"15"}
                                        label={[e.name, e.fun, e.address]}
                                        link={`${e.name}%20${e.address}`}
                                        onClick={(link:string, id: string)=>openPinModalHandle(link, id, e.name, e.fun, e.town, e.address, e.lat, e.lng, e.fav)}
                                        fav={e.fav} />
                        }
                    }
                })}
            </InteractiveMap>

            <div className={csx.navigation}>
                <Protected>
                    {/*Przycisk udostepniania zabytkow */}
                    <img src={Share} height='20' onClick={()=>ctx.shareMonuments()} />
                </Protected>
                <Button onClick={()=>setOpenFiltersModal(true)} >Filters</Button>

                {/*Kontrolka zmiany zasiegu szukania zabytkow */}
                Range
                <select onChange={(e)=> changeRange(e.target.value)}>
                    <option selected value="10">10 km</option>
                    {[...Array(9)].map((_, i) => <option value={(10*i+20).toString()}>{10*i+20} km</option>)}
                </select>
            </div>
            <Protected>
                {ctx.favourites.length > 0 &&
                <div className={csx.fav} >
                    <p>Added to <img src={FullHeart} height='25' /> :</p>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Function</th>
                            <th>Town</th>
                            <th>Address</th>
                        </tr>
                        {ctx.favourites.map((e:Monument) => {
                            return <tr>
                                <th>{e.name}</th>
                                <th>{e.fun}</th>
                                <th>{e.town}</th>
                                <th>{e.address.replace(e.town, '')}</th>
                            </tr>
                        })}
                    </table>
                </div>
                }
            </Protected>

            {/*Modal filtrow*/}
            <Modal 
                onClick={()=>setOpenFiltersModal(false)}
                open={openFiltersModal}>
                <FiltersModal 
                    filters={filters}
                    check={check} />
            </Modal>

            {/*Modal zmiany pozycji*/}
            <Modal 
                onClick={()=>setOpenChangeHomePositionModal(false)}
                open = {openChangeHomePositionModal}>
                <ChangePositionModal 
                    accept={()=>changeHomePosition()} 
                    cancel={()=>setOpenChangeHomePositionModal(false)}
                    label={`${temporaryHere && Math.round(temporaryHere[0]*100)/100}, ${temporaryHere && Math.round(temporaryHere[1]*100)/100}`} />
            </Modal>
            
            {/*Modal pinezki*/}
            <Modal open={openPinModal} onClick={()=>setOpenPinModal(false)} >
                <PinModal
                    link={currentLink}
                    monument={currentMonument} />
            </Modal>
        </div >
    );
}

export type {Filter};