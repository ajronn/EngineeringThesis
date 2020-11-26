import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MonumentsProvider from "shared/monuments-provider"

import { Home } from "modules";
import { Navbar } from "ui";

export const App = () => {
    const navItems = [
        { name: "Home", active: true },
        { name: "About", active: false },
        { name: "Contact us", active: false }
    ];

    return (
        <MonumentsProvider>
            <Navbar items={navItems} />
            <Router>
                <Switch>
                    <Route path="/" exact>
                        <Home />
                    </Route>
                    <Route path="/about" exact>
                        <h1>About</h1>
                    </Route>
                </Switch>
            </Router>
        </MonumentsProvider>
    )
}