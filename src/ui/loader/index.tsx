import React from 'react';

import MiniCastle from 'ui/images/minicastle.png'

import csx from './styles.scss'

export const Loader = () => {

    return (
        <div className={csx.loading} >
            <img src={MiniCastle} />
            <div className={csx.loaderContainer}>
                <div className={csx.loader} />
            </div>
        </div>
    )
}