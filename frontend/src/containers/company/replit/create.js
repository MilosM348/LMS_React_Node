import React, {useState, useEffect} from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {NotificationManager} from 'react-notifications'

import {useAsync} from '../../../service/utils'
import {create, getFilter} from '../../../api/replit'
import {getFilter as getUser} from '../../../api/user'

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
  const classes = useStyles()
  const {refresh, companyId} = props
  const [modalActive, setModalActive] = useState(false)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [asyncState, setAsyncState] = useState('')
  const [pending, setPending] = useState(false)

  const handleClickOpen = () => {
    setName('')
    setPassword('')
    setUserEmail('')
    setModalActive(true)
  }
  const handleClose = () => {
    setModalActive(false)
  }
  const validate = () => {
    let res = true
    if (name === '')
      res = false
    if (password === '')
      res = false
    if (!res)
      NotificationManager.warning('Please input required fields', 'Worning', 3000);
    return res
  }
  const handleSave = () => {
    if (!validate())
      return
    if (userEmail === '') {
      run(create({
        name: name,
        password: password,
        userID: '',
        companyID: companyId,
      }))
      setAsyncState('create')
    }
    else {
      run(getUser({email: userEmail}))
      setAsyncState('getUser')
    }
    setPending(true)
  }

  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'getUser') {
        if (data.length === 0) {
          NotificationManager.warning('User email is not exist', 'Worning', 3000);
        }
        else {
          run(create({
            name: name,
            password: password,
            userID: data[0]._id,
            companyID: companyId,
          }))
          setAsyncState('create')
        }
      }
      else if (asyncState === 'create') {
        setPending(false)
        setModalActive(false) 
        refresh()
      }
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false)
    }
  }, [run, status, data, error])
  return (
    <>
      <Button className={classes.button} style={{marginBottom: 10, float: 'right'}} variant="outlined" onClick={handleClickOpen}>Add Replit</Button>
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
        <DialogTitle id="form-dialog-title">Add Repit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            please input data
          </DialogContentText>
          <TextField
            margin="dense"
            id="name"
            label="Replit Username"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{marginTop: 20, marginBottom: 20}}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{marginTop: 20, marginBottom: 20}}
          />
          <TextField
            margin="dense"
            id="userEmail"
            label="User Email"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
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
