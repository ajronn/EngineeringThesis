import React, { useState } from "react";

import csx from "./style.scss"

interface Props {
    label: string
    onClick: (e: boolean) => void;
}

export const CheckBox = ({ label, onClick }: Props) => {
    const [checked, setChecked] = useState(false);

    const handleChecked = () => {
        setChecked(prev => !prev);
    }

    return (
        <div className={csx.container}>
            <input type="checkbox" checked={checked} onChange={handleChecked} onClick={() => onClick(!checked)} />
            <span>{label.charAt(0).toUpperCase() + label.slice(1)}</span>
        </div>

    )
}