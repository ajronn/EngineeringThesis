import React, { useState, useEffect } from "react";

import csx from "./style.scss"

interface Props {
    label: string
    onChange: (e: boolean, name:string) => void;
    value: boolean
}

export const CheckBox = ({ label, onChange, value }: Props) => {
    const [check, setCheck] = useState(value)
    useEffect(() => {
        setCheck(value)
    }, [value])

    const checkHandle = () => {
        onChange(!value, label);
    }

    return (
        <div className={csx.container}>
            <input type="checkbox" checked={check} onChange={checkHandle} />
            <span>{label.charAt(0).toUpperCase() + label.slice(1)}</span>
        </div>

    )
}