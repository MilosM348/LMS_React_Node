import React, {useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography,
  Menu
} from '@material-ui/core'
import {Menu as MenuIcon} from '@material-ui/icons'

import {useSetting} from '../../provider/setting'
import {useAsync} from '../../service/utils'
import {signout} from '../../api/auth'
import {setCookie} from '../../service/cookie'

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
  }
}));

export default function Nav() {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const [, dispatch] = useSetting()
  const history = useHistory()
  const classes = useStyles();

  useEffect(() => {
    if (status === 'resolved') {
      dispatch({type: 'SET', settingName: 'auth', settingData: null})
      setCookie('auth', '', 0)
      history.push('/login')
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [status])
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                Home
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