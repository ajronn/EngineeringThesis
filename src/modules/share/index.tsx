import React,{useEffect, useContext, useState} from 'react'
import { useParams } from 'react-router-dom';
import {UserContext} from 'shared/firebase'

import csx from './styles.scss'

interface Params{
    id:string
}

export const Share = () => {
    const match:Params = useParams();
    const ctx = useContext(UserContext);
    const [items, setItems] = useState([]);
    const [timer, setTimer] = useState(0);

    setTimeout(function(){ setTimer(1) }, 1000);

    useEffect(() => {
        ctx.loadFavMonuments(match.id);
        setItems(ctx.currentFavMonument);
    }, [timer])

    return(
        <div className={csx.shareContainer} >
            <h1>Shared monuments:</h1>
            {items.map(e => {
                return <span>{e.name} {e.fun} {e.address} {e.town}</span>
            })}
        </div>
    )
}