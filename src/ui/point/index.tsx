import React, {useState} from 'react';
import { Marker } from 'react-map-gl';
import {Protected} from "shared/guard"
import {Modal} from "ui"

import FullStar from "ui/images/fullstar.png"
import EmptyStar from "ui/images/emptystar.png"
import csx from "./style.scss"
import { IgnorePlugin } from 'webpack';

interface Props {
    image: string,
    imageHeight: string,
    lat: number,
    lng: number,
    link?: string,
    label: string[]
    id?: string
}

export const Point = ({ image, imageHeight, lat, lng, link, label, id }: Props) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const GOOGLE_URL = "http://www.google.com.pk/search?btnG=1&pws=0&q=";

    const openModalHandler = (value:boolean) => {
        if(link){
            setIsOpenModal(value);
        }
    }

    return (
        <>
            <Marker offsetTop={-imageHeight} offsetLeft={-imageHeight / 2} latitude={lat} longitude={lng} >
                {/* <a target="_blank" href={link && GOOGLE_URL + link}> */}
                    <img src={image}
                        height={imageHeight}
                        onClick={() => openModalHandler(true)} />
                {/* </a> */}
                <div className={csx.label}>
                    <Protected>
                        <>
                            {link && <img src={EmptyStar} height={parseInt(imageHeight)-5} />}
                        </>
                    </Protected>
                    {label.map((e: string, index: number) => {
                        return <p key={index}>{e}</p>
                    })}
                </div>
            </Marker>
            <Modal open={isOpenModal} onClick={()=>openModalHandler(false)} >

            </Modal>
        </>
    )

}