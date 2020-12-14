import React from 'react';

import csx from "./style.scss"

interface Props {
    height: string,
    image: string,
    label: string
}

export const Icon = ({ height, image, label }: Props) => {

    return (
        <div className={csx.container} >
            <img src={image} height={height} />
            {label}
        </div>
    )
}