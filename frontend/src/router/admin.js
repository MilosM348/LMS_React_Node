import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import {PrivateAdminRoute, PrivateTeamAdminRoute} from './middleware'
import HomeSetting from '../containers/admin/homeSetting/index'
import Company from "../containers/admin/company/index";
import Team from "../containers/admin/team/index";
import Dashboard from "../containers/admin/dashboard/index";

export default function AdminRoutes() {
  
  return (
    <Router>
      <Switch>
        <PrivateTeamAdminRoute exact path="/admin">
          <Dashboard />
        </PrivateTeamAdminRoute>
        <PrivateTeamAdminRoute exact path="/admin/home-setting">
          <HomeSetting />
        </PrivateTeamAdminRoute>
        <PrivateTeamAdminRoute exact path="/admin/company">
          <Company />
        </PrivateTeamAdminRoute>
        <PrivateAdminRoute exact path="/admin/team">
          <Team />
        </PrivateAdminRoute>
      </Switch>
    </Router>
  );
}
