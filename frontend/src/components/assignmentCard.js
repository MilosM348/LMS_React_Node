import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Link} from 'react-router-dom'
// import clsx from 'clsx';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
} from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import {Favorite, PlayArrow} from '@material-ui/icons'
import {getUrl} from '../api/file'
import {useAsync} from '../service/utils'
import {addAssignment} from '../api/student'
import {update} from '../api/user'
import {useSetting} from '../provider/setting'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function AssignmentCard(props) {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const {assignment, favorite} = props
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [src, setSrc] = useState('')
  const [asyncState, setAsyncState] = useState('')
  const [setting, dispatch] = useSetting()
  const [assignmentState, setAssignmentState] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  const handleFavorite = () => {
    console.log(assignment)
    if (assignment.levels.length === 0)
      return
    if (assignment.state === 'complete' || assignment.state === 'ongoing')
      return
    const levels = assignment.levels.filter((item) => item.name === 1)
    run(addAssignment({
      assignmentID: assignment.id,
      studentID: setting.auth.id,
      levelID: levels[0].id,
      levelState: 'ongoing',
      state: 'ongoing',
    }))
    setAsyncState('addAssignment')
  }
  const handleStart = () => {

  }

  useEffect(() => {
    run(getUrl(assignment.image))
    setAsyncState('getImage')
    setAssignmentState(assignment.state)
  }, [run, assignment])
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'getImage')
        setSrc(data)
      else if (asyncState === 'addAssignment') {
        if (data.message === 'success') {
          setAssignmentState('ongoing')
          let user = {}
          user.id = setting.auth.id
          user.name = setting.auth.name
          user.email = setting.auth.email
          user.avatar = setting.auth.avatar
          user.role = setting.auth.role
          user.helpline = 10
          update(user)
        }
      }
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [status])
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {assignment.levelLength}
          </Avatar>
        }
        title={
          <div>{assignment.name}</div>
        }
      />
      <CardMedia
        className={classes.media}
        image={src}
        title={assignment.name}
      />
      <CardContent>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={handleFavorite} style={{float: 'left'}}>
          {assignmentState==='complete'||assignmentState==='ongoing' ?
            <Favorite color="primary" />:
            <Favorite />
          }
        </IconButton>
        {assignmentState==='ongoing' &&
          <Link to={`/detail/${assignment.id}`} style={{textDecoration: 'none'}}>
            <IconButton aria-label="add to favorites" onClick={handleStart}>
              <PlayArrow/>
            </IconButton>
          </Link>
        }
      </CardActions>
    </Card>
  );
}