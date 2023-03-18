import React, { useState, useEffect } from 'react';
import Datas from '../data/testimonial/testimonial-slider.json';
import { Container, Row, Col } from 'react-bootstrap';
import Swiper from 'react-id-swiper';
import { Styles } from "./styles/testimonialSlider.js";
import {getAll} from '../api/settingTestimonial'
import {useAsync} from '../service/utils'

const TestimonialSlider = () => {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const [init, setInit] = useState(true)
    const [datas, setDatas] = useState([])
    const settings = {
        slidesPerView: 2,
        loop: true,
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
                slidesPerView: 1
            },
            768: {
                slidesPerView: 2
            },
            992: {
                slidesPerView: 2
            }
        }
    }

    useEffect(() => {
        run(getAll())
    }, [run])
    useEffect(() => {
        if (status === 'resolved') {
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
            {/* Testimonial Slider */}
            {!init &&
            (
            <section className="testimonial-area">
                <Container>
                    <Row>
                        <Col md="12">
                            {/* <div className="sec-title text-center">
                                <h4>Testimonials</h4>
                            </div> */}
                        </Col>
                        <Col md="12" className="testimonial-slider">
                            <Swiper {...settings}>
                                {
                                    datas.map((data, i) => (
                                        <div className="slider-item" key={i}>
                                            <div className="desc">
                                                <h5>{data.title}</h5>
                                                <p>{data.description}</p>
                                            </div>
                                            <div className="writer">
                                                <img src={data.avatar} className="slider-image" />
                                                {/* <img src={process.env.PUBLIC_URL + `/assets/images/${data.authorImg}`} className="slider-image" alt={data.authorImg} /> */}
                                                <h6>{data.authorName}</h6>
                                                <p>{data.authorTitle}</p>
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

export default TestimonialSlider
