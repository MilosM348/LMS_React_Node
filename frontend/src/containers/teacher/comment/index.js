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
import {Reply, Refresh} from '@material-ui/icons'
import {Link} from 'react-router-dom'

import Nav from '../../layout/nav_assignment'
import { getFilter as getNewComments } from '../../../api/newComment'
import { useAsync } from '../../../service/utils'
import { useSetting } from '../../../provider/setting'

const columns = [
  { id: 'student', label: 'Student', minWidth: 100 },
  { id: 'assignmentName', label: 'Assignment', minWidth: 50 },
  { id: 'commentDes', label: 'Comment', minWidth: 200, maxWidth: 300 },
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
const NewComment = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles()
  const [setting] = useSetting()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [comments, setComments] = useState([])
  const [pending, setPending] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  const refresh = () => {
    run(getNewComments({ ownerID: setting?.auth?._id, companyID: setting?.auth?.companyID }))
    setPending(true)
  }

  useEffect(() => {
    if (setting?.auth) {
      run(getNewComments({ ownerID: setting?.auth?._id, companyID: setting?.auth?.companyID }));
      setPending(true)
    }
  }, [run, setting?.auth])
  useEffect(() => {
    if (status === 'resolved') {
      let tmp = data.map((item) => {
        item.student = item?.user?.name
        item.assignmentName = item?.assignment?.name
        item.commentDes = item?.comment?.description
        return item
      })
      setComments(tmp)
      setPending(false)
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
        <h2 style={{textAlign: 'center', padding: 50}}>New Comments Manage</h2>
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
                      style={{ minWidth: column.minWidth, maxWidth: column.maxWidth, fontSize: 15 }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {comments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} style={{minWidth: column.minWidth, maxWidth: column.maxWidth, fontSize: 14, overflowWrap: 'anywhere' }}>
                            {column.id === 'action'?
                              (
                                <>
                                  <Link to={`/teacher/comment/${row.levelID}/${row.userID}`} style={{textDecoration: 'none'}}>
                                    <IconButton aria-label="detail">
                                      <Reply />
                                    </IconButton>
                                  </Link>
                                </>
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
            count={comments.length}
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

export default NewComment
