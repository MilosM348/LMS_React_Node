import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

import {useAsync} from '../../../../service/utils'
import {useSetting} from '../../../../provider/setting'
import {getRestPrices as getPrices} from '../../../../api/price'
import {getByStudentId as getLevel} from '../../../../api/level'
const CreateDialog = (props) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const [setting] = useSetting()
  const {to, assignmentId} = props
  const [isPaid, setIsPaid] = useState(false)
  const [prices, setPrices] = useState([])
  const [price, setPrice] = useState({})
  const [asyncState, setAsyncState] = useState('')

  const payment = (partId) => {
    if (prices.length === 0) {
      setIsPaid(true)
      return
    }
    const paymentType = prices[0].type
    let paid = false
    console.log('payment type', paymentType)
    if (paymentType === 'assignment') {
      setPrice(prices[0])
    }
    else if (paymentType === 'part') {
      let tmp = prices.filter((item) => item.part.id === partId)
      console.log('part', tmp)
      if (tmp.length === 0)
        paid = true
      else {
        setPrice(tmp[0])
      }
    }
    else if (paymentType === 'group') {
      let tmp = prices.filter((item) => {
        let res = -1
        item.parts.forEach((item, index) => {
          if (item.partID === partId)
            res = index
        })
        return res !== -1
      })
      console.log('group', tmp)
      if (tmp.length === 0)
        paid = true
      else 
        setPrice(tmp[0])
    }
    setIsPaid(paid)
  }

  useEffect(() => {
    run(getPrices(setting?.auth?.id, assignmentId))
    setAsyncState('getPrices')
  }, [run])
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'getPrices') {
        setPrices(data)
        if (data.length === 0) {
          setIsPaid(true)
        }
        else {
          run(getLevel(assignmentId, setting?.auth?.id))
          setAsyncState('getLevel')
        }
      }
      else if (asyncState === 'getLevel') {
        if (data !== null) {
          payment(data?.level?.partID)
        }
      }
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [status])
  return (
    <>
      {
        isPaid?
          <Link to={to} className="start-btn">Start</Link>:
          <Link to={`${process.env.PUBLIC_URL}/payment/${price._id}`} className="start-btn">Pay Now</Link>
      }
    </>
  )
}
export default CreateDialog
