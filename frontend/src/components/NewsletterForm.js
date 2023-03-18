import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import { Styles } from "./styles/newsletterForm.js"
import {isEmail} from '../service/string'
import {create} from '../api/newsLetter'
import {useAsync} from '../service/utils'

function NewsletterForm() {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    let secTitle = 'Get The Latest News & Updates On Your Box'
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

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
        if (status === 'resolved') {
           
        }
        else if (status === 'rejected') {
            console.log(error)
        }
    }, [status])

    return (
        <Styles>
            {/* Newsletter Form */}
            <section className="newsletter-form-area">
                <Container>
                    <Row>
                        <Col md="12">
                            <div className="newsletter-container">
                                <div className="newsletter-box">
                                    <div className="sec-title text-center">
                                        <h4>{secTitle}</h4>
                                    </div>
                                    <div id="form2" className="form">
                                        <Row>
                                            <Col md="4">
                                                <p className="form-control">
                                                    <input type="text" placeholder="Enter your Name" id="name2" value={name} onChange={(e) => setName(e.target.value)} />
                                                    <span className="input-msg2"></span>
                                                </p>
                                            </Col>
                                            <Col md="4">
                                                <p className="form-control">
                                                    <input type="email" placeholder="Enter your Email" id="email2" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                    <span className="input-msg2"></span>
                                                </p>
                                            </Col>
                                            <Col md="4">
                                                <button onClick={handleSubmit}><i className="las la-envelope"></i>Subscribe Now</button>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Styles>
    );
}

export default NewsletterForm
