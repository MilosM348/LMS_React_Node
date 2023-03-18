import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Dropdown } from 'react-bootstrap'
import StickyMenu from './common/StickyMenuStudent'
import MobileMenu from './common/MobileMenuStudent'
import { Styles } from "./styles/nav.js"
import {useSetting} from '../provider/setting'

const Header = () => {
  const [setting] = useSetting()

  return (
    <Styles>

      {/* Logo Area */}
      <section className="logo-area">
        <Container>
          <Row>
            <Col md="3">
              <div className="logo">
                <Link to={process.env.PUBLIC_URL + "/"}><img src={process.env.PUBLIC_URL + "/assets/images/logo.png"} alt="" style={{width: 170}} /></Link>
              </div>
            </Col>
            <Col md="9">
              <div className="logo-contact-box d-flex justify-content-end">
                <ul className="nav menu-nav">
                  <li className="nav-item expanse dropdown active">
                    <Link className="nav-link dropdown-toggle" to={process.env.PUBLIC_URL + "/"} data-toggle="dropdown">Platform</Link>
                  </li>
                  <li className="nav-item expanse dropdown active">
                    <Link className="nav-link dropdown-toggle" to={process.env.PUBLIC_URL + "/"} data-toggle="dropdown">Solutions</Link>
                  </li>
                  <li className="nav-item expanse dropdown active">
                    <Link className="nav-link dropdown-toggle" to={process.env.PUBLIC_URL + "/"} data-toggle="dropdown">Pricing</Link>
                  </li>
                  <li className="nav-item expanse dropdown">
                    <Link className="nav-link dropdown-toggle" to={process.env.PUBLIC_URL + "/"} data-toggle="dropdown">Company</Link>
                  </li>
                  <li className="nav-item collapes dropdown">
                    <Link className="nav-link dropdown-toggle" to={process.env.PUBLIC_URL + "/"} data-toggle="dropdown"><i className="las la-bars"></i></Link>
                    <ul className="dropdown list-unstyled">
                      <li className="nav-item"><Link className="nav-link" to={process.env.PUBLIC_URL + "/"}>Platform</Link></li>
                      <li className="nav-item"><Link className="nav-link" to={process.env.PUBLIC_URL + "/"}>Solutions</Link></li>
                      <li className="nav-item"><Link className="nav-link" to={process.env.PUBLIC_URL + "/"}>Pricing</Link></li>
                      <li className="nav-item"><Link className="nav-link" to={process.env.PUBLIC_URL + "/"}>Company</Link></li>
                    </ul>
                  </li>
                  {!setting?.auth ? 
                    (
                      <>
                        <li className="nav-button dropdown active">
                          <Link className="nav-link dropdown-toggle" to={process.env.PUBLIC_URL + "/login"} data-toggle="dropdown">Sign In</Link>
                        </li>
                        <li className="nav-button dropdown">
                          <Link className="nav-link dropdown-toggle" to={process.env.PUBLIC_URL + "/register"} data-toggle="dropdown">Sign Up</Link>
                        </li>
                      </>
                    ) : (
                        <li className="nav-button dropdown">
                          <Link className="nav-link dropdown-toggle" to={process.env.PUBLIC_URL + "/logout"}>Log Out</Link>
                        </li>
                      )
                  }
                </ul>
                <ul className="list-unstyled list-inline bar-lang">
                  <li className="list-inline-item">
                    <Dropdown>
                      <Dropdown.Toggle><img src={process.env.PUBLIC_URL + "/assets/images/us.png"} alt="" />EN</Dropdown.Toggle>
                      <Dropdown.Menu as="ul">
                        <Dropdown.Item as="li"><img src={process.env.PUBLIC_URL + "/assets/images/us.png"} alt="" /> English</Dropdown.Item>
                        <Dropdown.Item as="li"><img src={process.env.PUBLIC_URL + "/assets/images/fra.png"} alt="" /> French</Dropdown.Item>
                        <Dropdown.Item as="li"><img src={process.env.PUBLIC_URL + "/assets/images/ger.png"} alt="" /> German</Dropdown.Item>
                        <Dropdown.Item as="li"><img src={process.env.PUBLIC_URL + "/assets/images/spa.png"} alt="" /> Spanish</Dropdown.Item>
                        <Dropdown.Item as="li"><img src={process.env.PUBLIC_URL + "/assets/images/bra.png"} alt="" /> Brazilian</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sticky Menu */}
      <StickyMenu />

      {/* Mobile Menu */}
      <MobileMenu />
    </Styles>
  )
}

export default Header
