import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CountUp from 'react-countup';
import { Styles } from "./styles/aboutUs.js";
import {getAll} from '../api/settingAboutus'
import {useAsync} from '../service/utils'

const AboutUs = () => {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const [init, setInit] = useState(true)
    const [setting, setSetting] = useState({})

    useEffect(() => {
        run(getAll())
    }, [run])
    useEffect(() => {
        if (status === 'resolved') {
            if (data.length !== 0) {
                setSetting(data[0])
                setInit(false)
            }
            else {
                setInit(true)
            }
        }
        else if (status === 'rejected') {
            console.log(error)
        }
    }, [status])
    return (
        <Styles>
            {/* About Us */}
            {!init &&
            (
            <section className="about-us">
                <Container>
                    <Row>
                        <Col md="6">
                            <div className="about-image">
                                <img src={setting.image} className="main-img" />
                                {/* <img src={process.env.PUBLIC_URL + `/assets/images/${Datas.mainImage}`} className="main-img" alt="" /> */}
                                <img src={process.env.PUBLIC_URL + "/assets/images/pattern.png"} className="pattern-img" alt="" />
                                {/* <div className="video-player" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/${Datas.videoBackground})`}}>
                                    <ModalVideo channel='youtube' isOpen={this.state.isOpen} videoId='uXFUl0KcIkA' onClose={() => this.setState({ isOpen: false })} />
                                    <button onClick={this.openModal} className="play-button"><i className="las la-play"></i></button>
                                </div> */}
                            </div>
                        </Col>
                        <Col md="6">
                            <div className="about-content">
                                <h4 className="about-title">{setting.title}</h4>
                                <p className="about-para">{setting.description}</p>
                                <Row>
                                    <Col sm="3">
                                        <div className="counter-box box1 text-center">
                                            <h3><CountUp end={setting.companyNumber} duration={5} delay={1.5} /><i className="las la-plus"></i></h3>
                                            <p>Company</p>
                                        </div>
                                    </Col>
                                    <Col sm="3">
                                        <div className="counter-box box2 text-center">
                                            <h3><CountUp end={setting.countryNumber} duration={5} delay={1.5} /><i className="las la-plus"></i></h3>
                                            <p>Country</p>
                                        </div>
                                    </Col>
                                    <Col sm="3">
                                        <div className="counter-box box3 text-center">
                                            <h3><CountUp end={setting.studentNumber} duration={5} delay={1.5} /><i className="las la-plus"></i></h3>
                                            <p>Student</p>
                                        </div>
                                    </Col>
                                    <Col sm="3">
                                        <div className="counter-box box3 text-center">
                                            <h3><CountUp end={setting.challengeNumber} duration={5} delay={1.5} /><i className="las la-plus"></i></h3>
                                            <p>Challenge</p>
                                        </div>
                                    </Col>
                                </Row>
                                {/* <Link className="readmore-btn" to={process.env.PUBLIC_URL + "/about"}>Read More</Link> */}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            )
            }
        </Styles>
    )
}

export default AboutUs
