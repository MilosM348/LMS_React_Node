import React, {useState, useEffect} from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ImageUploader from 'react-images-upload'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'
import {NotificationManager} from 'react-notifications'

import {upload} from '../../../api/file'
import {useAsync} from '../../../service/utils'
import {getRandomString, getFileExtension, isNumeric} from '../../../service/string'
import {useSetting} from '../../../provider/setting'
import {create} from '../../../api/assignment'
import {getAll} from '../../../api/subject'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};
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
  const classes = useStyles();
  const [setting, dispatch] = useSetting()
  const {refresh} = props
  const [modalActive, setModalActive] = useState(false)
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [review, setReview] = useState('')
  const [studentNumber, setStudentNumber] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [duration, setDuration] = useState('')
  const [language, setLanguage] = useState('')
  const [skillLevel, setSkillLevel] = useState('')
  const [subject, setSubject] = useState('')
  const [subjects, setSubjects] = useState([])
  const [lectures, setLectures] = useState(0)
  const [enrolled, setEnrolled] = useState(0)
  const [fee, setFee] = useState(0)
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [pending, setPending] = useState(false)
  const [asyncState, setAsyncState] = useState('')

  const handleClickOpen = () => {
    setName('')
    setFee('')
    setDescription('')
    setTitle('')
    setReview('')
    setDuration('')
    setStartDate('')
    setLanguage('')
    setSkillLevel('')
    setImage(null)
    setStudentNumber(0)
    setLectures(0)
    setEnrolled(0)
    run(getAll())
    setAsyncState('getAll')
    setModalActive(true)
  }
  const handleClose = () => {
    setModalActive(false)
  }
  const validate = () => {
    let res = true
    if (name === '')
      res = false
    if (fee === '' || !isNumeric(fee))
      res = false
    if (description === '')
      res = false
    if (title === '')
      res = false
    if (review === '' || !isNumeric(review))
      res = false
    if (parseFloat(review) < 0 || parseFloat(review) > 5)
      res = false
    if (startDate === '')
      res = false
    if (duration === '')
      res = false
    if (language === '')
      res = false
    if (skillLevel === '')
      res = false
    if (subject === '')
      res = false
    if (image === null)
      res = false
    if (!res)
      NotificationManager.warning('Please input required fields', 'Worning', 3000);
    return res
  }
  const handleSave = () => {
    if (!validate())
      return
    run(upload(image))
    setAsyncState('upload')
    setPending(true)
  }
  const onDrop = (file) => {
    setImage(file[0])
  }

  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'upload') {
        console.log(data)
        run(create({
          name: name,
          title: title,
          image: data.url,
          fee: fee,
          description: description,
          review: review,
          studentNumber: studentNumber,
          startDate: startDate,
          duration: duration,
          language: language,
          skillLevel: skillLevel,
          subject: subject,
          lectures: lectures,
          enrolled: enrolled,
          ownerID: setting.auth._id,
          activate: true,
        }))
        setAsyncState('create')
      }
      else if (asyncState === 'create') {
        setPending(false)
        setModalActive(false)
        refresh()
        setAsyncState('')
      }
      if (asyncState === 'getAll') {
        setSubjects(data)
        if (data.length !== 0)
          setSubject(data[0].name)
        setAsyncState('')
      }
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false)
    }
  }, [status])
  return (
    <>
      <Button className={classes.button} style={{marginBottom: 10, float: 'right'}} variant="outlined" onClick={handleClickOpen}>Add Assignment</Button>
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
        <DialogTitle id="form-dialog-title">Add Assignment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            please input assignment data
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
            style={{marginTop: 20}}
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
            style={{marginTop: 20}}
          />
          <TextField
            autoFocus
            margin="dense"
            id="fee"
            label="Fee"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            style={{marginTop: 20}}
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
            id="review"
            label="Review"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            style={{marginTop: 20}}
          />
          <TextField
            autoFocus
            margin="dense"
            id="studentNumber"
            label="StudentNumber"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="number"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            style={{marginTop: 20}}
          />
          <TextField
            id="startDate"
            label="Start Date"
            type="date"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
            id="duration"
            label="Duration"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{marginTop: 20}}
          />
          <TextField
            autoFocus
            margin="dense"
            id="language"
            label="Language"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{marginTop: 20}}
          />
          <TextField
            autoFocus
            margin="dense"
            id="skillLevel"
            label="SkillLevel"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            style={{marginTop: 20}}
          />
          <Select
            style={{width: '100%', textAlign: 'center', marginBottom: 10}}
            value={subject}
            label="Subject"
            onChange={(e) => setSubject(e.target.value)}
            MenuProps={MenuProps}
          >
            {subjects.map((item) => (
              <MenuItem key={item._id} value={item.name} style={{}}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            autoFocus
            margin="dense"
            id="lectures"
            label="Lectures"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="number"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={lectures}
            onChange={(e) => setLectures(e.target.value)}
            style={{marginTop: 20}}
          />
          <TextField
            autoFocus
            margin="dense"
            id="enrolled"
            label="Enrolled"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="number"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={enrolled}
            onChange={(e) => setEnrolled(e.target.value)}
            style={{marginTop: 20}}
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
