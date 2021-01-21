import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MonumentsProvider from "shared/monuments-provider"
import AlertsProvider from "shared/alerts-provider"
import { UserProvider } from "shared/firebase"

import { Home, SimpleMap, Share } from "modules";
import { Navbar } from "ui";

export const App = () => {

    return (
        <AlertsProvider>
            <UserProvider>
                <MonumentsProvider>
                    <Router>
                        <Navbar />
                        <Switch>
                            <Route path="/" exact>
                                <Home />
                            </Route>
                            <Route path="/map" exact>
                                <SimpleMap />
                            </Route>
                            <Route path="/about" exact>
                                <h1>About</h1>
                            </Route>
                            <Route path="/share/:id" exact>
                                <Share />
                            </Route>
                            <Route path="**" exact>
                                <h1 style={{ margin: '0 auto', width: '500px', textAlign: 'center', marginTop: 'calc(50vh - 80px)' }}>404 page not found</h1>
                            </Route>
                        </Switch>
                    </Router>
                </MonumentsProvider>
            </UserProvider>
        </AlertsProvider>
    )
}