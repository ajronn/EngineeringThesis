import React, { useState } from "react";

import csx from "./style.scss"

interface Props {
    label: string
    onClick: (e: boolean) => void;
    value: boolean
}

export const CheckBox = ({ label, onClick, value }: Props) => {
    const [checked, setChecked] = useState(false);

    return (
        <div className={csx.container}>
            <input type="checkbox" checked={value} onClick={() => onClick(!checked)} />
            <span>{label.charAt(0).toUpperCase() + label.slice(1)}</span>
        </div>

    )
}