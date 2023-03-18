import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import {PrivateCompanyRoute, PrivateCompanyAdminRoute} from './middleware'
import Assignment from "../containers/company/assignment/index";
import AddLevel from "../containers/company/assignment/level/index";
import AddProgram from "../containers/company/assignment/program/index";
import AddExam from "../containers/company/assignment/exam/index";
import AddPart from "../containers/company/assignment/part/index";
import ProgramDetail from "../containers/company/assignment/program/detail/index";
import ExamDetail from "../containers/company/assignment/exam/detail/index";
import Replit from '../containers/company/replit/index'
import Teacher from "../containers/company/teacher/index";
import Student from "../containers/company/student/index";
import Team from "../containers/company/team/index";
import ChangePassword from "../containers/company/team/change";
import Subject from "../containers/company/subject/index";
import Dashboard from "../containers/company/dashboard/index";
// import Group from '../containers/company/group/index';
// import GroupDetail from '../containers/company/group/detail';
// import VideoGroup from '../containers/company/videoGroup/index';
// import VGGroup from "../containers/company/videoGroup/group";
// import VGAssignment from "../containers/company/videoGroup/assignment";

export default function CompanyRoutes() {
  
  return (
    <Router>
      <Switch>
        <PrivateCompanyAdminRoute exact path="/company">
          <Dashboard />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/assignment">
          <Assignment />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/assignment/:id">
          <AddPart />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/part/:id">
          <AddLevel />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/level/program/:id">
          <AddProgram />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/level/exam/:id">
          <AddExam />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/program/:id">
          <ProgramDetail />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/exam/:id">
          <ExamDetail />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/replit">
          <Replit />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/instructor">
          <Teacher />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/learner">
          <Student />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/changePassword">
          <ChangePassword />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/subject">
          <Subject />
        </PrivateCompanyAdminRoute>
        {/* <PrivateCompanyAdminRoute exact path="/company/group">
          <Group />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/group/:id">
          <GroupDetail />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/videoGroup">
          <VideoGroup />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/videoGroup/:id/groups">
          <VGGroup />
        </PrivateCompanyAdminRoute>
        <PrivateCompanyAdminRoute exact path="/company/videoGroup/:id/assignments">
          <VGAssignment />
        </PrivateCompanyAdminRoute> */}
        <PrivateCompanyRoute exact path="/company/team">
          <Team />
        </PrivateCompanyRoute>
      </Switch>
    </Router>
  );
}
