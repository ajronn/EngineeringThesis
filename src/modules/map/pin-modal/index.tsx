import cssExports from 'modules/home/style.scss';
import React, {useContext, useState, useEffect} from 'react'
import {Protected} from "shared/guard"
import {UserContext} from "shared/firebase"

import GoogleSearch from "ui/images/googlesearch.png"
import FullHeart from "ui/images/fullheart.png"
import EmptyHeart from "ui/images/emptyheart.png"

import csx from "./style.scss"

interface Props {
    link: string,
    monument: {
        id: string,
        name: string,
        fun: string,
        town: string,
        address: string,
        lat: string,
        lng: string,
        fav: boolean,
    },
}

const PinModal = ({link, monument}:Props) => {
    const ctx = useContext(UserContext);
    const [isFav, setIsFav] = useState(false);
    const GOOGLE_URL = "http://www.google.com.pk/search?btnG=1&pws=0&q=";

    useEffect(() => {
        setIsFav(isFavMonument())
        console.log('verify')
    }, [monument.id])

    const isFavMonument = ():boolean => {
        let verify = false;
        ctx.monumentRef.on("value", (snap) => {
            const snapshot = snap.val();
            for (let id in snapshot) {
                if(snapshot[id].id===monument.id && snapshot[id].user === ctx.id)
                    verify = true;
            }
        })

        return verify;
    }

    const removeMonumentFromFav = () => {
        ctx.removeFromFav(monument.id);
        ctx.loadFavourites();
        setIsFav(false)
        
    }

    const addToFav = () => {
        ctx.addMonumentToFav(monument.id, monument.name, monument.fun, monument.town, monument.address);
        ctx.loadFavourites();
        setIsFav(true)
    }
    
    return(
        <div className={csx.pinModal} >
            <p>
                <span className={csx.centered} >Search in Google</span><a target="_blank" href={link && GOOGLE_URL + link}><img src={GoogleSearch} /></a>
            </p>
            <Protected>
                <>
                    <p>
                        {!isFav ?
                        <><span className={csx.centered} >Add to Favorites</span><img className={csx.star} src={EmptyHeart} onClick={()=>addToFav()} /></>
                        :
                        <><span className={csx.centered} >Remove from Favorites</span><img className={csx.star} src={FullHeart} onClick={()=>removeMonumentFromFav()} /></>}
                    </p>
                </>
            </Protected>
        </div>
    )
}

export default PinModal;