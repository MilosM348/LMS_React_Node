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
import {remove, getFilter, update} from '../../../../api/part'
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
  const {part, maxPart, refresh} = props
  const classes = useStyles()
  const [pending, setPending] = useState(false)
  const [endPart, setEndPart] = useState({})
  const [acitiveConfirm, setActiveConfirm] = useState(false)
  const [asyncState, setAsyncState] = useState('')

  const handleDelete = () => {
    setActiveConfirm(true)
  }
  const deleteConfirm = (res) => {
    setActiveConfirm(false)
    if (res) {
      if (part.levelLength === 0) {
        run(remove(part._id))
        setPending(true)
        setAsyncState('remove')
      }
      else {
        NotificationManager.warning('First Plese delete levels in this', 'Error', 3000);
      }
    }
  }

  useEffect(() => {
    run(getFilter({name: {eq: maxPart}, assignmentID: {eq: part.assignmentID}}))
    setAsyncState('get')
  }, [maxPart, part])
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'get') {
        if (data.length !== 0)
          setEndPart(data[0])
        setAsyncState('')
      }
      else if (asyncState === 'remove') {
        if (part.name === maxPart) {
          refresh()
          setAsyncState('')
        }
        else {
          let tmp = {}
          tmp._id = endPart._id
          tmp.name = part.name
          run(update(tmp))
          setAsyncState('update')
        }
      }
      else if (asyncState === 'update') {
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
