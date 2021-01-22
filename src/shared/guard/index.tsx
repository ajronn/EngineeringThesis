import React, { useContext } from "react"
import { UserContext } from "shared/firebase"

interface Props {
    children: JSX.Element;
}

export const Protected = ({ children }: Props) => {
    const ctx = useContext(UserContext);
    return (<>{ctx.isLogged && children}</>);
}

export const Unprotected = ({ children }: Props) => {
    const ctx = useContext(UserContext);
    return (<>{!ctx.isLogged && children}</>)
}

