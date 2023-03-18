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
import ImageUploader from 'react-images-upload'
import {NotificationManager} from 'react-notifications'

import {upload} from '../../../../api/file'
import {useAsync} from '../../../../service/utils'
import {create} from '../../../../api/settingTestimonial'

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
  const {refresh} = props
  const [modalActive, setModalActive] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [authorTitle, setAuthorTitle] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [pending, setPending] = useState(false)

  const handleClickOpen = () => {
    setAvatar(null)
    setTitle('')
    setDescription('')
    setAuthorName('')
    setAuthorTitle('')
    setModalActive(true)
  }
  const handleClose = () => {
    setModalActive(false)
  }
  const validate = () => {
    let res = true
    if (avatar === null)
      res = false
    if (title === '')
      res = false
    if (description === '')
      res = false
    if (authorName === '')
      res = false
    if (authorTitle === '')
      res = false
    if (!res)
      NotificationManager.warning('Please input required fields', 'Worning', 3000);
    return res
  }
  const handleSave = async () => {
    if (!validate())
      return
    let result = await upload(avatar)
    run(create({
          title: title,
          description: description,
          authorName: authorName,
          authorTitle: authorTitle,
          avatar: result.url,
        }))
    setPending(true)
  }
  const onDrop = (file) => {
    setAvatar(file[0])
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
  }, [run, status, data, error])
  return (
    <>
      <Button className={classes.button} style={{marginBottom: 10, float: 'right'}} variant="outlined" onClick={handleClickOpen}>Add Testimonial</Button>
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
        <DialogTitle id="form-dialog-title">Add Testimonial</DialogTitle>
        <DialogContent>
          <DialogContentText>
            please input data
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{marginTop: 20, marginBottom: 20}}
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            autoComplete="off"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{marginTop: 20, marginBottom: 20}}
          />
          <TextField
            autoFocus
            margin="dense"
            id="authorName"
            label="Author Name"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            style={{marginTop: 20, marginBottom: 20}}
          />
          <TextField
            autoFocus
            margin="dense"
            id="authorTitle"
            label="Author Title"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={authorTitle}
            onChange={(e) => setAuthorTitle(e.target.value)}
            style={{marginTop: 20, marginBottom: 20}}
          />
          <ImageUploader
            withIcon={false}
            withPreview={true}
            singleImage={true}
            buttonText='Choose images'
            onChange={onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
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
