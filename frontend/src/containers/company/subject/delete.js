import React, {useEffect, useState} from 'react'
import {
  IconButton,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {Delete as DeleteIcon} from '@material-ui/icons'

import {useAsync} from '../../../service/utils'
import {remove} from '../../../api/subject'

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
  const {subject, refresh} = props
  const classes = useStyles()
  const [pending, setPending] = useState(false)

  const handleDelete = () => {
    run(remove(subject._id))
    setPending(true)
  }

  useEffect(() => {
    if (status === 'resolved') {
      refresh()
      setPending(false)
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false)
    }
  }, [status, run])
  return (
    <>
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
