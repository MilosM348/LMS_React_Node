import React, {useEffect, useState} from 'react'
import {
  IconButton,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {Delete as DeleteIcon} from '@material-ui/icons'
import {NotificationManager} from 'react-notifications'

import {useAsync} from '../../../../service/utils'
import {remove, getFilter, update} from '../../../../api/level'
import {update as updatePart} from '../../../../api/part'
import {getStudentsByLevelId} from '../../../../api/student'
import DeleteConfirm from '../../../../components/DeleteConfirm'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))
const Delete = (props) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const {level, part, refresh} = props
  const classes = useStyles()
  const [pending, setPending] = useState(false)
  const [endLevel, setEndLevel] = useState({})
  const [acitiveConfirm, setActiveConfirm] = useState(false)
  const [asyncState, setAsyncState] = useState('')

  const handleDelete = () => {
    setActiveConfirm(true)
  }
  const deleteConfirm = (res) => {
    setActiveConfirm(false)
    if (res) {
      if (level.programLength !== 0)
        NotificationManager.warning('First Plese delete programs in this', 'Worning', 3000);
      else if (level.examLength !== 0)
        NotificationManager.warning('First Plese delete exams in this', 'Worning', 3000);
      else {
        run(getStudentsByLevelId(level._id))
        setPending(true)
        setAsyncState('getStudents')
      }
    }
  }

  useEffect(() => {
    if (part.levelLength) {
      run(getFilter({name: {eq: part.levelLength}, partID: {eq: level.partID}}))
      setAsyncState('get')
    }
  }, [part, level])
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'get') {
        if (data.length !== 0)
          setEndLevel(data[0])
        setAsyncState('')
      }
      else if (asyncState === 'getStudents') {
        if (data.length === 0) {
          run(remove(level._id))
          setPending(true)
          setAsyncState('remove')
        }
        else {
          NotificationManager.warning('Now this level is using by students', 'Worning', 3000);
        }
      }
      else if (asyncState === 'remove') {
        if (level.name === part.levelLength) {
          let tmp = {}
          tmp._id = part._id
          tmp.levelLength = part.levelLength - 1
          run(updatePart(tmp))
          setAsyncState('updatePart')
        }
        else {
          let tmp = {}
          tmp._id = endLevel._id
          tmp.name = level.name
          run(update(tmp))
          setAsyncState('update')
        }
      }
      else if (asyncState === 'update') {
        let tmp = {}
        tmp._id = part._id
        tmp.levelLength = part.levelLength - 1
        run(updatePart(tmp))
        setAsyncState('updatePart')
      }
      else if (asyncState === 'updatePart') {
        console.log('end')
        refresh()
        setAsyncState('')
      }
      setPending(false)
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false)
    }
  }, [status, run])
  return (
    <>
      <DeleteConfirm open={acitiveConfirm} callback={deleteConfirm} />
      <IconButton aria-label="delete" onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
      <Backdrop className={classes.backdrop} open={pending} style={{zIndex: 9999}}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  )
}
export default Delete
