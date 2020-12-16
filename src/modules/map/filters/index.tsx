import React from "react";

import { CheckBox } from "ui";

import csx from "./style.scss"

interface Props {
    close: () => void,
    monuments: number,
    markers: number,
    filters: number,
    categories: string[],
    select(evt: boolean, e: string): void
}

export const FiltersModal = ({ close, monuments, markers, categories, filters, select }: Props) => {

    return (
        <div>
            <div onClick={close} >
                Close
                    </div>
            <div >
                <p>Monuments: {markers}/{monuments}</p>
                <p>Types: {filters}/{categories.length}</p>
            </div>
            <div>
                {categories.map((e: string, index: number) =>
                    <CheckBox
                        key={index}
                        label={e}
                        onClick={(evt: boolean) => select(evt, e)} />
                )}
            </div>
        </div>
    )
}