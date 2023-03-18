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
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {Edit} from '@material-ui/icons'
import {NotificationManager} from 'react-notifications'

import {useAsync} from '../../../../service/utils'
import {isNumeric} from '../../../../service/string'
import {update} from '../../../../api/price'
import {getAll as getAssignments} from '../../../../api/assignment'
import {replace as replaceGroup} from '../../../../api/partGroup'

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
const EditDialog = (props) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles()
  const {item, refresh} = props
  const [modalActive, setModalActive] = useState(false)
  const [type, setType] = useState('assignment')
  const [types, setTypes] = useState(['assignment', 'part', 'group'])
  const [assignment, setAssignment] = useState(0)
  const [part, setPart] = useState('')
  const [price, setPrice] = useState('')
  const [groupId, setGroupId] = useState('')
  const [selectParts, setSelectParts] = useState([])
  const [assignments, setAssignments] = useState([])
  const [parts, setParts] = useState([])
  const [index, setIndex] = useState(0)
  const [asyncState, setAsyncState] = useState('')
  const [pending, setPending] = useState(false)

  const handleClickOpen = () => {
    setType(item.type)
    setPrice(item.price)
    setModalActive(true)
    assignments.map((assignment, index) => {
      if (assignment.id === item?.assignment?.id) {
        setAssignment(index)
        setParts(assignment.parts)
      }
    })
    if (item.type === 'part') {
      setPart(item?.part?.id)
    }
    else if  (item.type === 'group') {
      let tmp = item?.parts?.map((item) => item?.part)
      setSelectParts(tmp)
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
    if (type === 'part') {
      sourceId = part
    }
    if (assignments.length === 0)
      return
    run(update({
      id: item?.id,
      price: price,
      type: type,
      assignmentID: assignments[assignment].id,
      sourceID: sourceId,
    }))
    setAsyncState('update')
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
        setAsyncState('')
      }
      else if (asyncState === 'update') {
        if (type === 'group') {
          run(replaceGroup(item?.id, selectParts))
          setAsyncState('replaceGroup')
        }
        else {
          setPending(false)
          setAsyncState('')
          refresh()
          setModalActive(false)
        }
      }
      else if (asyncState === 'replaceGroup') {
        setPending(false)
        setAsyncState('')
        refresh()
        setModalActive(false)
      }
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false)
    }
  }, [status, run])
  return (
    <>
      <IconButton aria-label="edit" onClick={handleClickOpen}>
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
        <DialogTitle id="form-dialog-title">Update Price</DialogTitle>
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
              <MenuItem key={item.id} value={index}>
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
export default EditDialog
