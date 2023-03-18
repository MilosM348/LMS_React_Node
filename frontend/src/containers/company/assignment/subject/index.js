import React, {useEffect, useState} from 'react'
import {
  Paper,
  Grid,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TablePagination, 
  TableRow,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import {useAsync} from '../../../../service/utils'
import {getAll} from '../../../../api/subject'
import Create from './create'
import Edit from './edit'
import Delete from './delete'

const columns = [
  { id: 'name', label: 'Name', minWidth: 100 },
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
    padding: 20,
    marginBottom: 40,
    marginTop: 40,
  },
  title: {
    fontSize: '18px',
    paddingBottom: 30
  },
  button: {
    textTransform: 'none',
    fontSize: 15,
  },
}))
const Slider = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [subjects, setSubjects] = useState([])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  const refresh = () => {
    run(getAll())
  }

  useEffect(() => {
    run(getAll())
  }, [run])
  useEffect(() => {
    if (status === 'resolved') {
      setSubjects(data)
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [status])
  return (
    <Paper className={classes.root}>
      <div className={classes.title}>Subjects</div>
      <Grid container spacing={3}>
      <Create refresh={refresh} />
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
              {subjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align} style={{fontSize: 14}}>
                          {column.id === 'action'?
                            (
                              <>
                                <Edit subject={row} refresh={refresh} />
                                <Delete subject={row} refresh={refresh} />
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
          count={subjects.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Grid>
    </Paper>
  )
}

export default Slider