import React, {useEffect, useState} from 'react'
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
} from '@material-ui/core'
import {Refresh} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import Nav from '../../layout/nav_company'
import {useAsync} from '../../../service/utils'
import { getFilter as getReplits } from '../../../api/replit'
import { useSetting } from '../../../provider/setting'
import Create from './create'
import Edit from './edit'
import Delete from './delete'

const columns = [
  { id: 'name', label: 'Replit Username', minWidth: 100 },
  { id: 'password', label: 'Replit Password', minWidth: 100 },
  { id: 'userEmail', label: 'User Email', minWidth: 100 },
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
  title: {
    fontSize: '18px',
    paddingBottom: 30
  },
  button: {
    textTransform: 'none',
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
const Replit = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const [setting] = useSetting()
  const classes = useStyles()
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [replits, setReplits] = useState([])
  const [pending, setPending] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const refresh = () => {
    run(getReplits(setting?.auth?.companyID))
    setPending(true)
  }

  useEffect(() => {
    if (setting?.auth) {
      run(getReplits(setting?.auth?.companyID));
      setPending(true);
    }
  }, [run, setting?.auth]);
  useEffect(() => {
    if (status === 'resolved') {
      let tmp = data.map((item) => {
        item.userEmail = item.user.email
        return item
      })
      setReplits(tmp)
      setPending(false)
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
        <h2 style={{textAlign: 'center', padding: 50}}>Replit User Manage</h2>
        <Create refresh={refresh} companyId={setting?.auth?.companyID} />
        <IconButton className={classes.refresh} aria-label="detail" onClick={() => refresh()}>
          <Refresh />
        </IconButton>
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
                {replits.map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} style={{fontSize: 14}}>
                            {column.id === 'action'?
                              (
                                <>
                                  <Edit item={row} refresh={refresh} />
                                  <Delete item={row} refresh={refresh} />
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
            count={replits.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </div>
  )
}

export default Replit