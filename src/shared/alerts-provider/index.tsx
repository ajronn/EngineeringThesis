import React, { createContext, useContext } from "react";

interface Props {
    children: React.ReactNode
}

type Alert = {
    id: number,
    message: string
}

interface STATE {
    data: Alert[],
    addAlert: (e: any) => void
}

const st: STATE = {
    data: [],
    addAlert: (e: any) => { }
}

const Context = createContext(st)

class AlertsProvider extends React.Component<Props, STATE> {

    addAlert = (msg: string) => {
        this.setState({data: [...this.state.data, {id: 0, message: msg}]});
        console.log(this.state.data);
    }

    state: STATE = {
        data: [{ id: 0, message: "hello" }],
        addAlert: this.addAlert
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const useAlerts = () => {
    return useContext(Context);
}

export default AlertsProvider;