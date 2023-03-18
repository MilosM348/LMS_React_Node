import React from 'react'
import { Container, Row, Col } from "react-bootstrap";
import { Styles } from "./styles/content.js";

const Content = () => {

  return (
    <Styles>
      <section className="content">
        <Container>
          <Row>
            <Col md="6" xs="12">
              <div className="description">
                Scale, Seamless and easy-to-use Online Lireaning Management Platform for modern and intelligent entreprises
                and organisations want improve their Business excellences and performance.
              </div>
              <div className="title">
                Don't spend time, set your dreams on the fast track with OnLMP.
              </div>
              <button>Get Start Free Trail Now</button>
            </Col>
            <Col md="6" xs="12">
              <img alt="" src={process.env.PUBLIC_URL + "/assets/images/back.png"} />
            </Col>
          </Row>
        </Container>
      </section>
    </Styles>
  )
}
export default Content;
