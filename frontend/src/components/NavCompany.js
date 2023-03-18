import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Dropdown } from 'react-bootstrap'
import StickyMenu from './common/StickyMenuStudent'
import MobileMenu from './common/MobileMenuStudent'
import { Styles } from "./styles/nav.js"
import {useSetting} from '../provider/setting'

const Header = () => {
  const [setting] = useSetting()

  return (
    <Styles>

      {/* Logo Area */}
      <section className="logo-area">
        <Container>
          <Row>
            <Col md="3">
              <div className="logo">
                <Link to={process.env.PUBLIC_URL + "/"}><img src={process.env.PUBLIC_URL + "/assets/images/logo.png"} alt="" style={{width: 170}} /></Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mobile Menu */}
      <MobileMenu />
    </Styles>
  )
}

export default Header
