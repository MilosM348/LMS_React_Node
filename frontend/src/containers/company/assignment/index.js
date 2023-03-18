import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TablePagination, 
  TableRow, 
  Container,
  IconButton,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import {RemoveRedEye, Favorite, Refresh} from '@material-ui/icons'
import {Link} from 'react-router-dom'

import Nav from '../../layout/nav_company'
import { getFilter as getAssignments, update } from '../../../api/assignment'
import { useAsync } from '../../../service/utils'
import { useSetting } from '../../../provider/setting'
import Subject from './subject/index'
import Create from './create'
import Edit from './edit'
import Delete from './delete'

const columns = [
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'image', label: 'Image', minWidth: 100 },
  { id: 'fee', label: 'Fee', minWidth: 50 },
  { id: 'owner', label: 'Owner', minWidth: 100 },
  { id: 'part', label: 'Part', minWidth: 50 },
  { id: 'activate', label: 'Publish', minWidth: 50 },
  // {
  //   id: 'action',
  //   label: 'Action',
  //   minWidth: 170,
  //   align: 'center',
  // },
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
const Assignment = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const [setting] = useSetting()
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [assignments, setAssignments] = useState([])
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
    run(getAssignments({ submit: true, companyID: setting?.auth?.companyID }));
    setAsyncState("getAssignments");
    setPending(true)
  }
  const handleActivate = (assignment, activate) => {
    let tmp = {}
    tmp._id = assignment._id
    tmp.activate = activate
    run(update(tmp))
    setAsyncState('update')
    setPending(true)
  }
  
  useEffect(() => {
    if (setting?.auth) {
      run(getAssignments({ submit: true, companyID: setting?.auth?.companyID }));
      setAsyncState('getAssignments')
      setPending(true)
    }
  }, [run, setting?.auth]);
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === "getAssignments") {
        let assignments = data.map((item) => {
          let res = item;
          res.owner = item?.owner?.name;
          if (item?.parts) res.part = item?.parts?.length;
          else res.part = 0;
          return res;
        });
        setAssignments(assignments);
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
        <h2 style={{textAlign: 'center', padding: 50}}>Assignment Manage</h2>
        {/* <Create refresh={refresh} /> */}
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
                {assignments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} style={{fontSize: 14}}>
                            {column.id === 'action'?
                              (
                                <>
                                  <Edit assignment={row} refresh={refresh} />
                                  <Delete assignment={row} refresh={refresh} />
                                  <Link to={`/company/assignment/${row._id}`} style={{textDecoration: 'none'}}>
                                    <IconButton aria-label="detail">
                                      <RemoveRedEye />
                                    </IconButton>
                                  </Link>
                                </>
                              ):
                              column.id === 'fee'?
                              `$ ${value}`:
                              column.id === 'image'?
                              <img src={row.image} style={{height: 60}} />:
                              column.id === 'activate'?
                              (row.activate?
                                (
                                  <IconButton aria-label="detail" onClick={(e) => handleActivate(row, false)}>
                                    <Favorite color={'primary'} />
                                  </IconButton>
                                ):
                                (
                                  <IconButton aria-label="detail" onClick={(e) => handleActivate(row, true)}>
                                    <Favorite />
                                  </IconButton>
                                )
                              ):
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
            count={assignments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
        {/* <Subject /> */}
      </Container>
    </>
  )
}

export default Assignment
