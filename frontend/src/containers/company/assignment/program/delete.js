import React, {useEffect, useState} from 'react'
import {
  IconButton,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {Delete as DeleteIcon} from '@material-ui/icons'

import {useAsync} from '../../../../service/utils'
import {remove, getFilter, update} from '../../../../api/program'
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
  const {program, level, refresh} = props
  const classes = useStyles()
  const [pending, setPending] = useState(false)
  const [endProgram, setEndProgram] = useState({})
  const [acitiveConfirm, setActiveConfirm] = useState(false)
  const [asyncState, setAsyncState] = useState('')

  const handleDelete = () => {
    setActiveConfirm(true)
  }
  const deleteConfirm = (res) => {
    setActiveConfirm(false)
    if (res) {
      run(remove(program._id))
      setPending(true)
      setAsyncState('remove')
    }
  }

  useEffect(() => {
    if (level.programLength) {
      run(getFilter({name: {eq: level.programLength}, levelID: {eq: program.levelID}}))
      setAsyncState('get')
    }
  }, [level, program])
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'get') {
        if (data.length !== 0)
          setEndProgram(data[0])
        setAsyncState('')
      }
      else if (asyncState === 'remove') {
        if (program.name === level.programLength) {
          let tmp = {}
          tmp._id = level._id
          tmp.programLength = level.programLength - 1
          run(updateLevel(tmp))
          setAsyncState('updateLevel')
        }
        else {
          let tmp = {}
          tmp._id = endProgram._id
          tmp.name = program.name
          run(update(tmp))
          setAsyncState('update')
        }
      }
      else if (asyncState === 'update') {
        let tmp = {}
        tmp._id = level._id
        tmp.programLength = level.programLength - 1
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
