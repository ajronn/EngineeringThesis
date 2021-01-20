import React from "react";

import csx from "./styles.scss"

interface Props {
    text: string

}

export const Alert = ({ text }: Props) => {

    return (
        <div className={csx.alertContainer} >
            {text}
        </div>
    )
}