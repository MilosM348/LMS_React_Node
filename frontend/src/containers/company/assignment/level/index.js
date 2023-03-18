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
  Button,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import {Refresh} from '@material-ui/icons'
import {Link} from 'react-router-dom'

import Nav from '../../../layout/nav_company'
import Create from './create'
import Edit from './edit'
import Delete from './delete'
import Back from './back'
import {useAsync} from '../../../../service/utils'
import {getFilter as getLevels} from '../../../../api/level'
import {get as getPart} from '../../../../api/part'
import {sleep} from '../../../../service/common'

const columns = [
  { id: 'name', label: 'Level', minWidth: 50 },
  { id: 'title', label: 'Title', minWidth: 100 },
  { id: 'image', label: 'Image', minWidth: 100 },
  { id: 'video', label: 'Video', minWidth: 100 },
  { id: 'programLength', label: 'Program', minWidth: 50 },
  { id: 'examLength', label: 'Exam', minWidth: 50 },
  {
    id: 'action',
    label: 'Action',
    minWidth: 100,
    align: 'center',
  },
  {
    id: 'goto',
    label: 'GoTo',
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

const AddLevel = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const {id} = useParams()
  const classes = useStyles()
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [part, setPart] = useState({})
  const [asyncState, setAsyncState] = useState('')
  const [levels, setLevels] = useState([])
  const [pending, setPending] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0);
  }
  const refresh = () => {
    console.log('refresh')
    run(getLevels({partID: id}))
    setAsyncState('getLevels')
    setPending(true)
  }

  useEffect(() => {
    run(getLevels({partID: id}))
    setAsyncState('getLevels')
    setPending(true)
  }, [run, id])
  useEffect(() => {
    if (status === 'resolved') {
      // data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      // console.log(data)
      if (asyncState === 'getLevels') {
        setLevels(data)
        run(getPart(id))
        setAsyncState('getPart')
      }
      else if (asyncState === 'getPart') {
        setPart(data)
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
        <h2 style={{ textAlign: "center", padding: 50 }}>Add Level</h2>
        <Create part={part} refresh={refresh} />
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
                {levels.map((row) => {
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
                                <Edit level={row} refresh={refresh} />
                                <Delete
                                  level={row}
                                  refresh={refresh}
                                  part={part}
                                />
                              </>
                            ) : column.id === "goto" ? (
                              <>
                                <Link
                                  to={`/company/level/program/${row._id}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  <Button
                                    className={classes.button}
                                    style={{ marginRight: 10 }}
                                    variant="outlined"
                                  >
                                    Program
                                  </Button>
                                </Link>
                                <Link
                                  to={`/company/level/exam/${row._id}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  <Button
                                    className={classes.button}
                                    style={{ marginRight: 10 }}
                                    variant="outlined"
                                  >
                                    Exam
                                  </Button>
                                </Link>
                              </>
                            ) : column.id === "image" ? (
                              <img
                                src={row.image}
                                style={{
                                  height: 100,
                                  width: 100,
                                  objectFit: "cover",
                                }}
                              />
                            ) : column.id === "video" ? (
                              <video
                                src={row.video}
                                style={{ height: 100 }}
                                controls
                              />
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
            count={levels.length}
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

export default AddLevel
