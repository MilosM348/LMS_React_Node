import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Dropdown } from 'react-bootstrap'
// import Search from './common/Search'
// import Sidebar from './common/Sidebar'
import StickyMenu from './common/StickyMenuStudent'
import MobileMenu from './common/MobileMenuStudent'
import { Styles } from "./styles/header.js"
import {getAll} from '../api/commonSetting'
import {useAsync} from '../service/utils'
import {useSetting} from '../provider/setting'

const Header = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const [setting] = useSetting()
  const [commoneSetting, setCommonSetting] = useState({})
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')  
  const [facebook, setFacebook] = useState('')
  const [twitter, setTwitter] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [instagram, setInstagram] = useState('')

  useEffect(() => {
    run(getAll())
  }, [run])
  useEffect(() => {
    if (status === 'resolved') {
      if (data.length !== 0) {
        setLocation(data[0]?.location)
        setPhone(data[0]?.phone)
        setEmail(data[0]?.email)
        setFacebook(data[0]?.facebook)
        setTwitter(data[0]?.twitter)
        setLinkedin(data[0]?.linkedin)
        setInstagram(data[0]?.instagram)
      }
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [status])
  return (
    <Styles>
      {/* Topbar */}
      <section className="top-bar">
        <Container>
          <Row>
            <Col lg="6" md="5">
              <div className="bar-left">
                <ul className="list-unstyled list-inline">
                  <li className="list-inline-item"><i className="las la-map-marker"></i>{location}</li>
                </ul>
              </div>
            </Col>
            <Col lg="6" md="7">
              <div className="bar-right d-flex justify-content-end">
                <ul className="list-unstyled list-inline bar-social">
                  <li className="list-inline-item"><a href={facebook}><i className="fab fa-facebook-f"></i></a></li>
                  <li className="list-inline-item"><a href={twitter}><i className="fab fa-twitter"></i></a></li>
                  <li className="list-inline-item"><a href={linkedin}><i className="fab fa-linkedin-in"></i></a></li>
                  <li className="list-inline-item"><a href={instagram}><i className="fab fa-instagram"></i></a></li>
                </ul>
                <ul className="list-unstyled list-inline bar-lang">
                  <li className="list-inline-item">
                    <Dropdown>
                      <Dropdown.Toggle><img src={process.env.PUBLIC_URL + "/assets/images/us.png"} alt="" />English<i className="las la-angle-down"></i></Dropdown.Toggle>
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
                <ul className="list-unstyled list-inline bar-login">
                  {setting.auth === null?
                    (
                    <>
                    <li className="list-inline-item"><Link to={process.env.PUBLIC_URL + "/login"}><i className="las la-user"></i>Log In</Link></li>
                    <li className="list-inline-item"><Link to={process.env.PUBLIC_URL + "/register"}><i className="las la-user-edit"></i>Register</Link></li>
                    </>
                    ):
                    <li className="list-inline-item"><Link to={process.env.PUBLIC_URL + "/logout"}><i className="las la-user"></i>Log Out</Link></li>
                  }
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

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
                <div className="emcontact-box d-flex">
                  <div className="box-icon">
                    <i className="flaticon-phone-call"></i>
                  </div>
                  <div className="box-content">
                    <p>Call Us Now</p>
                    <span>{phone}</span>
                  </div>
                </div>
                <div className="emcontact-box d-flex">
                  <div className="box-icon">
                    <i className="flaticon-envelope"></i>
                  </div>
                  <div className="box-content">
                    <p>Enquery Us</p>
                    <span>{email}</span>
                  </div>
                </div>
                {!setting.auth &&
                  <div className="apply-btn">
                    <Link to={process.env.PUBLIC_URL + "/register"}><i className="las la-clipboard-list"></i>Apply Now</Link>
                  </div>
                }
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Navbar */}
      <section className="main-menu">
        <Container>
          <Row>
            <Col md="12">
              <div className="main-menu-box">
                <div className="menu-box d-flex justify-content-between">
                  <ul className="nav menu-nav">
                    <li className="nav-item dropdown active">
                      <Link className="nav-link dropdown-toggle" to={process.env.PUBLIC_URL + "/"} data-toggle="dropdown">Home</Link>
                    </li>
                    <li className="nav-item dropdown">
                      <Link className="nav-link dropdown-toggle" to={process.env.PUBLIC_URL + "/course"} data-toggle="dropdown">Course</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sticky Menu */}
      <StickyMenu commonSetting={commoneSetting} />

      {/* Mobile Menu */}
      <MobileMenu commonSetting={commoneSetting} />
    </Styles>
  )
}

export default Header
