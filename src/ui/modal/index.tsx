import React, { useState, useEffect } from 'react';

import csx from "./style.scss"

interface Props {
    children: React.ReactNode,
    open: boolean
    onClick?: () => void
}

export const Modal = ({ children, open, onClick }: Props) => {
    const [openModal, setOpenModal] = useState(open)
    useEffect(() => {
        setOpenModal(open)
    }, [open])

    return (
        <>
            <div
                className={csx.container}
                style={{ visibility: openModal ? "visible" : "hidden", opacity: openModal ? "1" : "0" }}
                onClick={onClick}
            >
            </div>
            <div style={{ visibility: openModal ? "visible" : "hidden", opacity: openModal ? "1" : "0" }}>
                {children}
            </div>
        </>
    )

}