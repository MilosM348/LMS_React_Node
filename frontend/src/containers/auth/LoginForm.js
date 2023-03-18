import React, {useState, useEffect} from 'react'
import { Link, useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

// import { BreadcrumbBox } from "../../components/common/Breadcrumb";
import { Styles } from "./styles/account.js";
import { setCookie } from "../../service/cookie";
import { useSetting } from "../../provider/setting";
import { useAsync } from "../../service/utils";
import { isEmail } from "../../service/string";
import { signin } from "../../api/auth";
import { getFilter as getCompanies } from "../../api/company";
import siteConfig from "../../config/site.config";

const LoginForm = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const history = useHistory()
  const [, dispatch] = useSetting()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState({})
  const [asyncState, setAsyncState] = useState('')

  const validate = () => {
    let res = true
    if (email === '' || !isEmail(email))
      res = false
    else if (password === '')
      res = false
    return res
  }
  const handleSignin = () => {
    if (!validate())
      return
    run(signin({ email, password, companyId: company._id }))
    setAsyncState('signin')
  }

  useEffect(() => {
    const host = window.location.host;
    const subd = host.split(".")[0];
    if (subd !== siteConfig.domain.split(".")[0] && subd !== 'www') {
      run(getCompanies({ subdomain: subd }));
      setAsyncState("getCompany");
    }
  }, []);
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'signin') {
        const { token, user } = data
        if (user.activate) {
          dispatch({ type: 'SET', settingName: 'auth', settingData: user })
          setCookie('auth', JSON.stringify(user), 1)
          setCookie('token', token, 1)
          if (user?.role === 'admin' || user?.role === 'teamAdmin') {
            history.push('/admin')
          }
          else if (user?.role === 'company' || user?.role === 'companyAdmin') {
            history.push('/company')
          }
          else if (user?.role === 'owner') {
            history.push('/teacher/assignment')
          }
          else if (user?.role === 'student') {
            history.push('/course')
          }
        }
        else {
          NotificationManager.warning("You are blocked by admin.", "Worning", 3000);
        }
      }
      else if (asyncState === 'getCompany') {
        if (data.length === 0) {
          NotificationManager.warning("Please input correct domain with company subdomain", "Worning", 3000);
        }
        else {
          const tmp = data[0]
          setCompany(tmp);
        }
      }
    }
    else if (status === 'rejected') {
      NotificationManager.warning(error?.message, 'Worning', 3000);
      console.log(error)
    }
  }, [status])

  return (
    <Styles>
      {/* Main Wrapper */}
      <div className="main-wrapper login-page">
        {/* Breadcroumb */}
        {/* <BreadcrumbBox title="Log In" /> */}
        <div className="title">Sign In</div>
        {/* Login Area */}
        <section className="login-area">
          <Container>
            <Row>
              <Col md="12">
                <div className="login-box">
                  {/* <div className="login-title text-center">
                    <h3>Log In</h3>
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
                    <button onClick={handleSignin}>Log In</button>
                    <div className="save-forget-password d-flex justify-content-between">
                      <div className="save-passowrd">
                        <label htmlFor="save_password">
                          <input
                            type="checkbox"
                            id="save_password"
                            className="check-box"
                          />
                          Save Password
                        </label>
                      </div>
                      <div className="forget-password">
                        <Link to={process.env.PUBLIC_URL + "/forgetPassword"}>
                          Forget Password?
                        </Link>
                      </div>
                    </div>
                    <div className="not_account-btn text-center">
                      <p>
                        Haven't Any Account Yet?{" "}
                        <Link to={process.env.PUBLIC_URL + "/register"}>
                          Click Here
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
      {/* Footer 2 */}
    </Styles>
  );
}
export default LoginForm
