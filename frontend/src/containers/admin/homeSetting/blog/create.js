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
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'
import {NotificationManager} from 'react-notifications'

import {upload} from '../../../../api/file'
import {useAsync} from '../../../../service/utils'
import {create} from '../../../../api/settingBlog'
import {getRandomString, getFileExtension} from '../../../../service/string'

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
  const [smallDescription, setSmallDescription] = useState('')
  const [description, setDescription] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [commentNumber, setCommentNumber] = useState(0)
  const [thumbNumber, setThumbNumber] = useState(0)
  const [date, setDate] = useState('')
  const [image, setImage] = useState(null)
  const [filename, setFilename] = useState('')
  const [asyncState, setAsyncState] = useState('')
  const [pending, setPending] = useState(false)

  const handleClickOpen = () => {
    setImage(null)
    setTitle('')
    setSmallDescription('')
    setDescription('')
    setAuthorName('')
    setCommentNumber(0)
    setThumbNumber(0)
    setDate('')
    setModalActive(true)
  }
  const handleClose = () => {
    setModalActive(false)
  }
  const validate = () => {
    let res = true
    if (image === null)
      res = false
    if (title === '')
      res = false
    if (smallDescription === '')
      res = false
    if (description === '')
      res = false
    if (authorName === '')
      res = false
    if (date === '')
      res = false
    if (!res)
      NotificationManager.warning('Please input required fields', 'Worning', 3000);
    return res
  }
  const handleSave = async () => {
    if (!validate())
      return
    let result = await upload(image)
    let tmpDate = new Date(date)
    run(create({
      title: title,
      smallDescription: smallDescription,
      description: description,
      authorName: authorName,
      commentNumber: commentNumber,
      thumbNumber: thumbNumber,
      image: result.url,
      month: tmpDate.getMonth() + 1,
      day: tmpDate.getDate() + 1,
    }))
    setPending(true)
  }
  const onDrop = (file) => {
    setImage(file[0])
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
      <Button className={classes.button} style={{marginBottom: 10, float: 'right'}} variant="outlined" onClick={handleClickOpen}>Add Blog</Button>
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
        <DialogTitle id="form-dialog-title">Add Blog</DialogTitle>
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
            id="smallDescription"
            label="Small Description"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            autoComplete="off"
            value={smallDescription}
            onChange={(e) => setSmallDescription(e.target.value)}
            style={{marginTop: 20, marginBottom: 20}}
          />
          <SunEditor
            // setContents="My contents"
            showToolbar={true}
            onChange={setDescription}
            setDefaultStyle="height: auto"
            setOptions={{
              buttonList: [
                [
                  "bold",
                  "underline",
                  "italic",
                  "strike",
                  "list",
                  "align",
                  "fontSize",
                  "formatBlock",
                  "table",
                  "image"
                ]
              ]
            }}
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
            id="date"
            label="Date"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: 0, 
              style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="commentNumber"
            label="Comment Number"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="number"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={commentNumber}
            onChange={(e) => setCommentNumber(e.target.value)}
            style={{marginTop: 20, marginBottom: 20}}
          />
          <TextField
            autoFocus
            margin="dense"
            id="thumbNumber"
            label="Thumb Number"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="number"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={thumbNumber}
            onChange={(e) => setThumbNumber(e.target.value)}
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
