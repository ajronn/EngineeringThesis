import React, { createContext, useContext } from "react";

import { warmaz } from "utils/warmaz3.json"

interface Props {
    children: React.ReactNode
}

interface STATE {
    data: string[]
}

const st: STATE = {
    data: []
}

const Context = createContext(st)

class MonumentsProvider extends React.Component<Props, STATE> {

    filterMonuments() {
        return warmaz.filter((e: any) => e.number !== "");
    }

    readonly state: STATE = {
        data: this.filterMonuments()
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const useMonuments = () => {
    return useContext(Context);
}

export default MonumentsProvider;