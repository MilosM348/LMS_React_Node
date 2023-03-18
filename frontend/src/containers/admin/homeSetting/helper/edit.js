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
import ImageUploader from 'react-images-upload';
import {NotificationManager} from 'react-notifications'

import {upload} from '../../../../api/file'
import {useAsync} from '../../../../service/utils'
import {getRandomString, getFileExtension} from '../../../../service/string'
import {update} from '../../../../api/settingHelper'

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
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [facebook, setFacebook] = useState('')
  const [twitter, setTwitter] = useState('')
  const [youtube, setYoutube] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [filename, setFilename] = useState('')
  const [asyncState, setAsyncState] = useState('')
  const [pending, setPending] = useState(false)

  const handleClickOpen = () => {
    setAvatar(null)
    setName(item.name)
    setTitle(item.title)
    setFacebook(item.facebook)
    setTwitter(item.twitter)
    setYoutube(item.youtube)
    setModalActive(true)
  }
  const handleClose = () => {
    setModalActive(false)
  }
  const validate = () => {
    let res = true
    if (title === '')
      res = false
    if (name === '')
      res = false
    if (facebook === '')
      res = false
    if (twitter === '')
      res = false
    if (youtube === '')
      res = false
    if (!res)
      NotificationManager.warning('Please input required fields', 'Worning', 3000);
    return res
  }
  const handleSave = async () => {
    if (!validate())
      return
    let tmp = {}
    if (avatar !== null) {
      let result = await upload(avatar)
      tmp.avatar = result.url
    }
    tmp._id = item._id
    tmp.name = name
    tmp.title = title
    tmp.facebook = facebook
    tmp.twitter = twitter
    tmp.youtube = youtube
    run(update(tmp))
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
        <DialogTitle id="form-dialog-title">Update Testimonial</DialogTitle>
        <DialogContent>
          <DialogContentText>
          please input data
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
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
            id="facebook"
            label="Facebook"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            style={{marginTop: 20, marginBottom: 20}}
          />
          <TextField
            autoFocus
            margin="dense"
            id="twitter"
            label="Twitter"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            style={{marginTop: 20, marginBottom: 20}}
          />
          <TextField
            autoFocus
            margin="dense"
            id="youtube"
            label="Youtube"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
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
export default EditDialog
