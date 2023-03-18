import React, {useEffect, useState} from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Container, Row, Col } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

import Header from "../../components/Nav";
import HeaderCompany from "../../components/NavCompany";
// import { BreadcrumbBox } from '../../components/common/Breadcrumb'
import Footer from "../../components/Footer";
import FooterCompany from "../../components/FooterCompany";
import { Styles } from "./styles/account.js";
import { useAsync } from "../../service/utils";
import { resetPassword } from '../../api/auth'
import siteConfig from '../../config/site.config';

const ConfirmInvite = () => {
  const { data, status, error, run } = useAsync({
    status: "idle",
  });
  const { token } = useParams()
  const history = useHistory()
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [isCompany, setIsCompany] = useState(false);

  const confirmPassword = () => {
    if (password !== rePassword) {
      NotificationManager.warning("Compare the repassword", "Worning", 3000);
    }
    else {
      run(resetPassword({token, password}))
    }
  }

  useEffect(() => {
    const host = window.location.host;
    const subdomain = host.split(".")[0];
    if (subdomain !== siteConfig.domain.split(".")[0] && subdomain !== "www") {
      setIsCompany(true);
    }
  }, []);
  useEffect(() => {
    if (status === "resolved") {
      NotificationManager.success('Invite confirm success', "Worning", 3000);
      history.push("/login");
    } else if (status === "rejected") {
      console.log(error);
      NotificationManager.warning(error?.message, "Worning", 3000);
      history.push('/login')
    }
  }, [status]);
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
        {/* <BreadcrumbBox title="Confirm Invite" /> */}
        <div className="title">Confirm Invite</div>
        {/* Login Area */}
        <section className="login-area">
          <Container>
            <Row>
              <Col md="12">
                <div className="login-box">
                  {/* <div className="login-title text-center">
                    <h3>Confirm Invite</h3>
                  </div> */}
                  <div id="form_login" className="form">
                    <p className="form-control">
                      <label htmlFor="login_password">Password</label>
                      <input
                        type="password"
                        placeholder="*******"
                        id="login_password"
                        autoComplete="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span className="login_input-msg"></span>
                    </p>
                    <p className="form-control">
                      <label htmlFor="login_repassword">RePassword</label>
                      <input
                        type="password"
                        placeholder="*******"
                        id="login_repassword"
                        autoComplete="off"
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                      />
                      <span className="login_input-msg"></span>
                    </p>
                    <button onClick={confirmPassword}>Confirm</button>
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
export default ConfirmInvite
