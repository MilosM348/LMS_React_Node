import React, {useEffect, useState} from 'react'
import {
  Paper,
  Grid,
  TextField,
  Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import {useAsync} from '../../../service/utils'
import {create, update, getAll} from '../../../api/SettingiconBox'

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
}))
const IconBox = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles()
  const [setting, setSetting] = useState(null)
  const [firstTitle, setFirstTitle] = useState('')
  const [firstDescription, setFirstDescription] = useState('')
  const [secondTitle, setSecondTitle] = useState('')
  const [secondDescription, setSecondDescription] = useState('')
  const [thirdTitle, setThirdTitle] = useState('')
  const [thirdDescription, setThirdDescription] = useState('')
  const [asyncState, setAsyncState] = useState('')

  const handleSave = () => {
    if (!setting) {
      run(create({
        firstTitle: firstTitle,
        firstDescription: firstDescription,
        secondTitle: secondTitle,
        secondDescription: secondDescription,
        thirdTitle: thirdTitle,
        thirdDescription: thirdDescription,
      }))
      setAsyncState('create')
    }
    else {
      run(update({
        _id: setting?._id,
        firstTitle: firstTitle,
        firstDescription: firstDescription,
        secondTitle: secondTitle,
        secondDescription: secondDescription,
        thirdTitle: thirdTitle,
        thirdDescription: thirdDescription,
      }))
      setAsyncState('create')
    }
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
          setFirstTitle(data[0]?.firstTitle)
          setFirstDescription(data[0]?.firstDescription)
          setSecondTitle(data[0]?.secondTitle)
          setSecondDescription(data[0]?.secondDescription)
          setThirdTitle(data[0]?.thirdTitle)
          setThirdDescription(data[0]?.thirdDescription)
        }
      }
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [status])
  return (
    <Paper className={classes.root}>
      <div className={classes.title}>Icon Box</div>
      <Grid container spacing={3}>
          <Grid item lg={4} sm={6} xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="firstTitle"
              label="FirstTitle"
              inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              autoComplete="off"
              value={firstTitle}
              onChange={(e) => setFirstTitle(e.target.value)}
              style={{marginTop: 20}}
            />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="firstDescription"
              label="FirstDescription"
              inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              autoComplete="off"
              value={firstDescription}
              onChange={(e) => setFirstDescription(e.target.value)}
              style={{marginTop: 20}}
            />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="secondTitle"
              label="SecondTitle"
              inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              autoComplete="off"
              value={secondTitle}
              onChange={(e) => setSecondTitle(e.target.value)}
              style={{marginTop: 20}}
            />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="secondDescription"
              label="SecondDescription"
              inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              autoComplete="off"
              value={secondDescription}
              onChange={(e) => setSecondDescription(e.target.value)}
              style={{marginTop: 20}}
            />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="thirdTitle"
              label="ThirdTitle"
              inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              autoComplete="off"
              value={thirdTitle}
              onChange={(e) => setThirdTitle(e.target.value)}
              style={{marginTop: 20}}
            />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="thirdDescription"
              label="ThirdDescription"
              inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              autoComplete="off"
              value={thirdDescription}
              onChange={(e) => setThirdDescription(e.target.value)}
              style={{marginTop: 20}}
            />
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

export default IconBox