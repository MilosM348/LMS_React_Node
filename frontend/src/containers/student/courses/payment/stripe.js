import React, { useState, useEffect, forwardRef, useImperativeHandle} from "react";
import { 
  CardElement,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";
import {NotificationManager} from 'react-notifications'

import {paymentIntent} from '../../../../api/stripe'
import {useAsync} from '../../../../service/utils'
import {useSetting} from '../../../../provider/setting'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#303238",
      fontSize: "16px",
      fontFamily: "sans-serif",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#CFD7DF"
      }
    },
    invalid: {
      color: "#e5424d",
      ":focus": {
        color: "#303238"
      }
    }
  }
};

function CardSection() {
  return (
    <label style={{width: '100%'}}>
      <div style={{padding: 20}}>
        Card details
      </div>
      <CardElement options={CARD_ELEMENT_OPTIONS} />
    </label>
  );
}

const Stripe = forwardRef((props, ref) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const {title, price, result} = props
  const [setting] = useSetting()
  const stripe = useStripe()
  const elements = useElements()
  const [asyncState, setAsyncState] = useState('')

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
    run(paymentIntent({
      name: setting.auth.name,
      email: setting.auth.email,
      amount: price, 
      currency: 'inr', 
      description: `${title} by ${setting.auth.email}`, 
      token: result.token
    }))
    setAsyncState('paymentIntent')
  }
  const confirm = async (clientSecret) => {
    if (!stripe || !elements) {
      return;
    }
    const billingDetails = {
      name: setting.auth.name,
      email: setting.auth.email,
    }
    const card = elements.getElement(CardElement);
    let paymentMethodReq = await stripe.createPaymentMethod({
      type: 'card',
      card: card,
      billing_details: billingDetails,
    })
    console.log(clientSecret)
    console.log(paymentMethodReq)
    const confirmedCardPayment = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodReq?.paymentMethod?.id
    })
    console.log(confirmedCardPayment)
    if (confirmedCardPayment?.paymentIntent?.status === 'succeeded') {
      result(true)
    }
    else {
      NotificationManager.warning('Payment Error', 'Error', 3000);
    }
  }

  useEffect( () => {
    if (status === 'resolved') {
      if (asyncState === 'paymentIntent') {
        console.log(data)
        confirm(data.data.body.clientSecret)
      }
    }
    else if (status === 'rejected') {
        console.log(error)
    }
  }, [status, run])
  return (
    <>
      <CardSection />
      <div className="d-flex justify-content-center pt-5">
        <button type="button" className="start-btn" onClick={handleSubmit} style={{margin: 10}}>Paynow ({price})<span>&#x20b9;</span></button>
      </div>
    </>
  );
})

export default Stripe;