import React, {useEffect, useState} from 'react'
import {
  Paper,
  Grid,
  TextField,
  Button,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import {useAsync} from '../../../service/utils'
import {create, update, getAll} from '../../../api/settingAboutus'
import FileUpload from '../../../components/fileUpload'
import {upload} from '../../../api/file'
import {getRandomString, getFileExtension} from '../../../service/string'
import AmplifyImage from '../../../components/amplifyImage'
import AmplifyVideo from '../../../components/amplifyVideo'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: '18px',
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
const Aboutus = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles()
  const [setting, setSetting] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [companyNumber, setCompanyNumber] = useState(0)
  const [countryNumber, setCountryNumber] = useState(0)
  const [studentNumber, setStudentNumber] = useState(0)
  const [challengeNumber, setChallengeNumber] = useState(0)
  const [imageName, setImageName] = useState('')
  const [videoName, setVideoName] = useState('')
  const [image, setImage] = useState(null)
  const [video, setVideo] = useState(null)
  const [asyncState, setAsyncState] = useState('')
  const [pending, setPending] = useState(false)

  const handleSave = async () => {
    let tmp = {}
    if (image) {
      let result = await upload(image)
      tmp.image = result.url
    }
    if (video) {
      let result = await upload(video)
      tmp.video = result.url
    }
    if (!setting) {
      run(create({
        title: title,
        description: description,
        companyNumber: companyNumber,
        countryNumber: countryNumber,
        studentNumber: studentNumber,
        challengeNumber: challengeNumber,
        image: tmp.image,
        video: tmp.video,
      }))
    }
    else {
      tmp._id = setting._id
      tmp.description = description
      tmp.companyNumber = companyNumber
      tmp.countryNumber = countryNumber
      tmp.studentNumber = studentNumber
      tmp.challengeNumber = challengeNumber
      run(update(tmp))
    }
    setAsyncState('create')
    setPending(true)
    
  }
  const changeFile = (file, select) => {
    if (select === 'image')
      setImage(file)
    else if (select === 'video')
      setVideo(file)
  }

  useEffect(() => {
    run(getAll())
    setAsyncState('getAll')
  }, [run])
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'getAll') {
        if (data.length !== 0) {
          setSetting(data[0])
          setTitle(data[0]?.title)
          setDescription(data[0]?.description)
          setCompanyNumber(data[0]?.companyNumber)
          setCountryNumber(data[0]?.countryNumber)
          setStudentNumber(data[0]?.studentNumber)
          setChallengeNumber(data[0]?.challengeNumber)
          setImageName(data[0]?.image)
          setVideoName(data[0]?.video)
        }
        setAsyncState('')
      }
      else if (asyncState === 'create') {
        run(getAll())
        setAsyncState('getAll')
        setPending(false)
      }
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false)
    }
  }, [status])
  return (
    <Paper className={classes.root}>
      <div className={classes.title}>Aboutus Setting</div>
      <Backdrop className={classes.backdrop} open={pending} style={{zIndex: 9999}}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Grid container spacing={3}>
        <Grid item sm={6} xs={12}>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            autoComplete="off"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{marginTop: 20}}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
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
            style={{marginTop: 20}}
          />
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <TextField
            autoFocus
            margin="dense"
            id="companyNumber"
            label="CompanyNumber"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="number"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={companyNumber}
            onChange={(e) => setCompanyNumber(e.target.value)}
            style={{marginTop: 20}}
          />
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <TextField
            autoFocus
            margin="dense"
            id="countryNumber"
            label="CountryNumber"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="number"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={countryNumber}
            onChange={(e) => setCountryNumber(e.target.value)}
            style={{marginTop: 20}}
          />
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
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
        </Grid>
        <Grid item lg={3} sm={6} xs={12}>
          <TextField
            autoFocus
            margin="dense"
            id="challengeNumber"
            label="ChallengeNumber"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="number"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={challengeNumber}
            onChange={(e) => setChallengeNumber(e.target.value)}
            style={{marginTop: 20}}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <FileUpload label={'Choose Image'} changeFile={(file) => changeFile(file, 'image')} />
        </Grid>
        <Grid item sm={6} xs={12}>
          <FileUpload label={'Choose Video'} changeFile={(file) => changeFile(file, 'video')} />
        </Grid>
        <Grid item sm={6} xs={12}>
          <img src={imageName} style={{height: 200}} />
        </Grid>
        <Grid item sm={6} xs={12}>
          <video src={videoName} style={{height: 200}} controls />
        </Grid>
      </Grid>
      <div style={{height: 50}}>
        <Button className={classes.button} onClick={handleSave} style={{marginTop: 15, float: 'right'}} variant="outlined">
          Save
        </Button>
      </div>
    </Paper>
  )
}

export default Aboutus