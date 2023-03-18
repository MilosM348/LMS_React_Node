import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Swiper from 'react-id-swiper';
import { Styles } from "./styles/teamSlider.js";
import {useAsync} from '../service/utils'
import {getAll} from '../api/settingHelper'

const TeamSlider = () => {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const [init, setInit] = useState(true)
    const [datas, setDatas] = useState([])
    const settings = {
        slidesPerView: 4,
        loop: false,
        speed: 1000,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        spaceBetween: 30,
        watchSlidesVisibility: true,
        pagination: {
            el: '.slider-dot.text-center',
            clickable: true
        },
        breakpoints: {
            0: {
                slidesPerView: 1
            },
            576: {
                slidesPerView: 2
            },
            768: {
                slidesPerView: 3
            },
            992: {
                slidesPerView: 4
            }
        }
    };
    useEffect(() => {
        run(getAll())
    }, [run])
    useEffect(() => {
        if (status === 'resolved') {
            console.log(data)
            if (data.length !== 0) {
                setDatas(data)
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
            {/* Team Slider */}
            {!init &&
            (
            <section className="team-member-area">
                <Container>
                    <Row>
                        <Col md="12">
                            <div className="sec-title text-center">
                                <h4>We Have Fantustic Team To Help Student And They Are Always Ready.</h4>
                            </div>
                        </Col>
                        <Col md="12" className="team-slider">
                            <Swiper {...settings}>
                                {
                                    datas.map((data, i) => (
                                        <div className="team-item" key={i}>
                                            <img src={data.avatar} className="img-fluid" />
                                            {/* <img src={process.env.PUBLIC_URL + `/assets/images/${data.personImage}`} alt="" className="img-fluid" /> */}
                                            <div className="img-content text-center">
                                                <h5>{data.name}</h5>
                                                <p>{data.title}</p>
                                                <ul className="list-unstyled list-inline">
                                                    <li className="list-inline-item"><a href={data.facebook}><i className="fab fa-facebook-f"></i></a></li>
                                                    <li className="list-inline-item"><a href={data.twitter}><i className="fab fa-twitter"></i></a></li>
                                                    <li className="list-inline-item"><a href={data.youtube}><i className="fab fa-youtube"></i></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    ))
                                }
                            </Swiper>
                        </Col>
                    </Row>
                </Container>
            </section>
            )
            }
        </Styles>
    )
}

export default TeamSlider
