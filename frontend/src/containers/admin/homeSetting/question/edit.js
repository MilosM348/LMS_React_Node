import React, {useState, useEffect} from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  IconButton,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {Edit} from '@material-ui/icons'
import {NotificationManager} from 'react-notifications'

import {useAsync} from '../../../../service/utils'
import {update} from '../../../../api/settingQuestion'

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
const EditDialog = (props) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles()
  const {item, refresh} = props
  const [modalActive, setModalActive] = useState(false)
  const [question, setQuestin] = useState('')
  const [answer, setAnswer] = useState('')
  const [pending, setPending] = useState(false)

  const handleClickOpen = () => {
    setQuestin(item.question)
    setAnswer(item.answer)
    setModalActive(true)
  }
  const handleClose = () => {
    setModalActive(false)
  }
  const validate = () => {
    let res = true
    if (question === '')
      res = false
    if (answer === '')
      res = false
    if (!res)
      NotificationManager.warning('Please input required fields', 'Worning', 3000);
    return res
  }
  const handleSave = () => {
    if (!validate())
      return
    let tmp = {}
    tmp._id = item._id
    tmp.question = question
    tmp.answer = answer
    run(update(tmp))
    setPending(true)
  }

  useEffect(() => {
    if (status === 'resolved') {
      setPending(false)
      setModalActive(false)
      refresh()
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false)
    }
  }, [status, run])
  return (
    <>
      <IconButton aria-label="delete" onClick={handleClickOpen}>
        <Edit />
      </IconButton>
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
        <DialogTitle id="form-dialog-title">Update Question</DialogTitle>
        <DialogContent>
          <DialogContentText>
          please input data
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="question"
            label="Question"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            autoComplete="off"
            value={question}
            onChange={(e) => setQuestin(e.target.value)}
            style={{marginTop: 20, marginBottom: 20}}
          />
          <TextField
            autoFocus
            margin="dense"
            id="answer"
            label="Answer"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            autoComplete="off"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
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
export default EditDialog
