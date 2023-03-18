import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
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
import {RemoveRedEye, Refresh} from '@material-ui/icons'
import {Link} from 'react-router-dom'

import Nav from '../../../layout/nav_assignment'
import Create from './create'
import Edit from './edit'
import Delete from './delete'
import {useAsync} from '../../../../service/utils'
import {getByAssignmetId} from '../../../../api/part'

const columns = [
  { id: 'name', label: 'Part', minWidth: 50 },
  { id: 'title', label: 'Title', minWidth: 100 },
  { id: 'image', label: 'Image', minWidth: 100 },
  { id: 'video', label: 'Video', minWidth: 100 },
  { id: 'levelLength', label: 'Level', minWidth: 50 },
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

const AddPart = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const {id} = useParams()
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [parts, setParts] = useState([])
  const [pending, setPending] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  const refresh = () => {
    run(getByAssignmetId(id))
    setPending(true)
  }

  useEffect(() => {
    run(getByAssignmetId(id))
    setPending(true)
  }, [run, id])
  useEffect(() => {
    if (status === 'resolved') {
      data.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      setParts(data)
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
        <h2 style={{textAlign: 'center', padding: 50}}>Add Part</h2>
        <Create assignmentId={id} refresh={refresh} maxPart={parts.length} />
        <IconButton className={classes.refresh} aria-label="detail" onClick={refresh}>
          <Refresh />
        </IconButton>
        <Link to="/teacher/assignment" style={{textDecoration: 'none'}}>
          <Button className={classes.button} color="inherit" variant="outlined" >
            Back
          </Button>
        </Link>
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
                {parts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} style={{fontSize: 15}}>
                            {column.id === 'action'?
                              (
                                <>
                                  <Edit part={row} refresh={refresh} />
                                  <Delete part={row} refresh={refresh} maxPart={parts.length} />
                                  <Link to={`/teacher/part/${row._id}`} style={{textDecoration: 'none'}}>
                                    <IconButton aria-label="detail">
                                      <RemoveRedEye />
                                    </IconButton>
                                  </Link>
                                </>
                              ):
                              (column.id === 'image'?
                                <img src={row.image} style={{height: 100}} />:
                                (column.id === 'video'?
                                  <video src={row.video} style={{height: 100}} controls />:
                                  value
                                )
                              )
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
            count={parts.length}
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

export default AddPart
