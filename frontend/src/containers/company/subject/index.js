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
  Container,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles'

import Nav from "../../layout/nav_company";
import { useAsync } from '../../../service/utils'
import { useSetting } from '../../../provider/setting';
import {getFilter as getSubjects} from '../../../api/subject'
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
  const [setting] = useSetting()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [subjects, setSubjects] = useState([])
  const [pending, setPending] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  const refresh = () => {
    run(getSubjects({companyID: setting?.auth?.companyID}))
    setPending(true)
  }

  useEffect(() => {
    if (setting?.auth) {
      run(getSubjects({companyID: setting?.auth?.companyID}))
      setPending(true)
    }
  }, [run, setting?.auth])
  useEffect(() => {
    if (status === 'resolved') {
      setSubjects(data)
      setPending(false)
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false);
    }
  }, [status])
  return (
    <>
      <Nav />
      <Backdrop className={classes.backdrop} open={pending}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Container maxWidth="lg">
        <h2 style={{ textAlign: "center", padding: 50 }}>Subject Manage</h2>
        <Paper className={classes.root}>
          <Grid container spacing={3}>
            <Create refresh={refresh} companyId={setting?.auth?.companyID} />
            <TableContainer
              className={classes.container}
              style={{ fontSize: 15 }}
            >
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
                  {subjects
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row._id}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ fontSize: 14 }}
                              >
                                {column.id === "action" ? (
                                  <>
                                    <Edit subject={row} refresh={refresh} />
                                    <Delete subject={row} refresh={refresh} />
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
              count={subjects.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Grid>
        </Paper>
      </Container>
    </>
  );
}

export default Slider