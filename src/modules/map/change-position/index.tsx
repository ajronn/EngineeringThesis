import React from "react";
import {Button} from "ui"

import csx from "./style.scss"

interface Props {
    accept(): void;
    cancel(): void;
    label: string
}

export const ChangePositionModal = ({accept, cancel, label}:Props) => {

    return (
        <div className={csx.container} >
            <p>Do you wanna change your home position to {label}?</p>
            <Button onClick={()=>accept()} >Yes</Button>
            <Button onClick={()=>cancel()} >No</Button>
        </div>
    )
}