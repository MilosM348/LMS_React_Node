import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import {PrivateOwnerRoute} from './middleware'
import Assignment from '../containers/teacher/assignment/index'
import AddLevel from '../containers/teacher/assignment/level/index'
import AddProgram from '../containers/teacher/assignment/program/index'
import AddExam from '../containers/teacher/assignment/exam/index'
import AddPart from '../containers/teacher/assignment/part/index'
import ProgramDetail from '../containers/teacher/assignment/program/detail/index'
import ExamDetail from '../containers/teacher/assignment/exam/detail/index'
import Student from '../containers/teacher/student/index'
import NewComment from '../containers/teacher/comment/index'
import AllComment from '../containers/teacher/comment/all'
import CommentDetail from '../containers/teacher/comment/detail'
import Notification from '../containers/teacher/notification/index'
import ExamPool from '../containers/teacher/exampool/index'
import NewsLetter from '../containers/teacher/newsLetter/index'
import Payment from '../containers/teacher/payment/index'
import Coupon from '../containers/teacher/payment/coupon/index'
import Message from "../containers/teacher/message/index";

export default function TeacherRoutes() {
  return (
    <Router>
      <Switch>
        <PrivateOwnerRoute exact path="/teacher/assignment">
          <Assignment />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute exact path="/teacher/assignment/:id">
          <AddPart />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute exact path="/teacher/part/:id">
          <AddLevel />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute exact path="/teacher/level/program/:id">
          <AddProgram />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute exact path="/teacher/level/exam/:id">
          <AddExam />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute exact path="/teacher/program/:id">
          <ProgramDetail />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute exact path="/teacher/exam/:id">
          <ExamDetail />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute exact path="/teacher/student">
          <Student />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute exact path="/teacher/comment">
          <NewComment />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute exact path="/teacher/comment/all">
          <AllComment />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute exact path="/teacher/message">
          <Message />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute path="/teacher/comment/:levelID/:userID">
          <CommentDetail />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute exact path="/teacher/notification">
          <Notification />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute exact path="/teacher/exampool">
          <ExamPool />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute exact path="/teacher/newsletter">
          <NewsLetter />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute exact path="/teacher/payment">
          <Payment />
        </PrivateOwnerRoute>
        <PrivateOwnerRoute exact path="/teacher/payment/coupon/:id">
          <Coupon />
        </PrivateOwnerRoute>
      </Switch>
    </Router>
  );
}
