import React from 'react'
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

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link to="/admin" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                Dashboard
              </Button>
            </Link>
            {setting?.auth?.role === 'admin' &&
              <Link to="/admin/team" style={{textDecoration: 'none'}}>
                <Button className={classes.button} color="inherit">
                  Team
                </Button>
              </Link>
            }
            <Link to="/admin/company" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                Company
              </Button>
            </Link>
            <Link to="/admin/home-setting" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                Home Setting
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