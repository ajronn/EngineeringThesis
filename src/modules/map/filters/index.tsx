import React from "react";

import { CheckBox } from "ui";

import csx from "./style.scss"

interface Props {
    close: () => void,
    monuments: number,
    markers: number,
    filters: number,
    categories: {name: string, checked: boolean}[],
    select(evt: boolean, e: string): void
}

export const FiltersModal = ({ close, monuments, markers, categories, filters, select }: Props) => {

    return (
        <div className={csx.container} >
            <div onClick={close} className={csx.close} >x</div>
            <div >
                <p>Monuments: {markers}/{monuments}</p>
                <p>Types: {filters}/{categories.length}</p>
            </div>
            <div className={csx.filters}>
                {categories.map((e: {name: string, checked: boolean}, index: number) =>
                    <CheckBox
                        key={index}
                        label={e.name}
                        onClick={(evt: boolean) => select(evt, e.name)}
                        value={e.checked} />
                )}
            </div>
        </div>
    )
}