import React, {useEffect, useState} from 'react'
import {
  IconButton,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {Delete as DeleteIcon} from '@material-ui/icons'

import {useAsync} from '../../../../service/utils'
import {remove, getFilter, update} from '../../../../api/exam'
import {update as updateLevel} from '../../../../api/level'
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
  const {item, level, refresh} = props
  const classes = useStyles()
  const [pending, setPending] = useState(false)
  const [endExam, setEndExam] = useState({})
  const [acitiveConfirm, setActiveConfirm] = useState(false)
  const [asyncState, setAsyncState] = useState('')

  const handleDelete = () => {
    setActiveConfirm(true)
  }
  const deleteConfirm = (res) => {
    setActiveConfirm(false)
    if (res) {
      run(remove(item._id))
      setPending(true)
      setAsyncState('remove')
    }
  }

  useEffect(() => {
    if (level.examLength) {
      run(getFilter({name: {eq: level.examLength}, levelID: {eq: item.levelID}}))
      setAsyncState('get')
    }
  }, [level, item])
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'get') {
        if (data.length !== 0)
          setEndExam(data[0])
        setAsyncState('')
      }
      else if (asyncState === 'remove') {
        if (item.name === level.examLength) {
          let tmp = {}
          tmp._id = level._id
          tmp.examLength = level.examLength - 1
          run(updateLevel(tmp))
          setAsyncState('updateLevel')
        }
        else {
          let tmp = {}
          tmp._id = endExam._id
          tmp.name = item.name
          run(update(tmp))
          setAsyncState('update')
        }
      }
      else if (asyncState === 'update') {
        let tmp = {}
        tmp._id = level._id
        tmp.examLength = level.examLength - 1
        run(updateLevel(tmp))
        setAsyncState('updateLevel')
      }
      else if (asyncState === 'updateLevel') {
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
