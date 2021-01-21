import React, { createContext, useContext } from "react";

import { Alert } from "ui";

import csx from "./styles.scss"

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

    sleep = (milliseconds: number) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    generateId = (): number => {
        let gId = -1;
        this.state.data.map((e: Alert) => {
            if (e.id > gId) {
                gId = e.id;
            }
        })
        return gId + 1;
    }

    addAlert = (msg: string) => {
        const id = this.generateId();
        this.setState({ data: [...this.state.data, { id: id, message: msg }] }, () => this.removeAlert(id));
    }

    removeAlert = async (id: number) => {
        await this.sleep(2000);
        this.setState({ data: this.state.data.filter(e => e.id !== id) });
    }

    state: STATE = {
        data: [],
        addAlert: this.addAlert
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                <div className={csx.alertsContainer}>
                    {this.state.data.map((e: Alert) => {
                        return <Alert text={e.message} />
                    })}
                </div>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const useAlerts = () => {
    return useContext(Context);
}

export default AlertsProvider;