import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { API_KEY, MAP_KEY } from "utils"
import opencage from 'opencage-api-client';

const SimpleMap = () => {
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

    const search = () => {
        fetch('https://api.opencagedata.com/geocode/v1/json?q=Bartoszyce%2C%20Ketrzynska%2C%2014&key=fd4a9dad69cc4049a458228d3ee82823')
            .then(response => response.json())
            .then(data => console.log(data.results[0].geometry));

    }

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
    }

    return (
        <>
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={API_KEY}
                onViewportChange={nextViewport => setViewport(nextViewport)}
            >
                <Marker latitude={here[0]} longitude={here[1]}>
                    <img src="https://www.flaticon.com/svg/static/icons/svg/684/684908.svg"
                        height="20" />
                </Marker>
            </ReactMapGL>
            <button onClick={search}>KLIK</button>
        </>
    );
}

export default SimpleMap;