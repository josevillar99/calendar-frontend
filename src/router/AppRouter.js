import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';

import Filtros from '../components/filtrar';
import { LoginScreen } from '../components/auth/LoginScreen';
import { CalendarScreen } from '../components/calendar/CalendarScreen';
import TestComponent from '../components/tests/testComponent';

export const AppRouter = () => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/login" component={LoginScreen} />
                    <Route exact path="/" component={CalendarScreen} />
                    <Route exact path="/filtros" component={Filtros} />
                    <Route exact path="/tests" component={TestComponent} />
                    <Redirect to="/" />
                </Switch>
            </div>
        </Router>
    )
}
