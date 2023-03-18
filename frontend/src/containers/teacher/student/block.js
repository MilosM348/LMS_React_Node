import React, {useState, useEffect} from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  IconButton,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import {Block} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import {useAsync} from '../../../service/utils'
import {getFilter as getAssignments} from '../../../api/assignment'
import { getBlockAssignments, attach, detach } from '../../../api/block'
import { useSetting } from '../../../provider/setting'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    maxHeight: 400,
    backgroundColor: theme.palette.background.paper,
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
const BlockDialog = (props) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles();
  const [setting] = useSetting()
  const {refresh, item} = props
  const [modalActive, setModalActive] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [assignments, setAssignments] = useState([])
  const [blocks, setBlocks] = useState([])
  const [pending, setPending] = useState(false)
  const [index, setIndex] = useState(0)
  const [asyncState, setAsyncState] = useState('')

  const handleClickOpen = () => {
    setStudentId(item?._id)
    run(getAssignments({ownerID: setting?.auth?._id}))
    setPending(true)
    setAsyncState('getAssignments')
    setModalActive(true)
    setIndex(0)
  }
  const handleClose = () => {
    setModalActive(false)
  }
  const indexOf = (array, value) => {
    let res = -1
    array.forEach((item, index) => {
      if (item._id === value._id)
        res = index
    })
    return res
  }
  const handleToggle = (value) => () => {
    const currentIndex = indexOf(blocks, value);
    const newBlocks = [...blocks];

    if (currentIndex === -1) {
      newBlocks.push(value);
    } else {
      newBlocks.splice(currentIndex, 1);
    }

    setBlocks(newBlocks);
  }
  const handleSave = () => {
    if (assignments.length ===0) {
      return
    }
    run(detach(studentId, assignments[0]._id))
    setIndex(1)
    setAsyncState('remove')
    setPending(true)
  }

  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'getAssignments') {
        setAssignments(data)
        run(getBlockAssignments(studentId))
        setAsyncState('getBlocks')
      }
      else if (asyncState === 'getBlocks') {
        setBlocks(data)
        setPending(false)
        setAsyncState('')
      }
      else if (asyncState === 'remove') {
        if (index < assignments.length) {
          run(detach(studentId, assignments[index]._id))
          setIndex(index + 1)
        }
        else if (index === assignments.length) {
          if (blocks.length === 0) {
            refresh()
            setModalActive(false)
            setPending(false)
            setAsyncState('')
          }
          else {
            run(attach(studentId, blocks[0]._id))
            setIndex(1)
            setAsyncState('add')
          }
        }
      }
      else if (asyncState === 'add') {
        if (index < blocks.length) {
          run(attach(studentId, blocks[index]._id))
          setIndex(index + 1)
        }
        else if (index === blocks.length) {
          refresh()
          setModalActive(false)
          setPending(false)
          setAsyncState('')
        }
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
        {item?.blockNumber > 0?
          <Block color="secondary" />:
          <Block />
        }
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
        <DialogTitle id="form-dialog-title">Assignment Block</DialogTitle>
        <DialogContent>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <List dense className={classes.root}>
              {assignments.map((value) => {
                const labelId = `checkbox-list-secondary-label-${value._id}`;
                return (
                  <ListItem key={value._id} button>
                    <ListItemText id={labelId} primary={value.name} />
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        onChange={handleToggle(value)}
                        checked={indexOf(blocks, value) !== -1}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
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
export default BlockDialog
