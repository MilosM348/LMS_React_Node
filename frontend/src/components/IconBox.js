import React, { useEffect, useState } from 'react';
import Datas from '../data/icon-box/icon-box.json';
import { Container, Row, Col } from 'react-bootstrap';
import { Styles } from "./styles/iconBox.js";
import {useAsync} from '../service/utils'
import {getAll} from '../api/SettingiconBox'

const IconBox = () => {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const [firstTitle, setFirstTitle] = useState('')
    const [firstDescription, setFirstDescription] = useState('')
    const [secondTitle, setSecondTitle] = useState('')
    const [secondDescription, setSecondDescription] = useState('')
    const [thirdTitle, setThirdTitle] = useState('')
    const [thirdDescription, setThirdDescription] = useState('')

    useEffect(() => {
        run(getAll())
    }, [run])
    useEffect(() => {
        if (status === 'resolved') {
            if (data.length !== 0) {
                setFirstTitle(data[0]?.firstTitle)
                setFirstDescription(data[0]?.firstDescription)
                setSecondTitle(data[0]?.secondTitle)
                setSecondDescription(data[0]?.secondDescription)
                setThirdTitle(data[0]?.thirdTitle)
                setThirdDescription(data[0]?.thirdDescription)
            }
        }
        else if (status === 'rejected') {
          console.log(error)
        }
    }, [status])
    return (
        <Styles>
            {/* Icon Box */}
            <section className="icon-box-area">
                <Container>
                    <Row>
                        <Col md="4">
                            <div className="full-icon-box">
                                <div className="icon-box d-flex">
                                    <div className="box-icon box1">
                                        <i className="flaticon-thumbs-like"></i>
                                    </div>
                                    <div className="box-title">
                                        <h6>{firstTitle}</h6>
                                        <p>{firstDescription}</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="full-icon-box">
                                <div className="icon-box d-flex">
                                    <div className="box-icon box2">
                                        <i className="flaticon-reading"></i>
                                    </div>
                                    <div className="box-title">
                                        <h6>{secondTitle}</h6>
                                        <p>{secondDescription}</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md="4">
                            <div className="full-icon-box">
                                <div className="icon-box d-flex">
                                    <div className="box-icon box3">
                                        <i className="flaticon-teacher"></i>
                                    </div>
                                    <div className="box-title">
                                        <h6>{thirdTitle}</h6>
                                        <p>{thirdDescription}</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Styles>
    )
}

export default IconBox
