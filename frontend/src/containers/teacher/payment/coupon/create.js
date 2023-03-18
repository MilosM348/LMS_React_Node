import React, {useState, useEffect} from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {NotificationManager} from 'react-notifications'

import {useAsync} from '../../../../service/utils'
import {getRandomString, getFileExtension, isNumeric} from '../../../../service/string'
import {attach} from '../../../../api/coupon'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    textTransform: 'none',
    fontSize: 15,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))
const CreateDialog = (props) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const {priceId, refresh} = props
  const classes = useStyles();
  const [modalActive, setModalActive] = useState(false)
  const [number, setNumber] = useState(0)
  const [discount, setDiscount] = useState('')
  const [isFree, setIsFree] = useState(true)
  const [pending, setPending] = useState(false)

  const handleClickOpen = () => {
    setNumber(0)
    setDiscount('')
    setIsFree(true)
    setModalActive(true)
  }
  const handleClose = () => {
    setModalActive(false)
  }
  const validate = () => {
    let res = true
    let msg = ''
    if (number <= 0) {
      res = false
      msg = 'Please input positive value'
    }
    if (!isFree && discount === '') {
      res = false
      msg = 'Please input require field'
    }
    if (!isFree && !isNumeric(discount)) {
      res = false
      msg = 'Please input value between 10 and 95'
    }
    if (!res)
      NotificationManager.warning(msg, 'Worning', 3000);
    return res
  }
  const handleSave = () => {
    if (!validate())
      return
    let codes = []
    for (let i = 0; i < number; i++) {
      const code = getRandomString(15)
      codes = [...codes, code]
    }
    run(attach(priceId, codes, isFree, parseFloat(discount)))
    setPending(true)
  }
  
  useEffect(() => {
    if (status === 'resolved') {
      setPending(false)
      refresh()
      setModalActive(false)
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false)
    }
  }, [run, status])
  return (
    <>
      <Button className={classes.button} style={{marginBottom: 10, float: 'right'}} variant="outlined" onClick={handleClickOpen}>Create Coupons</Button>
      <Backdrop className={classes.backdrop} open={pending} style={{zIndex: 9999}}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Dialog 
        disableBackdropClick
        disableEscapeKeyDown
        open={modalActive} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle id="form-dialog-title">Create Coupons</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Page data
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="number"
            label="Number"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="number"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            style={{marginTop: 20, marginBottom: 20}}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                color="primary"
              />
            }
            label="Free"
          />
          <TextField
            autoFocus
            margin="dense"
            id="discount"
            label="Discount Percentage"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            disabled={isFree}
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            style={{marginTop: 20, marginBottom: 20}}
          />
        </DialogContent>
        <DialogActions>
          <Button className={classes.button} onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button className={classes.button} onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default CreateDialog
