import React, { useEffect, useContext, useState } from 'react'
import { useParams } from 'react-router-dom';
import { UserContext } from 'shared/firebase'

import { Loader } from "ui"

import csx from './styles.scss'

interface Params {
    id: string
}

export const Share = () => {
    const match: Params = useParams();
    const ctx = useContext(UserContext);
    const [items, setItems] = useState([]);
    const [timer, setTimer] = useState(0);

    setTimeout(function () { setTimer(1) }, 1000);

    useEffect(() => {
        ctx.loadFavMonuments(match.id);
        setItems(ctx.currentFavMonument);
    }, [timer])

    return (
        <div className={csx.shareContainer} >
            {items.length === 0 ? <Loader /> :
                <>
                    <h1>Shared monuments:</h1>
                    <table>
                    <tr><th>Name</th><th>Function</th><th>Address</th><th>Town</th></tr>
                    {items.map(e => {
                        return <tr><th>{e.name}</th><th>{e.fun}</th><th>{e.address}</th><th>{e.town}</th></tr>
                    })}
                    </table>
                </>}
        </div>
    )
}