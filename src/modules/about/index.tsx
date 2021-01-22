import React from 'react'

import WMiI from "ui/images/wmii.png"

import csx from "./styles.scss"

export const About = () => {

    return (
        <>
            <div className={csx.aboutContainer} >
                <p>The application was created for the needs of engineering work.<br />All rights to it are owned by:</p>
            </div>
            <a target="blank" href="http://wmii.uwm.edu.pl/" ><img className={csx.image}  src={WMiI} /></a>
        </>
    )
}