import cssExports from 'modules/home/style.scss';
import React, {useContext, useState, useEffect} from 'react'
import {Protected} from "shared/guard"
import {UserContext} from "shared/firebase"

import GoogleSearch from "ui/images/googlesearch.png"
import FullStar from "ui/images/fullstar.png"
import EmptyStar from "ui/images/emptystar.png"

import csx from "./style.scss"

interface Props {
    link: string,
    monumentId: string
}

const PinModal = ({link, monumentId}:Props) => {
    const ctx = useContext(UserContext);
    const [isFav, setIsFav] = useState(false);
    const GOOGLE_URL = "http://www.google.com.pk/search?btnG=1&pws=0&q=";

    useEffect(() => {
        setIsFav(isFavMonument())
    }, [monumentId])

    const isFavMonument = ():boolean => {
        ctx.monumentRef.on("value", (snap) => {
            const snapshot = snap.val();
            for (let id in snapshot) {
                if(snapshot[id].id===monumentId && snapshot[id].user === ctx.id)
                    return true;
            }
        })

        return false;
    }

    const removeMonumentFromFav = () => {
        ctx.removeFromFav(monumentId);
        setIsFav(false)
        
    }

    const addToFav = () => {
        ctx.addMonumentToFav(monumentId);
        setIsFav(true)
    }
    
    return(
        <div className={csx.pinModal} >
            <p>
                Search in Google<a target="_blank" href={link && GOOGLE_URL + link}><img src={GoogleSearch} /></a>
            </p>
            <Protected>
                <>
                    <p>
                        {!isFav ?
                        <img className={csx.star} src={EmptyStar} onClick={()=>addToFav()} />
                        :
                        <img className={csx.star} src={FullStar} onClick={()=>removeMonumentFromFav()} />}
                    </p>
                </>
            </Protected>
        </div>
    )
}

export default PinModal;