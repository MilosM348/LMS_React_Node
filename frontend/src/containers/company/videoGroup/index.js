import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Container,
  IconButton,
  Popover,
  Box,
  List,
  ListItem,
  ListItemText,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { Menu, Refresh } from "@material-ui/icons";
import {Link} from 'react-router-dom'

import Nav from '../../layout/nav_company'
import { getFilter as getVideoGroups } from '../../../api/videoGroup'
import { useAsync } from '../../../service/utils'
import { useSetting } from '../../../provider/setting'
import Create from './create'
import Edit from './edit'
import Delete from './delete'

const columns = [
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'image', label: 'Image', minWidth: 100 },
  { id: 'price', label: 'Price', minWidth: 50 },
  { id: 'ownerName', label: 'Owner', minWidth: 100 },
  { id: 'groupNum', label: 'Group', minWidth: 50 },
  { id: 'assignmentNum', label: 'Assignment', minWidth: 50 },
  {
    id: 'action',
    label: 'Action',
    minWidth: 170,
    align: 'center',
  },
]

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  button: {
    textTransform: 'none',
  },
  refresh: {
    float: 'right',
    marginRight: 30,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))
const Action = (props) => {
  const classes = useStyles()
  const {item, refresh} = props

  return (
    <PopupState variant="popover" popupId="demo-popup-popover">
      {(popupState) => (
        <div>
          <IconButton aria-label="action" {...bindTrigger(popupState)}>
            <Menu className={classes.icon} />
          </IconButton>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box p={2}>
              <List dense={true}>
                <ListItem>
                  <Delete item={item} refresh={refresh}>
                    <ListItemText
                      primary="Delete"
                      style={{color: '#E54C4C'}}
                    />
                  </Delete>
                </ListItem>
                <ListItem>
                  <Edit item={item} refresh={refresh}>
                    <ListItemText
                      primary="Edit"
                    />
                  </Edit>
                </ListItem>
                <ListItem>
                  <Link to={`/company/videoGroup/${item._id}/groups`} style={{textDecoration: 'none'}}>
                    <ListItemText
                      primary="Groups"
                      style={{color: 'black'}}
                    />
                  </Link>
                </ListItem>
                <ListItem>
                  <Link to={`/company/videoGroup/${item._id}/assignments`} style={{textDecoration: 'none'}}>
                    <ListItemText
                      primary="Assignments"
                      style={{color: 'black'}}
                    />
                  </Link>
                </ListItem>
                <ListItem>
                  <Link to={`/company/videoGroup/${item._id}/instructors`} style={{textDecoration: 'none'}}>
                    <ListItemText
                      primary="Instructors"
                      style={{color: 'black'}}
                    />
                  </Link>
                </ListItem>
              </List>
            </Box>
          </Popover>
        </div>
      )}
    </PopupState>
  )
}
const VideoGroup = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const [setting] = useSetting()
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [videoGroups, setVideoGroups] = useState([])
  const [asyncState, setAsyncState] = useState('')
  const [pending, setPending] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  const refresh = () => {
    run(getVideoGroups({ companyID: setting?.auth?.companyID }));
    setAsyncState("getVideoGroups");
    setPending(true)
  }

  useEffect(() => {
    if (setting?.auth) {
      run(getVideoGroups({ companyID: setting?.auth?.companyID }));
      setAsyncState('getVideoGroups')
      setPending(true)
    }
  }, [run, setting?.auth]);
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === "getVideoGroups") {
        let _videoGroups = data.map((item) => {
          item.ownerName = item?.owner?.name;
          if (item?.groupIDs) item.groupNum = item?.groupIDs?.length;
          else item.groupNum = 0;
          if (item?.assignmentIDs) item.assignmentNum = item?.assignmentIDs?.length
          else item.assignmentNum = 0;
          return item;
        });
        setVideoGroups(_videoGroups);
        setPending(false);
      } else if (asyncState === "update") {
        refresh()
        setPending(true);
      }
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false)
    }
  }, [status])
  return (
    <>
      <Nav />
      <Backdrop className={classes.backdrop} open={pending}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Container maxWidth="lg">
        <h2 style={{textAlign: 'center', padding: 50}}>VideoGroup Manage</h2>
        <Create refresh={refresh} />
        <IconButton className={classes.refresh} aria-label="detail" onClick={refresh}>
          <Refresh />
        </IconButton>
        <Paper className={classes.root}>
          <TableContainer className={classes.container} style={{fontSize: 15}}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, fontSize: 15 }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {videoGroups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} style={{fontSize: 14}}>
                            {column.id === 'action'?
                              (
                                <Action item={row} refresh={refresh} />
                              ):
                              column.id === 'price'?
                              `$ ${value}`:
                              column.id === 'image'?
                              <img src={row.image} style={{height: 60}} />:
                              value
                            }
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={videoGroups.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </>
  )
}

export default VideoGroup
