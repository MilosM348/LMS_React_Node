import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import BackToTop from './common/BackToTop';
import { Styles } from "./styles/footerOne.js";
import {getAll} from '../api/commonSetting'
import {useAsync} from '../service/utils'
import {getAll as getAllBlogs} from '../api/settingBlog'
import { getMonth } from '../service/string'
import NewsletterForm from './NewsletterForm'

const Footer = () => {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const [setting, setSetting] = useState({})
    const [blogs, setBlogs] = useState([])
    const [asyncState, setAsyncState] = useState('')

    useEffect(() => {
        run(getAll())
        setAsyncState('getSetting')
      }, [run])
      useEffect(() => {
        if (status === 'resolved') {
            if (asyncState === 'getSetting') {
                if (data.length !== 0) {
                    setSetting(data[0])
                }
                run(getAllBlogs())
                setAsyncState('getBlog')
            }
            else if (asyncState === 'getBlog') {
                if (data.length !== 0) {
                    setBlogs(data.slice(0, 2))
                }
                setAsyncState('')
            }
        }
        else if (status === 'rejected') {
          console.log(error)
        }
      }, [status])
    return (
        <>
            < NewsletterForm />
            <Styles>
                {/* Footer Area */}
                <footer className="footer1">
                    <Container>
                        <Row>
                            <Col md="3" xs="12">
                                <div className="footer-logo-info">
                                    <img src={process.env.PUBLIC_URL + "/assets/images/w-logo.png"} alt="" className="img-fluid" style={{width: 170}} />
                                    <ul className="list-unstyled">
                                        <li><i className="las la-map-marker"></i>{setting.location}</li>
                                        <li><i className="las la-envelope"></i>{setting.email}</li>
                                        <li><i className="las la-phone"></i>{setting.phone}</li>
                                    </ul>
                                </div>
                            </Col>
                            <Col md="2" xs="12">
                                <div className="f-links">
                                    <h5>Platform</h5>
                                    <ul className="list-unstyled">
                                        <li><Link to={process.env.PUBLIC_URL + "/"}><i className="las la-angle-right"></i>Features</Link></li>
                                        <li><Link to={process.env.PUBLIC_URL + "/"}><i className="las la-angle-right"></i>Testimonial</Link></li>
                                    </ul>
                                </div>
                            </Col>
                            <Col md="2" xs="12">
                                <div className="f-links">
                                    <h5>Company</h5>
                                    <ul className="list-unstyled">
                                        <li><Link to={process.env.PUBLIC_URL + "/"}><i className="las la-angle-right"></i>About us</Link></li>
                                        <li><Link to={process.env.PUBLIC_URL + "/"}><i className="las la-angle-right"></i>Blog</Link></li>
                                        <li><Link to={process.env.PUBLIC_URL + "/"}><i className="las la-angle-right"></i>Events</Link></li>
                                        <li><Link to={process.env.PUBLIC_URL + "/"}><i className="las la-angle-right"></i>Newsletters</Link></li>
                                        <li><Link to={process.env.PUBLIC_URL + "/"}><i className="las la-angle-right"></i>Contact Us</Link></li>
                                        <li><Link to={process.env.PUBLIC_URL + "/"}><i className="las la-angle-right"></i>FAQ</Link></li>
                                    </ul>
                                </div>
                            </Col>
                            <Col md="2" xs="12">
                                <div className="f-links">
                                    <h5>Useful Links</h5>
                                    <ul className="list-unstyled">
                                        <li><Link to={process.env.PUBLIC_URL + "/login"}><i className="las la-angle-right"></i>Login</Link></li>
                                        <li><Link to={process.env.PUBLIC_URL + "/register"}><i className="las la-angle-right"></i>Register</Link></li>
                                    </ul>
                                </div>
                            </Col>
                            <Col md="3" xs="12">
                                <div className="f-post">
                                    <h5>Recent Post</h5>
                                    {
                                        blogs.map((item) => (
                                            <div className="post-box d-flex" key={item._id}>
                                                <div className="post-img">
                                                    <img src={item.image} alt="" />
                                                </div>
                                                <div className="post-content">
                                                    <Link to={`${process.env.PUBLIC_URL}/blog/detail/${item._id}`}>{item.title}</Link>
                                                    <span>{`${getMonth(item.month)} ${item.day}`}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </footer>

                {/* Copyright Area */}
                <section className="copyright-area">
                    <Container>
                        <Row>
                            <Col md="6">
                                <div className="copy-text">
                                    <p>Copyright &copy; 2021 | OnLMP <i className="las la-heart"></i></p>
                                </div>
                            </Col>
                            <Col md="6" className="text-right">
                                <ul className="social list-unstyled list-inline">
                                    <li className="list-inline-item"><a href={setting.facebook}><i className="fab fa-facebook-f"></i></a></li>
                                    <li className="list-inline-item"><a href={setting.twitter}><i className="fab fa-twitter"></i></a></li>
                                    <li className="list-inline-item"><a href={setting.linkedin}><i className="fab fa-linkedin-in"></i></a></li>
                                    <li className="list-inline-item"><a href={setting.youtube}><i className="fab fa-youtube"></i></a></li>
                                    <li className="list-inline-item"><a href={setting.pinterest}><i className="fab fa-dribbble"></i></a></li>
                                </ul>
                            </Col>
                        </Row>
                    </Container>

                    {/* Back To Top */}
                    <BackToTop/>
                </section>
            </Styles>
        </>
    )
}

export default Footer
