import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react'
import {
  TextField,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {NotificationManager} from 'react-notifications'

import {useAsync} from '../../../../service/utils'
import {useSetting} from '../../../../provider/setting'
import {getFilter as getCoupons, remove as removeCoupon} from '../../../../api/coupon'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    textTransform: 'none',
    fontSize: 15,
  },
  price: {
    textAlign: 'center',
    color: '#d933dc',
    fontSize: 20,
    paddingBottom: 30,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))
const Coupon = forwardRef((props, ref) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles();
  const [setting, dispatch] = useSetting()
  const {priceId, result} = props
  const [code, setCode] = useState('')
  const [coupon, setCoupon] = useState({})
  const [asyncState, setAsyncState] = useState('')

  const validate = () => {
    let res = true
    if (code === '')
      res = false
    if (!res)
      NotificationManager.warning('Please input code field', 'Worning', 3000);
    return res
  }
  const handleSubmit = () => {
    if (validate()){
      run(getCoupons({priceID: {eq: priceId}, code: {eq: code}}))
      setAsyncState('get')
    }
  }

  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'get') {
        if (data.length !== 0) {
          setCoupon(data[0])
          run(removeCoupon(data[0].id))
          setAsyncState('remove')
        }
      }
      else if (asyncState === 'remove') {
        result({
          isFree: coupon.isFree,
          discount: coupon.discountPercentage,
        })
      }
    }
    else if (status === 'rejected') {
      console.log(error)
      NotificationManager.error('Coupon error', 'Worning', 3000);
    }
  }, [status])
  return (
    <>
      <TextField
        margin="dense"
        id="code"
        label="Coupon Code"
        inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
        type="text"
        fullWidth
        variant="outlined"
        autoComplete="off"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{marginTop: 20}}
      />
      <div className="d-flex justify-content-center pt-5">
        <button type="button" className="start-btn" onClick={handleSubmit} style={{margin: 10}}>Submit</button>
      </div>
    </>
  )
})
export default Coupon
