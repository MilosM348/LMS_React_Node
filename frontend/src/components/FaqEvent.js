import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Styles } from "./styles/faqEvent.js";
import Question from './Question'
import Event from './Event'

function FaqEvent() {

    return (
        <Styles>
            {/* Faq & Event */}
            <section className="event-faq-area">
                <Container>
                    <Row>
                        <Col md="6">
                            <div className="event-area">
                                <Row>
                                    <Col md="12">
                                        <div className="sec-title">
                                            <h4>Upcoming <span>Events</span></h4>
                                        </div>
                                    </Col>
                                    <Event />
                                </Row>
                            </div>
                        </Col>
                        <Col md="6">
                            <div className="faq-area">
                                <div className="sec-title">
                                    <h4>Frequently Ask <span>Question</span></h4>
                                </div>
                                <Question />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Styles>
    )
}

export default FaqEvent
