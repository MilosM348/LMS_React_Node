import React, {useEffect} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import {AuthRoute, PrivateRoute} from './middleware'
import ScrollToTop from '../helper/ScrollToTop'
import { GlobalStyle } from "../components/common/styles/global.js"
import AdminRoutes from './admin'
import TeacherRoutes from './teacher'
import CompanyRoutes from './company'
import CourseGrid from '../containers/student/courses/CourseGrid'
import CourseDetails from '../containers/student/courses/CourseDetails'
import PaymentConfirm from '../containers/student/courses/payment/index'
import LevelDetail from '../containers/student/courses/LevelDetail'
import Home from '../containers/home'
import BlogDetail from '../containers/student/blog/BlogDetails'
import PageNotFound from '../pages/404/PageNotFound'
import ComingSoon from '../pages/comingsoon/ComingSoon'
import Login from '../containers/auth/Login'
import Register from '../containers/auth/Register'
import Logout from '../containers/auth/Logout'
import Confirm from '../containers/auth/Confirm'
import CheckToken from "../containers/auth/CheckToken";
import VerifyEmail from "../containers/auth/VerifyEmail";
import ConfirmInvite from "../containers/auth/ConfirmInvite";
import ForgetPassword from "../containers/auth/ForgetPassword";
import ResetPassword from "../containers/auth/ResetPassword";
import {getCookie} from '../service/cookie'
import {getAuth} from '../service/string'
import {useSetting} from '../provider/setting'

export default function Routes() {
  const [, dispatch] = useSetting()

  useEffect(() => {
    const userString = getCookie('auth')
    const user = getAuth(userString)
    if (user) {
      dispatch({type: 'SET', settingName: 'auth', settingData: user})
    }
  }, [])
  return (
    <Router>
      <GlobalStyle />
      <ScrollToTop />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/coming-soon">
          <ComingSoon />
        </Route>
        <Route path="/404">
          <PageNotFound />
        </Route>
        <Route path="/blog/detail/:id">
          <BlogDetail />
        </Route>
        <AuthRoute exact path="/login">
          <Login />
        </AuthRoute>
        <AuthRoute exact path="/register">
          <Register />
        </AuthRoute>
        <Route exact path="/check/:token">
          <CheckToken />
        </Route>
        <Route exact path="/verifyEmail/:token">
          <VerifyEmail />
        </Route>
        <Route exact path="/confirmInvite/:token">
          <ConfirmInvite />
        </Route>
        <Route exact path="/forgetPassword">
          <ForgetPassword />
        </Route>
        <Route exact path="/resetPassword/:token">
          <ResetPassword />
        </Route>
        <AuthRoute exact path="/confirm">
          <Confirm />
        </AuthRoute>
        <PrivateRoute exact path="/logout">
          <Logout />
        </PrivateRoute>
        <PrivateRoute exact path="/course">
          <CourseGrid />
        </PrivateRoute>
        <Route exact path="/payment/:id">
          <PaymentConfirm />
        </Route>
        <PrivateRoute exact path="/course/detail/:id">
          <CourseDetails />
        </PrivateRoute>
        <PrivateRoute exact path="/level/detail/:id">
          <LevelDetail />
        </PrivateRoute>
        <Route path="/admin">
          <AdminRoutes />
        </Route>
        <Route path="/teacher">
          <TeacherRoutes />
        </Route>
        <Route path="/company">
          <CompanyRoutes />
        </Route>
      </Switch>
    </Router>
  );
}
