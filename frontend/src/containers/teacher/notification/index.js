import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import NotificationManager from 'react-notifications/lib/NotificationManager'
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
  Add, 
  Remove, 
  Refresh
} from '@material-ui/icons'

import Nav from '../../layout/nav_assignment'
import {getFilter as getNotifications, update as updateNotification} from '../../../api/notification'
import {update} from '../../../api/user'
import {download} from '../../../api/file'
import {setState} from '../../../api/student'
import {create as createExamPool} from '../../../api/exampool'
import {getFilter as getExams} from '../../../api/exam'
import { useAsync } from '../../../service/utils'
import { useSetting } from '../../../provider/setting'
import Delete from './delete'

const columns = [
  { id: 'assignment', label: 'Assignment', minWidth: 100 },
  { id: 'part', label: 'Part', minWidth: 50 },
  { id: 'level', label: 'Level', minWidth: 50 },
  { id: 'student', label: 'Student', minWidth: 100 },
  { id: 'helpline', label: 'Helpline', minWidth: 50 },
  {
    id: 'add_helpline',
    label: 'Add Helpline',
    minWidth: 100,
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
const Notification = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const [setting] = useSetting()
  const classes = useStyles()
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [notification, setNotification] = useState({})
  const [notifications, setNotifications] = useState([])
  const [asyncState, setAsyncState] = useState('')
  const [pending, setPending] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
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
  }
  const handleDownload = (files) => {
    files.forEach((file) => {
      download(file.url, file.name)
    })
  }
  const handleAccept = (item) => {
    setNotification(item)
    run(getExams({levelID: item.levelID}))
    setAsyncState('getExams')
    setPending(true)
  }
  const handleReject = (item) => {
    const studentId = item.studentID
    const assignmentId = item.assignmentID
    setState(assignmentId, studentId, 'ongoing', 'ongoing')
    let tmp = {}
    tmp._id = item._id
    tmp.assignmentID = item.assignmentID
    tmp.studentID = item.studentID
    tmp.levelID = item.levelID
    tmp.files = item.files
    tmp.state = 'reject'
    run(updateNotification(tmp))
    setAsyncState('update')
    setPending(true)
  }
  const refresh = () => {
    run(getNotifications({companyID: setting?.auth?.companyID}))
    setAsyncState('getNotifications')
    setPending(true)
  }

  useEffect(() => {
    run(getNotifications({companyID: setting?.auth?.companyID}))
    setAsyncState('getNotifications')
    setPending(true)
  }, [run])
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'getNotifications') {
        if (data.length !== 0) {
          let notifications = data.map((item) => {
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
            res.helpline = item?.student?.helpline
            res.studentObj = item?.student
            res.files = item?.files
            res.state = item?.state
            return res
          })
          setNotifications(notifications)
        }
        else
          setNotifications([])
        setPending(false)
      }
      else if (asyncState === 'getExams') {
        if (data.length !== 0) {
          const exam = data[Math.floor(Math.random() * data.length)]
          console.log('exam:', exam)
          let examPool = {}
          examPool.assignmentID = notification.assignmentID
          examPool.companyID = setting?.auth?.companyID
          examPool.studentID = notification.studentID
          examPool.levelID = notification.levelID
          examPool.state = 'pending'
          examPool.examID = exam._id
          createExamPool(examPool)
          setState(notification.assignmentID, notification.studentID, 'exam', 'ongoing')
          let tmp = {}
          tmp._id = notification._id
          tmp.assignmentID = notification.assignmentID
          tmp.studentID = notification.studentID
          tmp.levelID = notification.levelID
          tmp.files = notification.files
          tmp.state = 'accept'
          run(updateNotification(tmp))
          setAsyncState('update')
        }
        else {
          NotificationManager.warning("There is not any exams.", "Worning", 3000);
          setPending(false)
        }
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
        <h2 style={{ textAlign: "center", padding: 50 }}>
          Notification Manage
        </h2>
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
                {notifications.map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "action" ? (
                              <>
                                <Button
                                  className={classes.button}
                                  style={{ marginRight: 10 }}
                                  variant="outlined"
                                  onClick={(e) => handleDownload(row.files)}
                                >
                                  Doanload
                                </Button>
                                {row.state === "pending" && (
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
                            ) : column.id === "add_helpline" ? (
                              <>
                                <IconButton
                                  aria-label="detail"
                                  onClick={(e) =>
                                    changeHelpline(
                                      row.studentObj,
                                      row.helpline + 1
                                    )
                                  }
                                >
                                  <Add />
                                </IconButton>
                                <IconButton
                                  aria-label="detail"
                                  onClick={(e) =>
                                    changeHelpline(
                                      row.studentObj,
                                      row.helpline - 1
                                    )
                                  }
                                >
                                  <Remove />
                                </IconButton>
                              </>
                            ) : column.id === "delete" ? (
                              <Delete notification={row} refresh={refresh} />
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
            count={notifications.length}
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

export default Notification