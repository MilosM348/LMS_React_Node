import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import {NotificationManager} from 'react-notifications'

import Header from '../../components/Nav'
import HeaderCompany from '../../components/NavCompany'
// import { BreadcrumbBox } from '../../components/common/Breadcrumb'
import Footer from '../../components/Footer'
import FooterCompany from '../../components/FooterCompany'
import { Styles } from './styles/account.js'
import { useAsync } from '../../service/utils'
import {isEmail} from '../../service/string'
import { forgetPassword } from '../../api/auth'
import { getFilter as getCompanies } from "../../api/company";
import siteConfig from '../../config/site.config';

function ForgetPassword() {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState({})
  const [isCompany, setIsCompany] = useState(false)
  const [asyncState, setAsyncState] = useState('')

  const validate = () => {
    let res = true
    if (email === '' || !isEmail(email))
      res = false
    if (!res)
      NotificationManager.warning("Please input email.", "Worning", 3000);
    return res
  }
  const handleSignin = () => {
    if (!validate())
      return
    run(forgetPassword({
      email,
      companyId: company._id,
      domain: `${window.location.protocol}//${window.location.host}`
    }))
    setAsyncState('forget')
  }

  useEffect(() => {
    const host = window.location.host;
    const subdomain = host.split(".")[0];
    if (subdomain !== siteConfig.domain.split(".")[0] && subdomain !== 'www') {
      run(getCompanies({ subdomain: subdomain }));
      setIsCompany(true)
      setAsyncState("getCompany");
    }
  }, []);
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'getCompany') {
        if (data.length !== 0)
          setCompany(data[0])
      }
      else if (asyncState === 'forget') {
        NotificationManager.success("Please checked the mail", "Success", 3000);
      }
    }
    else if (status === 'rejected') {
      NotificationManager.warning(error?.message, 'Worning', 3000);
      console.log(error)
    }
  }, [status])
  return (
    <Styles>
      {/* Header 2 */}
      {isCompany ?
        <HeaderCompany /> :
        <Header />
      }
      {/* Main Wrapper */}
      <div className="main-wrapper login-page">
        {/* Breadcroumb */}
        {/* <BreadcrumbBox title="Forget Password" /> */}
        <div className="title">Forget Password</div>

        {/* Forget Area */}
        <section className="login-area">
          <Container>
            <Row>
              <Col md="12">
                <div className="login-box">
                  {/* <div className="login-title text-center">
                    <h3>Forget Password</h3>
                  </div> */}
                  <div id="form_login" className="form">
                    <p className="form-control">
                      <label htmlFor="login_user">Email</label>
                      <input
                        type="text"
                        placeholder="Email"
                        id="login_user"
                        autoComplete="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <span className="login_input-msg"></span>
                    </p>
                    <button onClick={handleSignin}>Send</button>
                    <div className="save-forget-password d-flex justify-content-between">
                      <div className="forget-password">
                        <Link to={process.env.PUBLIC_URL + "/login"}>
                          Log in
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
      {/* Footer 2 */}
      {isCompany ?
        <FooterCompany /> :
        <Footer />
      }
    </Styles>
  );
}

export default ForgetPassword