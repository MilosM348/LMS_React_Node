import React, { useEffect, useState } from 'react'
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
  Backdrop,
  CircularProgress,
} from '@material-ui/core'

import {getStudentsOfOwner as getStudents} from '../../../api/student'
import { useAsync } from '../../../service/utils'
import { useSetting } from '../../../provider/setting'
import Change from './change'
import Block from './block'

const columns = [
  { id: 'userName', label: 'User Name', minWidth: 50 },
  { id: 'assignmentName', label: 'Assignment', minWidth: 100 },
  { id: 'partName', label: 'Part', minWidth: 100 },
  { id: 'levelName', label: 'Level', minWidth: 100 },
  { id: 'blockNumber', label: 'Block', minWidth: 5 },
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))
const Student = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles()
  const [setting] = useSetting()
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [students, setStudents] = useState([])
  const [pending, setPending] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const refresh = () => {
    run(getStudents(setting?.auth?._id))
    setPending(true)
  }

  useEffect(() => {
    run(getStudents(setting?.auth?._id));
  }, [run, rowsPerPage])
  useEffect(() => {
    if (status === 'resolved') {
      if (data.length !== 0) {
        let tmp = data.map((item) => {
          item.userName = item.name
          item.assignmentName = item?.assignment?.name
          item.partName = item?.assignment?.part?.name
          item.levelName = item?.assignment?.level?.name
          item.blockNumber = item?.blocks?.length
          return item
        })
        setStudents(tmp)
      }
      setPending(false)
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false)
    }
  }, [run, status])

  return (
    <div>
      <Backdrop className={classes.backdrop} open={pending}>
        <CircularProgress color="primary" />
      </Backdrop>
      <h2 style={{ textAlign: "center", padding: 50 }}>Assignment Manage</h2>
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
              {students.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === "action" ? (
                            <>
                              <Change refresh={refresh} item={row} />
                              <Block refresh={refresh} item={row} />
                            </>
                          ) : column.id === "blockNumber" && value > 0 ? (
                            <span style={{ color: "red" }}>{value}</span>
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
          count={students.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default Student