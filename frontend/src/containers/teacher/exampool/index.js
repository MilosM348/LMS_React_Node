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
  Button,
  IconButton,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import {
  RemoveRedEye,
  Refresh
} from '@material-ui/icons'
import {Link} from 'react-router-dom'

import Nav from '../../layout/nav_assignment'
import {getFilter as getExamPools, update as updateExamPool} from '../../../api/exampool'
import {getFilter as getExams} from '../../../api/exam'
import {setState, setLevel} from '../../../api/student'
import { useAsync } from '../../../service/utils'
import { useSetting } from '../../../provider/setting'
import Delete from './delete'

const columns = [
  { id: 'assignment', label: 'Assignment', minWidth: 100 },
  { id: 'part', label: 'Part', minWidth: 50 },
  { id: 'level', label: 'Level', minWidth: 50 },
  { id: 'student', label: 'Student', minWidth: 100 },
  { id: 'time', label: 'Time', minWidth: 50 },
  {
    id: 'examDetail',
    label: 'Exam',
    minWidth: 50,
    align: 'center',
  },
  { id: 'state', label: 'State', minWidth: 50 },
  {
    id: 'action',
    label: 'Action',
    minWidth: 300,
    align: 'center',
  },
  { id: 'delete', label: 'Delete', minWidth: 50 },
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
    cursor: 'pointer',
    fontSize: 25,
    paddingBottom: 4,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))
const ExamPool = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const [setting] = useSetting()
  const classes = useStyles()
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [examPools, setExamPools] = useState([])
  const [examPool, setExamPool] = useState({})
  const [asyncState, setAsyncState] = useState('')
  const [pending, setPending] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleAccept = (item) => {
    const level = item.level
    const part = item.part
    const parts = item.parts
    const studentId = item.studentID
    const assignmentId = item.assignmentID
    if (part === parts.length && level === parts[part - 1].levels.length) {
      setState(assignmentId, studentId, 'completed', 'complete')
    }
    else {
      let new_level = []
      if (level < parts[part - 1].levels.length) {
        new_level = parts[part - 1].levels.filter((item) => item.name === level+1)
      }
      else if (level === parts[part - 1].levels.length && part < parts.length) {
        new_level = parts[part].levels.filter((item) => item.name === 1)
      }
      if (new_level.length === 0) {
        setState(assignmentId, studentId, 'completed', 'complete')
      }
      else
        setLevel(assignmentId, studentId, new_level[0]._id)
    }
    let tmp = {}
    tmp._id = item._id
    tmp.state = 'accept'
    run(updateExamPool(tmp))
    setAsyncState('update')
    setPending(true)
  }
  const handleReject = (item) => {
    setExamPool(item)
    run(getExams({levelID: item.levelID}))
    setAsyncState('getExams')
    setPending(true)
  }
  const refresh = () => {
    run(getExamPools({companyID: setting?.auth?.companyID}))
    setAsyncState('getExamPools')
    setPending(true)
  }

  useEffect(() => {
    run(getExamPools({companyID: setting?.auth?.companyID}))
    setAsyncState('getExamPools')
    setPending(true)
  }, [run])
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'getExamPools') {
        if (data.length !== 0) {
          let examPools = data.map((item) => {
            let res = {}
            res._id = item?._id
            res.assignment = item?.assignment?.name
            res.assignmentID = item?.assignmentID
            res.studentID = item?.studentID
            res.levelID = item?.levelID
            res.level = item?.level?.name
            res.part = item?.part?.name
            res.parts = item?.parts
            res.student = item?.student?.name
            res.time = item?.exam?.time
            res.examID = item?.examID
            res.studentObj = item?.student
            res.state = item?.state
            return res
          })
          setExamPools(examPools)
        }
        else {
          setExamPool([])
        }
        setPending(false)
      }
      else if (asyncState === 'getExams') {
        if (data.length !== 0) {
          const exam = data[Math.floor(Math.random() * data.length)]
          console.log('exam:', exam)
          let tmp = {}
          tmp._id = examPool._id
          tmp.examID = exam._id
          tmp.state = 'pending'
          run(updateExamPool(tmp))
          setAsyncState('update')
        }
        else
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
    <div>
      <Nav />
      <Backdrop className={classes.backdrop} open={pending}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Container maxWidth="lg">
        <h2 style={{ textAlign: "center", padding: 50 }}>ExamPool Manage</h2>
        <div className="d-flex align-items-center float-right mr-3">
          <Refresh className={classes.refresh} onClick={(e) => refresh()} />
        </div>
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
                {examPools.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "action" ? (
                              <>
                                {row.state !== "accept" && (
                                  <>
                                    <Button
                                      className={classes.button}
                                      style={{ marginRight: 10 }}
                                      variant="outlined"
                                      onClick={(e) => handleAccept(row)}
                                    >
                                      Accept
                                    </Button>
                                    <Button
                                      className={classes.button}
                                      style={{ marginRight: 10 }}
                                      variant="outlined"
                                      onClick={(e) => handleReject(row)}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </>
                            ) : column.id === "examDetail" ? (
                              <Link
                                to={`/teacher/exam/${row?.examID}`}
                                style={{ textDecoration: "none" }}
                              >
                                <IconButton aria-label="detail">
                                  <RemoveRedEye />
                                </IconButton>
                              </Link>
                            ) : column.id === "delete" ? (
                              <Delete item={row} refresh={refresh} />
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
            count={examPools.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </div>
  );
}

export default ExamPool