import React, {useEffect, useState} from 'react'
import {
  Paper,
  Grid,
  TextField,
  Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import {useAsync} from '../../../service/utils'
import {create, update, getAll} from '../../../api/commonSetting'

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
const Common = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles()
  const [setting, setSetting] = useState(null)
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [facebook, setFacebook] = useState('')
  const [twitter, setTwitter] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [instagram, setInstagram] = useState('')
  const [youtube, setYoutube] = useState('')
  const [pinterest, setPinterest] = useState('')
  const [asyncState, setAsyncState] = useState('')

  const handleSave = () => {
    if (!setting) {
      run(create({
        location: location,
        phone: phone,
        email: email,
        facebook: facebook,
        twitter: twitter,
        linkedin: linkedin,
        instagram: instagram,
        youtube: youtube,
        pinterest: pinterest,
      }))
      setAsyncState('create')
    }
    else {
      run(update({
        id: setting?.id,
        location: location,
        phone: phone,
        email: email,
        facebook: facebook,
        twitter: twitter,
        linkedin: linkedin,
        instagram: instagram,
        youtube: youtube,
        pinterest: pinterest,
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
          setLocation(data[0]?.location)
          setPhone(data[0]?.phone)
          setEmail(data[0]?.email)
          setFacebook(data[0]?.facebook)
          setTwitter(data[0]?.twitter)
          setLinkedin(data[0]?.linkedin)
          setInstagram(data[0]?.instagram)
          setYoutube(data[0]?.youtube)
          setPinterest(data[0]?.pinterest)
        }
      }
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [status])
  return (
    <Paper className={classes.root}>
      <div className={classes.title}>Common Setting</div>
      <Grid container spacing={3}>
          <Grid item lg={4} sm={6} xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="location"
              label="Location"
              inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
              type="text"
              fullWidth
              variant="outlined"
              autoComplete="off"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{marginTop: 20}}
            />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="phone"
              label="Phone"
              inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
              type="text"
              fullWidth
              variant="outlined"
              autoComplete="off"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{marginTop: 20}}
            />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Email"
              inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
              type="text"
              fullWidth
              variant="outlined"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{marginTop: 20}}
            />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
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
              style={{marginTop: 20}}
            />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
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
              style={{marginTop: 20}}
            />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="linkedin"
              label="Linkedin"
              inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
              type="text"
              fullWidth
              variant="outlined"
              autoComplete="off"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              style={{marginTop: 20}}
            />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="instagram"
              label="Instagram"
              inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
              type="text"
              fullWidth
              variant="outlined"
              autoComplete="off"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              style={{marginTop: 20}}
            />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
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
              style={{marginTop: 20}}
            />
          </Grid>
          <Grid item lg={4} sm={6} xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="pinterest"
              label="Pinterest"
              inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
              type="text"
              fullWidth
              variant="outlined"
              autoComplete="off"
              value={pinterest}
              onChange={(e) => setPinterest(e.target.value)}
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

export default Common