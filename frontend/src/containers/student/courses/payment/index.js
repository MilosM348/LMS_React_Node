import React, {useState, useEffect, useRef} from 'react'
import {useParams} from 'react-router-dom'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import {useHistory} from 'react-router-dom'
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap'
import { makeStyles } from '@material-ui/core/styles'
import {NotificationManager} from 'react-notifications'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js"

import Header from '../../../../components/NavTwoStudent'
import { BreadcrumbBox } from '../../../../components/common/Breadcrumb'
import Footer from '../../../../components/FooterTwo'
import { Styles } from '../styles/course.js'
import {useAsync} from '../../../../service/utils'
import {useSetting} from '../../../../provider/setting'
import {get as getPrice} from '../../../../api/price'
import {create as createPayment} from '../../../../api/studentPayment'
import Coupon from './coupon'
import Stripe from './stripe'
import Razorpay from './razorpay'

const stripePromise = loadStripe("pk_test_51IuCHsSJhHkg9TM3mBxgOTPBephq2HUXixuO9SmoExa7Jx1A0yuVwCpPTaNSmaCu0kjq09DxTGmosCeqTh0tG95N00jbOadb5E");
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    textTransform: 'none',
    fontSize: 15,
  },
  check: {
    cursor: 'pointer',
    borderRadius: 5,
    boxShadow: 'rgb(0 0 0 / 10%) 0px 8px 25px',
    border: '1px solid rgb(224, 207, 207)',
    padding: '15px 25px',
    fontSize: 20,
    marginRight: 10,
  },
  activeCheck: {
    backgroundColor: '#e4eaf1',
    color: '#536281',
    cursor: 'pointer',
    borderRadius: 5,
    boxShadow: 'rgb(0 0 0 / 10%) 0px 8px 25px',
    border: '1px solid rgb(224, 207, 207)',
    padding: '15px 25px',
    fontSize: 20,
    marginRight: 10,
  },
  price: {
    textAlign: 'center',
    color: '#d933dc',
    fontSize: 20,
    paddingBottom: 30,
  },
}))
const Payment = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const {id} = useParams()
  const classes = useStyles()
  const history = useHistory()
  const [setting, dispatch] = useSetting()
  const [type, setType] = useState('payment')
  const [price, setPrice] = useState({})
  const [newPrice, setNewPrice] = useState('')
  const [oldPrice, setOldPrice] = useState('')
  const [title, setTitle] = useState('')
  const [discount, setDiscount] = useState(0)
  const [asyncState, setAsyncState] = useState('')

  const paymentResult = (res) => {
    if (res) {
      run(createPayment({
        priceID: price.id,
        studentID: setting.auth.id
      }))
      setAsyncState('createPayment')
      NotificationManager.success('Payment Success', 'Success', 3000);
    }
  }
  const couponResult = (res) => {
    if (res.isFree) {
      run(createPayment({
        priceID: price.id,
        studentID: setting.auth.id
      }))
      setAsyncState('createPayment')
    }
    else {
      setDiscount(res.discount)
      setType('payment')
      setNewPrice(Math.ceil(oldPrice * (100 - parseFloat(res.discount))/100))
    }
  }

  useEffect(() => {
    run(getPrice(id))
    setAsyncState('getPrice')
  }, [run])
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'getPrice') {
        setPrice(data)
        setNewPrice(data?.price)
        setOldPrice(data?.price)
        let tmp = ''
        if (data?.type === 'assignment')
          tmp = `${data?.assignment?.name} all parts`
        else if (data?.type === 'part') {
          tmp = `${data?.assignment?.name} ${data?.part?.name} part`
        }
        else if (data?.type === 'group') {
          const partNames = data?.parts?.map((part) => part.part.name)
          tmp = `${data?.assignment?.name} ${partNames?.join(',')} parts`
        }
        setTitle(tmp)
      }
      else if (asyncState === 'createPayment') {
        history.push(`${process.env.PUBLIC_URL}/course`)
      }
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [status])
  return (
    <div className="main-wrapper course-details-page" >
      {/* Header 2 */}
      < Header />

      {/* Breadcroumb */}
      < BreadcrumbBox title="Payment" />
      <Styles>
        {/* Course Details */}
        <section className="course-details-area">
          <Container>
            <Row>
              <Col md="6" sm="12">
                <div className="text-center" style={{boxShadow: '0 8px 25px rgb(0 0 0 / 10%)', height: '100%', border: 'solid #e0cfcf 1px'}}>
                  <div style={{fontSize: 35, paddingTop: 100}}>
                    {newPrice} 
                    <span>&#x20b9;</span>
                    {discount !== 0 &&
                      <s style={{ paddingLeft: 10, fontSize: 30, color: '#c18b8b'}}>
                        {oldPrice}
                        <span>&#x20b9;</span>
                      </s>
                    }
                  </div>
                  <div style={{fontSize: 23, paddingTop: 25, color: '#84898c'}}>{title}</div>
                </div>
              </Col>
              <Col md="6" sm="12">
                <div className="course-details-top" style={{height: 500}}>
                  <div className="d-flex justify-content-center" style={{paddingTop: 20, paddingBottom: 50}}>
                    {type==='payment'?
                    <>
                      <div className={classes.check} onClick={() => setType('coupon')}>
                        Coupon
                      </div>
                      <div className={classes.activeCheck} onClick={() => setType('payment')}>
                        Payment
                      </div>
                    </>:
                    <>
                      <div className={classes.activeCheck} onClick={() => setType('coupon')}>
                        Coupon
                      </div>
                      <div className={classes.check} onClick={() => setType('payment')}>
                        Payment
                      </div>  
                    </>
                    }
                    
                    {/* <button type="button" className="start-btn" onClick={() => setType('coupon')} style={{margin: 10}}>Coupon</button>
                    <button type="button" className="start-btn" onClick={() => setType('payment')} style={{margin: 10}}>Payment</button> */}
                  </div>
                  {type === 'coupon' &&
                    <Coupon priceId={price?.id} result={couponResult} />
                  }
                  {type === 'payment' &&
                  <div className="course-tab-list">
                    <Tab.Container defaultActiveKey="stripCard">
                      <Nav className="flex-column">
                        <Nav.Item>
                          <Nav.Link eventKey="stripCard">Strip Card</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="razorpay">Razorpay</Nav.Link>
                        </Nav.Item>
                      </Nav>
                      <Tab.Content>
                        <Tab.Pane eventKey="stripCard" className="overview-tab">
                          <Elements stripe={stripePromise}>
                            <Stripe price={newPrice} title={title} result={paymentResult} />
                          </Elements>
                        </Tab.Pane>
                        <Tab.Pane eventKey="razorpay" className="curriculum-tab">
                          <Razorpay price={newPrice} title={title} result={paymentResult} />
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </div>
                  }
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </Styles>
      {/* Footer 2 */}
      <Footer />
    </div>
  )
}
export default Payment
