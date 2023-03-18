import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Styles } from "./styles/stickyMenu.js";
import {useSetting} from '../../provider/setting'

function StickyMenu(props) {
    const [setting] = useSetting()
    
    useEffect(() => {
        window.addEventListener("scroll", () => {
            const stickyMenu = document.querySelector(".sticky-menu");
            if (stickyMenu) {
                if (window.scrollY > 160) {
                    stickyMenu.classList.add("sticky");
                } else {
                    stickyMenu.classList.remove("sticky");
                }
            }
        });
    });

    return (
        <Styles>
            {/* Sticky Menu */}
            <section className="sticky-menu">
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
                                    {setting.auth ? 
                                        (
                                            <li className="nav-button dropdown">
                                                <Link className="nav-link dropdown-toggle" to={process.env.PUBLIC_URL + "/logout"} data-toggle="dropdown">Log Out</Link>
                                            </li>
                                        ): (
                                        <>
                                            <li className="nav-button dropdown active">
                                                <Link className="nav-link dropdown-toggle" to={process.env.PUBLIC_URL + "/login"} data-toggle="dropdown">Sign In</Link>
                                            </li>
                                            <li className="nav-button dropdown">
                                                <Link className="nav-link dropdown-toggle" to={process.env.PUBLIC_URL + "/register"} data-toggle="dropdown">Sign Up</Link>
                                            </li>
                                        </>
                                        )
                                    }
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Styles>
    )
}

export default StickyMenu