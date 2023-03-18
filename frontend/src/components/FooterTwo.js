import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import Datas from '../data/footer/footer2.json';
import BackToTop from './common/BackToTop';
import { Styles } from "./styles/footerTwo.js";
import {isEmail} from '../service/string'
import {create} from '../api/newsLetter'
import {getAll} from '../api/commonSetting'
import {useAsync} from '../service/utils'

function FooterTwo() {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    let secTitle = 'Get The Latest News & Updates On Your Box'
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [setting, setSetting] = useState({})
    const [asyncState, setAsyncState] = useState('')

    const validate = () => {
        let res = true
        if (name === '')
            res = false
        else if (email === '' || !isEmail(email))
            res = false
        return res
    }
    const handleSubmit = () => {
        if (!validate())
            return
        run(create({
            name: name,
            email: email,
        }))
    }

    useEffect(() => {
        run(getAll())
        setAsyncState('getSetting')
    }, [run])
    useEffect(() => {
        if (status === 'resolved') {
            if (asyncState === 'getSetting') {
                if (data.length !== 0)
                    setSetting(data[0])
                setAsyncState('')
            }
        }
        else if (status === 'rejected') {
            console.log(error)
        }
    }, [status])

    return (
        <Styles>
            {/* Footer Two */}
            <footer className="footer2" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/${Datas.backgroundImage})` }}>
                <Container>
                    <Row>
                        <Col md="4">
                            <div className="footer-logo-info">
                                <img src={process.env.PUBLIC_URL + "/assets/images/logo.png"} alt="" className="img-fluid" />
                                <ul className="list-unstyled">
                                    <li><i className="las la-map-marker"></i>{setting.location}</li>
                                    <li><i className="las la-envelope"></i>{setting.email}</li>
                                    <li><i className="las la-phone"></i>{setting.phone}</li>
                                </ul>
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="f-links">
                                <h5>Useful Links</h5>
                                <ul className="list-unstyled">
                                    <li><Link to={process.env.PUBLIC_URL + "/"}><i className="las la-angle-right"></i>Home</Link></li>
                                    <li><Link to={process.env.PUBLIC_URL + "/course"}><i className="las la-angle-right"></i>Courses</Link></li>
                                </ul>
                                <ul className="list-unstyled">
                                    <li><Link to={process.env.PUBLIC_URL + "/register"}><i className="las la-angle-right"></i>Register</Link></li>
                                    <li><Link to={process.env.PUBLIC_URL + "/login"}><i className="las la-angle-right"></i>Login</Link></li>
                                </ul>
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="f-newsletter">
                                <h5>Newsletter</h5>

                                <form id="form4" className="form">
                                    <p className="form-control">
                                        <input type="text" placeholder="Enter name here" value={name} onChange={(e) => setName(e.target.value)} />
                                    </p>
                                    <p className="form-control">
                                        <input type="email" placeholder="Enter email here" onChange={(e) => setEmail(e.target.value)} />
                                    </p>
                                    <button>Submit</button>
                                </form>
                            </div>
                        </Col>
                        <Col md="12">
                            <div className="copytext-area text-center">
                                <p>Copyright &copy; 2017 | Designed With <i className="las la-heart"></i></p>
                                <ul className="social list-unstyled list-inline">
                                    <li className="list-inline-item"><a href={setting.facebook}><i className="fab fa-facebook-f"></i></a></li>
                                    <li className="list-inline-item"><a href={setting.twitter}><i className="fab fa-twitter"></i></a></li>
                                    <li className="list-inline-item"><a href={setting.linkedin}><i className="fab fa-linkedin-in"></i></a></li>
                                    <li className="list-inline-item"><a href={setting.youtube}><i className="fab fa-youtube"></i></a></li>
                                    <li className="list-inline-item"><a href={setting.pinterest}><i className="fab fa-dribbble"></i></a></li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>

                {/* Back To Top  */}
                <BackToTop />
            </footer>
        </Styles>
    );
}

export default FooterTwo
