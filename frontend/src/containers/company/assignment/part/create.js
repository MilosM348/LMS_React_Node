import React, {useState, useEffect} from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ImageUploader from 'react-images-upload';
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'
import {NotificationManager} from 'react-notifications'

import FileUpload from '../../../../components/fileUpload'
import {useAsync} from '../../../../service/utils'
import {upload} from '../../../../api/file'
import {getRandomString, getFileExtension} from '../../../../service/string'
import {create} from '../../../../api/part'

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
  const {assignmentId, refresh, maxPart} = props
  const classes = useStyles();
  const [modalActive, setModalActive] = useState(false)
  const [name, setName] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [video, setVideo] = useState(null)
  const [pending, setPending] = useState(false)

  const handleClickOpen = () => {
    setDescription('')
    setTitle('')
    setImage(null)
    setVideo(null)
    setModalActive(true)
  }
  const handleClose = () => {
    setModalActive(false)
  }
  const validate = () => {
    let res = true
    if (title === '')
      res = false
    else if (description === '')
      res = false
    else if (image === null)
      res = false
    if (!res)
      NotificationManager.warning('Please input required fields', 'Worning', 3000);
    return res
  }
  const handleSave = async () => {
    if (!validate())
      return
    let tmp = {}
    let result = await upload(image)
    tmp.image = result.url
    result = await upload(video)
    tmp.video = result.url
    tmp.name = name;
    tmp.title = title;
    tmp.description = description;
    tmp.assignmentID = assignmentId;
    tmp.levelLength = 0;
    run(create(tmp))
    setPending(true)
  }
  const onDrop = (file, select) => {
    if (select === 'real')
      setImage(file[0])
  }
  const changeFile = (file, select) => {
    if (select === 'real')
      setVideo(file)
  }

  useEffect(() => {
    setName(maxPart + 1)
  }, [maxPart])
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
      <Button className={classes.button} style={{marginBottom: 10, float: 'right'}} variant="outlined" onClick={handleClickOpen}>Add Part</Button>
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
        <DialogTitle id="form-dialog-title">Add Part {name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Page data
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
          <FileUpload label={'Choose Video'} changeFile={(file) => changeFile(file, 'real')} />
          <ImageUploader
            withIcon={false}
            withPreview={true}
            singleImage={true}
            buttonText='Choose images'
            onChange={(file) => onDrop(file, 'real')}
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
