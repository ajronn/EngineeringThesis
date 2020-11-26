import React, { createContext, useContext } from "react";

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

    readonly state: STATE = {
        data: [""]
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