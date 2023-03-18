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
import {Favorite, Refresh} from '@material-ui/icons'

import Nav from '../../layout/nav_company'
import { getStudents, update } from '../../../api/user'
import { useSetting } from '../../../provider/setting'
import { useAsync } from '../../../service/utils'
import Create from './create'

const columns = [
  { id: "email", label: "Email", minWidth: 100 },
  { id: "assignmentName", label: "Assignment", minWidth: 100 },
  { id: "partName", label: "Part", minWidth: 100 },
  { id: "levelName", label: "Level", minWidth: 100 },
  { id: "activate", label: "Active", minWidth: 50 },
  // {
  //   id: 'action',
  //   label: 'Action',
  //   minWidth: 170,
  //   align: 'center',
  // },
];

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
const Teacher = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const [setting] = useSetting()
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [students, setStudents] = useState([])
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
    run(getStudents(setting?.auth?.companyID))
    setAsyncState('getStudents')
    setPending(true)
  }
  const handleActivate = (teacher, activate) => {
    let tmp = {}
    tmp._id = teacher._id
    tmp.activate = activate
    run(update(tmp))
    setAsyncState('update')
    setPending(true)
  }
  
  useEffect(() => {
    if (setting?.auth) {
      run(getStudents(setting?.auth?.companyID));
      setAsyncState("getStudents");
      setPending(true);
    }
  }, [run]);
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'getStudents') {
        let students = data.map((item) => {
          let res = item
          res.assignmentName = item?.assignment?.name
          res.partName = item?.assignment?.part?.name
          res.levelName = item?.assignment?.level?.name
          return res
        })
        setStudents(students)
        setPending(false)
      }
      else if (asyncState === 'update') {
        refresh()
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
        <h2 style={{ textAlign: 'center', padding: 50 }}>Student Manage</h2>
        <Create refresh={refresh} companyId={setting?.auth?.companyID} />
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
                {students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} style={{fontSize: 14}}>
                            {column.id === 'activate'?
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
            count={students.length}
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

export default Teacher
