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
  Grid, 
  Container,
  IconButton,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import {Add, Remove} from '@material-ui/icons'

import Nav from '../../layout/nav_assignment'
import { getFilter as getAssignments } from '../../../api/assignment'
import {getStudents} from '../../../api/student'
import {update} from '../../../api/user'
import { useAsync } from '../../../service/utils'
import { useSetting } from '../../../provider/setting'
import Manage from './manage'

const columns = [
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'helpline', label: 'Helpline', minWidth: 50 },
  {
    id: 'action',
    label: 'Action',
    minWidth: 170,
    align: 'center',
  },
]
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
  container: {
    maxHeight: 440,
  },
  button: {
    textTransform: 'none',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))
const Student = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles()
  const [setting] = useSetting()
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [assignments, setAssignments] = useState([])
  const [assignment, setAssignment] = useState('')
  const [students, setStudents] = useState([])
  const [asyncState, setAsyncState] = useState('')
  const [pending, setPending] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangeAssignment = (event) => {
    const assignmentId = event.target.value
    setAssignment(assignmentId)
    run(getStudents(assignmentId))
    setAsyncState('getStudents')
    setPending(true)
  }
  const changeHelpline = (student, helpline) => {
    let tmp = {}
    tmp._id = student._id
    tmp.name = student.name
    tmp.email = student.email
    tmp.avatar = student.avatar
    tmp.role = student.role
    tmp.helpline = helpline
    run(update(tmp))
    setAsyncState('update')
    setPending(true)
  }

  useEffect(() => {
    if (setting?.auth) {
      run(getAssignments({ ownerID: setting?.auth?._id, companyID: setting?.auth?.companyID }));
      setAsyncState('getAssignments')
      setPending(true)
    }
  }, [run, setting?.auth]);
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'getAssignments') {
        console.log(data)
        setAssignments(data)
        if (data.length !== 0) {
          setAssignment(data[0]._id)
          run(getStudents(data[0]._id))
          setAsyncState('getStudents')
        }
        else {
          setPending(false)
          setAsyncState('')
        }
      }
      else if (asyncState === 'getStudents') {
        setStudents(data)
        setPending(false)
        setAsyncState("");
      }
      else if (asyncState === 'update') {
        run(getStudents(assignment))
        setAsyncState('getStudents')
        setPending(false)
      }
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false)
    }
  }, [run, status])

  return (
    <div>
      <Nav />
      <Backdrop className={classes.backdrop} open={pending}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Container maxWidth="lg">
        <h2 style={{ textAlign: "center", padding: 50 }}>Student Manage</h2>
        <Grid container spacing={3}>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Select
              style={{ width: "100%", textAlign: "center", marginBottom: 10 }}
              value={assignment}
              onChange={handleChangeAssignment}
              MenuProps={MenuProps}
            >
              {assignments.map((item) => (
                <MenuItem key={item._id} value={item._id} style={{}}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "action" ? (
                              <>
                                <IconButton
                                  aria-label="detail"
                                  onClick={(e) =>
                                    changeHelpline(row, row.helpline + 1)
                                  }
                                >
                                  <Add />
                                </IconButton>
                                <IconButton
                                  aria-label="detail"
                                  onClick={(e) =>
                                    changeHelpline(row, row.helpline - 1)
                                  }
                                >
                                  <Remove />
                                </IconButton>
                              </>
                            ) : (
                              value
                            )}
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
            count={students.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
        <Manage />
      </Container>
    </div>
  );
}

export default Student