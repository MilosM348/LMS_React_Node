import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography,
} from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'

import { useSetting } from '../../provider/setting'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    textTransform: 'none',
    marginRight: 15,
    color: 'white',
    fontSize: 15,
  }
}));

export default function Nav() {
  const classes = useStyles()
  const [setting] = useSetting()
  const [user, setUser] = useState({})

  useEffect(() => {
    if (setting?.auth) {
      setUser(setting?.auth)
    }
  }, [setting?.auth])
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link to="/company" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                Dashboard
              </Button>
            </Link>
            <Link to="/company/assignment" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                Assignment
              </Button>
            </Link>
            {user?.role === 'company' &&
              <Link to="/company/team" style={{textDecoration: 'none'}}>
                <Button className={classes.button} color="inherit">
                  Teams
                </Button>
              </Link>
            }
            {/* <Link to="/company/videoGroup" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                Video Group
              </Button>
            </Link>
            <Link to="/company/group" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                Group
              </Button>
            </Link> */}
            <Link to="/company/subject" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                Subject
              </Button>
            </Link>
            <Link to="/company/instructor" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                Instructor
              </Button>
            </Link>
            <Link to="/company/learner" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                Learner
              </Button>
            </Link>
            <Link to="/company/replit" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                Replit
              </Button>
            </Link>
          </Typography>
          <a href="/logout" style={{ textDecoration: 'none' }}>
            <Button className={classes.button} color="inherit">
              Logout
            </Button>
          </a>
        </Toolbar>
      </AppBar>
    </div>
  )
}