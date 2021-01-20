import React, { createContext, ReactNode, useContext } from 'react';

import { Alert } from "ui"

namespace AlertsProvider {

    export type AlertType = {
        id: number,
        text: string
    }

    export interface State {
        alerts: AlertType[],
        addAlert: (text: string) => void
    }

    export interface Props {
        children: ReactNode;
    }
}

const STATE: AlertsProvider.State = {
    alerts: [],
    addAlert: (text: string) => { }
};

const Context = createContext(STATE);

class Provider extends React.Component<AlertsProvider.Props, typeof STATE> {

    constructor(props:any){
        super(props);
        this.state = {
            alerts: [],
            addAlert: this.addAlert
        };

        this.addAlert = this.addAlert.bind(this);
    }

    addAlert(text: string) {
        // this.setState({ alerts: [...this.state.alerts, { id: 0, text: text }] });
        console.log(this.state)
    }

    render = (): JSX.Element => (
        <Context.Provider value={this.state}>
            {this.state.alerts.map((e:AlertsProvider.AlertType)=>{
                return <Alert text={e.text} />
            })}
            {this.props.children}
            </Context.Provider>
    );
}

const AlertsProvider = Provider;

export const useAlertsProvider = (): AlertsProvider.State => useContext(Context);

export default AlertsProvider;