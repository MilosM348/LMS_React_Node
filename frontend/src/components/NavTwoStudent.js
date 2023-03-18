import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Search from './common/Search';
import Sidebar from './common/Sidebar';
import StickyMenu from './common/StickyMenuStudent';
import MobileMenu from './common/MobileMenuStudent';
import { Styles } from "./styles/headerTwo.js";
import {getAll} from '../api/commonSetting'
import {useAsync} from '../service/utils'
import {useSetting} from '../provider/setting'

const HeaderTwo = () => {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const [setting] = useSetting()
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
            {/* Topbar 2 */}
            <section className="top-bar2">
                <Container>
                    <Row>
                        <Col lg="7" md="9">
                            <div className="bar-left">
                                <ul className="list-unstyled list-inline">
                                    <li className="list-inline-item"><i className="las la-phone"></i>{phone}</li>
                                    <li className="list-inline-item"><i className="las la-envelope"></i>{email}</li>
                                    <li className="list-inline-item"><i className="las la-map-marker"></i>{location}</li>
                                </ul>
                            </div>
                        </Col>
                        <Col lg="5" md="3">
                            <div className="bar-right d-flex justify-content-end">
                                <ul className="list-unstyled list-inline bar-social">
                                    <li className="list-inline-item"><a href={facebook}><i className="fab fa-facebook-f"></i></a></li>
                                    <li className="list-inline-item"><a href={twitter}><i className="fab fa-twitter"></i></a></li>
                                    <li className="list-inline-item"><a href={linkedin}><i className="fab fa-linkedin-in"></i></a></li>
                                    <li className="list-inline-item"><a href={instagram}><i className="fab fa-instagram"></i></a></li>
                                </ul>
                                <ul className="list-unstyled list-inline bar-login">
                                    {setting.auth === null?
                                        (
                                        <>
                                        <li className="list-inline-item"><Link to={process.env.PUBLIC_URL + "/login"}><i className="las la-user"></i>Log In</Link></li>
                                        <li className="list-inline-item"><Link to={process.env.PUBLIC_URL + "/register"}><i className="las la-user-edit"></i>Register</Link></li>
                                        </>
                                        ):
                                        <li className="list-inline-item"><a href={process.env.PUBLIC_URL + "/logout"}><i className="las la-user"></i>Log Out</a></li>
                                    }
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Logo Area 2 */}
            <section className="logo-area2">
                <Container>
                    <Row>
                        <Col md="3">
                            <div className="logo">
                                <Link to={process.env.PUBLIC_URL + "/"}><img src={process.env.PUBLIC_URL + "/assets/images/logo.png"} alt="" style={{width: 170}} /></Link>
                            </div>
                        </Col>
                        <Col md="9">
                            <div className="menu-box d-flex justify-content-end">
                                <ul className="nav menu-nav">
                                    <li className="nav-item dropdown active">
                                        <Link className="nav-link dropdown-toggle" to={process.env.PUBLIC_URL + "/"} data-toggle="dropdown">Home</Link>
                                    </li>
                                    <li className="nav-item dropdown active">
                                        <Link className="nav-link dropdown-toggle" to={process.env.PUBLIC_URL + "/course"} data-toggle="dropdown">Course</Link>
                                    </li>
                                </ul>
                                { !setting?.auth &&
                                    <div className="apply-btn">
                                        <Link to={process.env.PUBLIC_URL + "/register"}><i className="las la-clipboard-list"></i>Apply Now</Link>
                                    </div>
                                }
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

export default HeaderTwo
