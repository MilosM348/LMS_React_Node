import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
} from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'
import {
  getFilter as getNotifications,
} from "../../api/notification";
import { useSetting } from '../../provider/setting'
import { useAsync } from '../../service/utils'

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
  const { data, status, error, run } = useAsync({
    status: "idle",
  });
  const [setting] = useSetting()
  const classes = useStyles()
  const [comment, setComment] = useState(null);
  const [notification, setNotification] = useState([])

  const handleClick = (event) => {
    setComment(event.currentTarget);
  }
  const handleClose = () => {
    setComment(null);
  }

  useEffect(() => {
    run(getNotifications({ companyID: setting?.auth?.companyID, state: 'pending' }));
  }, [run, setting.auth]);
  useEffect(() => {
    if (status === 'resolved') {
      setNotification(data);
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  })
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link to="/teacher/assignment" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                Assignment
              </Button>
            </Link>
            <Link to="/teacher/student" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                Student
              </Button>
            </Link>
            <Button className={classes.button} color="inherit" onClick={handleClick}>
              Comment
            </Button>
            <Menu
              anchorEl={comment}
              keepMounted
              open={Boolean(comment)}
              onClose={handleClose}
            >
              <Link to="/teacher/comment" style={{textDecoration: 'none'}}>
                <MenuItem onClick={handleClose}>New Comment</MenuItem>
              </Link>
              <Link to="/teacher/comment/all" style={{textDecoration: 'none'}}>
                <MenuItem onClick={handleClose}>All Comments</MenuItem>
              </Link>
            </Menu>
            <Link to="/teacher/message" style={{ textDecoration: 'none' }}>
              <Button className={classes.button} color="inherit">
                Message
              </Button>
            </Link>
            <Link to="/teacher/notification" style={{ textDecoration: 'none' }}>
              <Button className={classes.button} color="inherit">
                <Badge badgeContent={notification.length} color="error">
                  Notification
                </Badge>
              </Button>
            </Link>
            <Link to="/teacher/exampool" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                ExamPool
              </Button>
            </Link>
            <Link to="/teacher/newsletter" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                NewsLetter
              </Button>
            </Link>
            <Link to="/teacher/payment" style={{textDecoration: 'none'}}>
              <Button className={classes.button} color="inherit">
                Payment
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