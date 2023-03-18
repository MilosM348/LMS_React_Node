import React, {useState, useEffect} from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  IconButton,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import {Edit} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import {useAsync} from '../../../service/utils'
import {getFilter as getAssignments} from '../../../api/assignment'
import {getByAssignmetId as getParts} from '../../../api/part'
import { removeWithStudent, addAssignment, setLevel } from '../../../api/student'
import { useSetting } from '../../../provider/setting'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    textTransform: 'none',
    fontSize: 15,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))
const ChangeDialog = (props) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles();
  const [setting] = useSetting()
  const {refresh, item} = props
  const [modalActive, setModalActive] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [assignmentId, setAssignmentId] = useState('')
  const [partId, setPartId] = useState('')
  const [levelId, setLevelId] = useState('')
  const [assignments, setAssignments] = useState([])
  const [parts, setParts] = useState([])
  const [levels, setLevels] = useState([])
  const [pending, setPending] = useState(false)
  const [asyncState, setAsyncState] = useState('')

  const handleClickOpen = () => {
    setStudentId(item?._id)
    setAssignmentId(item?.assignment?._id)
    setPartId(item?.assignment?.part?._id)
    setLevelId(item?.assignment?.level?._id)
    run(getAssignments({ownerID: setting?.auth?._id}))
    setAsyncState('getAssignments')
    setModalActive(true)
    setPending(true)
  }
  const handleClose = () => {
    setModalActive(false)
  }
  const handleSave = () => {
    if (assignmentId === item.assignment._id) {
      if (levelId === item.assignment.level._id)
        return
      run(setLevel(assignmentId, studentId, levelId))
      setAsyncState('submit')
    }
    else {
      run(removeWithStudent(studentId, item.assignment._id))
      setAsyncState('remove')
    }
    setPending(true)
  }
  const handleChangeAssignment = (e) => {
    const tmp = e.target.value
    setAssignmentId(tmp)
    run(getParts(tmp))
    setAsyncState('changeAssignment')
    setPending(true)
  }
  const handleChangePart = (e) => {
    const tmp = e.target.value
    setPartId(tmp)
    const partTmp = parts.filter((item) => item._id === tmp)
    if (partTmp.length !== 0) {
      const levelsTmp = partTmp[0].levels
      setLevels(levelsTmp)
      const levelTmp = levelsTmp.filter((item) => item.name === 1)
      if (levelTmp.length !== 0)
        setLevelId(levelTmp[0]._id)
    }
  }

  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'getAssignments') {
        setAssignments(data)
        run(getParts(assignmentId))
        setAsyncState('getParts')
      }
      else if (asyncState === 'getParts') {
        setParts(data)
        let tmp = data.filter((item) => item._id === partId)
        if (tmp.length !== 0)
          setLevels(tmp[0].levels)
        setPending(false)
        setAsyncState('')
      }
      else if (asyncState === 'changeAssignment') {
        setParts(data)
        const partTmp = data.filter((item) => item.name === 1)
        console.log(partTmp)
        if (partTmp.length !== 0) {
          setPartId(partTmp[0]._id)
          setLevels(partTmp[0].levels)
          const levelTmp = partTmp[0].levels.filter((item) => item.name === 1)
          console.log(levelTmp)
          if (levelTmp.length !== 0)
            setLevelId(levelTmp[0]._id)
        }
        setPending(false)
        setAsyncState('')
      }
      else if (asyncState === 'submit') {
        console.log(data)
        setPending(false)
        setModalActive(false) 
        refresh()
        setAsyncState('')
      }
      else if (asyncState === 'remove') {
        run(addAssignment({
          assignmentID: assignmentId,
          studentID: studentId,
          levelID: levelId,
          levelState: 'ongoing',
          state: 'ongoing',
        }))
        setAsyncState('submit')
      }
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false)
    }
  }, [status])
  return (
    <>
      <IconButton aria-label="detail" onClick={handleClickOpen}>
        <Edit />
      </IconButton>
      <Backdrop className={classes.backdrop} open={pending} style={{zIndex: 9999}}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Dialog 
        disableBackdropClick
        disableEscapeKeyDown
        open={modalActive} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle id="form-dialog-title">Edit Student Assignment</DialogTitle>
        <DialogContent>
          <div>Assignment</div>
          <Select
            style={{width: '100%', textAlign: 'center', marginBottom: 10}}
            value={assignmentId}
            label="Assignment"
            onChange={handleChangeAssignment}
            MenuProps={MenuProps}
          >
            {assignments.map((item) => (
              <MenuItem key={item._id} value={item._id} style={{}}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          <div>Part</div>
          <Select
            style={{width: '100%', textAlign: 'center', marginBottom: 10}}
            value={partId}
            label="Part"
            onChange={handleChangePart}
            MenuProps={MenuProps}
          >
            {parts.map((item) => (
              <MenuItem key={item._id} value={item._id} style={{}}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          <div>Level</div>
          <Select
            style={{width: '100%', textAlign: 'center', marginBottom: 10}}
            value={levelId}
            label="Level"
            onChange={(e) => setLevelId(e.target.value)}
            MenuProps={MenuProps}
          >
            {levels.map((item) => (
              <MenuItem key={item._id} value={item._id} style={{}}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button className={classes.button} onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button className={classes.button} onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default ChangeDialog
