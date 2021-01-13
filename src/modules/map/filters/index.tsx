import React from 'react'
import {Filter} from "../index"

import {CheckBox} from "ui";

import csx from "./style.scss"

interface Props {
    filters: Filter[],
    check: (value: boolean, name: string) => void
}

const FiltersModal = ({filters, check}:Props) => {

    return(
        <div className={csx.filtersContainer}>
                    <div className={csx.filters}>
                        {filters.map((e:Filter)=>{
                            return <CheckBox 
                                        key={e.name} 
                                        label={e.name} 
                                        onChange={(value, name)=>check(value, name)} 
                                        value={e.checked} />
                        })}
                    </div>
        </div>
    )
}

export default FiltersModal;