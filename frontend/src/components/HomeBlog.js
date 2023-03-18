import React, { useState, useEffect } from 'react';
import Datas from '../data/blog/home-blog.json';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Styles } from "./styles/homeBlog.js";
import {useAsync} from '../service/utils'
import AmplifyImage from './amplifyImage'
import {getAll} from '../api/settingBlog'
import {getMonth} from '../service/string'

const HomeBlog = () => {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const [init, setInit] = useState(true)
    const [datas, setDatas] = useState([])

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
            {/* Blog Area */}
            {!init &&
            (
            <section className="home-blog-area">
                <Container>
                    <Row>
                        <Col md="12">
                            <div className="sec-title text-center">
                                <h4>{Datas.secTitle}</h4>
                            </div>
                        </Col>
                        {
                            datas.map((data, i) => (
                                <Col md="6" key={i}>
                                    <div className="blog-post">
                                        <Row>
                                            <Col lg="6" md="12">
                                                <div className="blog-img">
                                                    <Link to={`${process.env.PUBLIC_URL}/blog/detail/${data._id}`}><img src={data.image} className="img-fluid" /></Link>
                                                </div>
                                            </Col>
                                            <Col lg="6" md="12">
                                                <div className="blog-content">
                                                    <div className="content-box">
                                                        <div className="top-content d-flex">
                                                            <div className="blog-date text-center">
                                                                <p>{`${data.day} ${getMonth(data.month)}`}</p>
                                                            </div>
                                                            <div className="blog-title">
                                                                <h6><Link to={`${process.env.PUBLIC_URL}/blog/detail/${data.id}`}>{data.title}</Link></h6>
                                                            </div>
                                                        </div>
                                                        <div className="blog-desk">
                                                            <p>{data.smallDescription}</p>
                                                            <ul className="list-unstyled list-inline">
                                                                <li className="list-inline-item"><Link to={process.env.PUBLIC_URL}><i className="las la-user"></i> {data.authorName}</Link></li>
                                                                <li className="list-inline-item"><Link to={process.env.PUBLIC_URL}><i className="las la-comment"></i> {data.commentNumber}</Link></li>
                                                                <li className="list-inline-item"><Link to={process.env.PUBLIC_URL}><i className="las la-thumbs-up"></i> {data.thumbNumber}</Link></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            ))
                        }
                    </Row>
                </Container>
            </section>
            )
            }
        </Styles>
    )
}

export default HomeBlog
