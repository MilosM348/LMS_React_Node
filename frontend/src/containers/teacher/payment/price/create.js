import React, {useState, useEffect} from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {NotificationManager} from 'react-notifications'

import {useAsync} from '../../../../service/utils'
import {isNumeric} from '../../../../service/string'
import {create} from '../../../../api/price'
import {getAll as getAssignments} from '../../../../api/assignment'
import {attach as attachGroup} from '../../../../api/partGroup'

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
const CreateDialog = (props) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles()
  const {refresh} = props
  const [modalActive, setModalActive] = useState(false)
  const [type, setType] = useState('assignment')
  const [types, setTypes] = useState(['assignment', 'part', 'group'])
  const [assignment, setAssignment] = useState(0)
  const [part, setPart] = useState('')
  const [price, setPrice] = useState('')
  const [selectParts, setSelectParts] = useState([])
  const [assignments, setAssignments] = useState([])
  const [parts, setParts] = useState([])
  const [asyncState, setAsyncState] = useState('')
  const [pending, setPending] = useState(false)

  const handleClickOpen = () => {
    setType('assignment')
    setPart('')
    setPrice('')
    setSelectParts([])
    setModalActive(true)
    setAssignment(0)
    if (assignments.length !== 0) {
      setParts(assignments[0].parts)
      setPart(assignments[0].parts[0].id)
    }
  }
  const handleClose = () => {
    setModalActive(false)
  }
  const indexOf = (array, value) => {
    let res = -1
    array.forEach((item, index) => {
      if (item.id === value.id)
        res = index
    })
    return res
  }
  const handleToggle = (value) => () => {
    const currentIndex = indexOf(selectParts, value);
    const newSelects = [...selectParts];

    if (currentIndex === -1) {
      newSelects.push(value);
    } else {
      newSelects.splice(currentIndex, 1);
    }

    setSelectParts(newSelects);
  }
  const handleChangeAssignment = (e) => {
    const i = e.target.value
    setAssignment(i)
    setParts(assignments[i].parts)
    if (assignments[i].parts.length !== 0)
      setPart(assignments[i].parts[0].id)
  }
  const validate = () => {
    let res = true
    if (price === '' || !isNumeric(price))
      res = false
    if (type === 'group' && selectParts.length === 0)
      res = false
    if (!res)
      NotificationManager.warning('Please input required fields', 'Worning', 3000);
    return res
  }
  const handleSave = () => {
    if (!validate())
      return
    let sourceId = ''
    if (type === 'part')
      sourceId = part
    if (assignments.length === 0)
      return
    run(create({
      price: price,
      type: type,
      assignmentID: assignments[assignment].id,
      sourceID: sourceId,
    }))
    setAsyncState('create')
    setPending(true)
  }

  useEffect(() => {
    run(getAssignments())
    setAsyncState('getAssignments')
  }, [run])
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'getAssignments') {
        if (data.length !== 0) {
          setAssignments(data)
          setAssignment(0)
          setParts(data[0].parts)
          if (data[0].parts.length !== 0)
            setPart(data[0].parts[0].id)
        }
      }
      else if (asyncState === 'create') {
        if (type === 'group') {
          const id = data.id
          run(attachGroup(id, selectParts))
          setAsyncState('createGroup')
        }
        else {
          setPending(false)
          setModalActive(false) 
          refresh()
          setAsyncState('')
        }
      }
      else if (asyncState === 'createGroup') {
        setPending(false)
        setModalActive(false)
        refresh()
        setAsyncState('')
      }
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false)
    }
  }, [run, status, data, error])
  return (
    <>
      <Button className={classes.button} style={{marginBottom: 10, float: 'right'}} variant="outlined" onClick={handleClickOpen}>Add Price</Button>
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
        <DialogTitle id="form-dialog-title">Add Price</DialogTitle>
        <DialogContent>
          <DialogContentText>
            please input data
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="price"
            label="Price"
            inputProps={{min: 0, style: { fontSize: 20, paddingTop: 10, paddingBottom: 10 }}}
            type="text"
            fullWidth
            variant="outlined"
            autoComplete="off"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{marginTop: 20, marginBottom: 20}}
          />
          <Select
            style={{width: '100%', textAlign: 'center', marginBottom: 10}}
            value={type}
            label="Type"
            onChange={(e) => setType(e.target.value)}
            MenuProps={MenuProps}
          >
            {types.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
          <Select
            style={{width: '100%', textAlign: 'center', marginBottom: 10}}
            value={assignment}
            label="Part"
            onChange={handleChangeAssignment}
            MenuProps={MenuProps}
          >
            {assignments.map((item, index) => (
              <MenuItem key={item._id} value={index}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          {type === 'part' &&
            <Select
              style={{width: '100%', textAlign: 'center', marginBottom: 10}}
              value={part}
              label="Part"
              onChange={(e) => setPart(e.target.value)}
              MenuProps={MenuProps}
            >
              {parts.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {`part ${item.name}`}
                </MenuItem>
              ))}
            </Select>
          }
          {type === 'group' &&
          <>
            <List dense className={classes.root}>
              {parts.map((value) => {
                const labelId = `checkbox-list-secondary-label-${value.id}`;
                return (
                  <ListItem key={value.id} button>
                    <ListItemText id={labelId} primary={`part ${value.name}`} />
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        onChange={handleToggle(value)}
                        checked={indexOf(selectParts, value) !== -1}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </>
          }
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
export default CreateDialog
