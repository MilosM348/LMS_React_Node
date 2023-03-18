import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { NotificationManager } from 'react-notifications'

import Header from '../../components/NavTwoStudent'
import { BreadcrumbBox } from '../../components/common/Breadcrumb'
import FooterTwo from '../../components/FooterTwo'
import { Styles } from './styles/account.js'
import {useAsync} from '../../service/utils'
// import {confirm, reSendConfirmCode} from '../../api/auth'

function Confirm() {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [code, setCode] = useState('')
  const [asyncState, setAsyncState] = useState('')

  const validate = () => {
    let res = true
    if (username === '')
      res = false
    else if (code === '')
      res = false
    return res
  }
  const handleConfirm = () => {
    if (!validate())
      return
    // run(confirm({username, code}))
    setAsyncState('confirm')
  }
  const handleResend = () => {
    if (username === '') {
      NotificationManager.warning('Please input username', 'Worning', 3000);
      return
    }
    // run(reSendConfirmCode(username))
    setAsyncState('resend')
  }

  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'confirm')
        history.push('/login')
      else if (asyncState === 'resend') {
        NotificationManager.success('Please check your mail', 'Success', 3000);
      }
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [status])
  return (
    <Styles>
      {/* Main Wrapper */}
      <div className="main-wrapper registration-page">

        {/* Header 2 */}
        <Header />

        {/* Breadcroumb */}
        <BreadcrumbBox title="Confirm" />

        {/* Registration Area */}
        <section className="registration-area">
          <Container>
            <Row>
              <Col md="12">
                <div className="registration-box">
                  <div className="registration-title text-center">
                    <h3>Confirm</h3>
                  </div>
                  <div id="form_registration" className="form">
                    <p className="form-control">
                      <label htmlFor="registration_user">User Name</label>
                      <input 
                        type="text" 
                        placeholder="Username" 
                        id="registration_user" 
                        autoComplete="off"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <span className="registration_input-msg"></span>
                    </p>
                    <p className="form-control">
                      <label htmlFor="registration_email">Confirm Code</label>
                      <input 
                        type="text" 
                        placeholder="Confirm Code" 
                        id="registration_email" 
                        autoComplete="off"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      />
                      <span className="registration_input-msg"></span>
                    </p>
                    <div style={{display: 'flex'}}>
                      <button onClick={handleConfirm} style={{marginRight: 10}}>Confirm</button>
                      <button onClick={handleResend} style={{marginLeft: 10}}>Resend Code</button>
                    </div>
                  </div>
                  <div className="have_account-btn text-center">
                    <p>Already have an account? <Link to="/login">Login Here</Link></p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        {/* Footer 2 */}
        <FooterTwo />
      </div>
    </Styles>
  )
}

export default Confirm