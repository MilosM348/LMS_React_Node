import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
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
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import {RemoveRedEye, Refresh} from '@material-ui/icons'
import {Link} from 'react-router-dom'

import Nav from '../../../layout/nav_company'
import Create from './create'
import Edit from './edit'
import Delete from './delete'
import Back from './back'
import {useAsync} from '../../../../service/utils'
import {getFilter as getExams} from '../../../../api/exam'
import {get as getLevel} from '../../../../api/level'

const columns = [
  { id: 'name', label: 'Name', minWidth: 50 },
  { id: 'time', label: 'Time', minWidth: 50 },
  { id: 'code', label: 'Code', minWidth: 100 },
  {
    id: 'action',
    label: 'Action',
    minWidth: 100,
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
    color: '#212121',
    borderColor: '#c4c4c4',
    fontSize: 15,
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

const AddExam = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const {id} = useParams()
  const classes = useStyles()
  const [level, setLevel] = useState({})
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [asyncState, setAsyncState] = useState('')
  const [exams, setExams] = useState([])
  const [pending, setPending] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0);
  }
  const refresh = () => {
    run(getExams({levelID: id}))
    setAsyncState('getPrograms')
    setPending(true)
  }

  useEffect(() => {
    run(getExams({levelID: id}))
    setAsyncState('getPrograms')
    setPending(true)
  }, [run, id])
  useEffect(() => {
    if (status === 'resolved') {
      // data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      if (asyncState === 'getPrograms') {
        setExams(data)
        run(getLevel(id))
        setAsyncState('getLevel')
      }
      else if (asyncState === 'getLevel') {
        setLevel(data)
        setPending(false)
        setAsyncState('')
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
        <h2 style={{ textAlign: "center", padding: 50 }}>Add Exam</h2>
        <Create level={level} refresh={refresh} />
        <IconButton
          className={classes.refresh}
          aria-label="detail"
          onClick={() => refresh(false)}
        >
          <Refresh />
        </IconButton>
        <Back id={id} />
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
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
                {exams.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ fontSize: 15 }}
                          >
                            {column.id === "action" ? (
                              <>
                                <Edit item={row} refresh={refresh} />
                                <Delete
                                  item={row}
                                  refresh={refresh}
                                  level={level}
                                />
                                <Link
                                  to={`/company/exam/${row._id}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  <IconButton aria-label="detail">
                                    <RemoveRedEye />
                                  </IconButton>
                                </Link>
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
            count={exams.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </>
  );
}

export default AddExam
