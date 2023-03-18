import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
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
  IconButton,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import {Refresh, RemoveRedEye} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import {useAsync} from '../../../../service/utils'
import {getAll} from '../../../../api/price'
import Create from './create'
import Edit from './edit'
import Delete from './delete'

const columns = [
  { id: 'assignmentName', label: 'Assignment', minWidth: 150 },
  { id: 'partName', label: 'Part', minWidth: 150 },
  { id: 'type', label: 'Type', minWidth: 100 },
  { id: 'price', label: 'Price', minWidth: 100 },
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
    marginLeft: 30,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))
const Price = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [prices, setPrices] = useState([])
  const [pending, setPending] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  const refresh = () => {
    run(getAll())
    setPending(true)
  }

  useEffect(() => {
    run(getAll())
  }, [run])
  useEffect(() => {
    if (status === 'resolved') {
      let tmp = data.map((item) => {
        if (item.type === 'assignment') {
          item.assignmentName = item?.assignment?.name
          item.partName = 'All'
        }
        else if (item.type === 'part') {
          item.assignmentName = item?.assignment?.name
          item.partName = item?.part?.name
        }
        else if (item.type === 'group') {
          item.assignmentName = item?.assignment?.name
          const partNames = item?.parts?.map((part) => part.part.name)
          item.partName = partNames.join(',')
        }
        return item
      })
      setPrices(tmp)
      setPending(false)
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false)
    }
  }, [status])
  return (
    <div>
      <Backdrop className={classes.backdrop} open={pending}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Paper className={classes.root}>
        <div className={classes.title}>Price of Assignment</div>
        <Grid container spacing={3}>
          <Create refresh={refresh} />
          <IconButton className={classes.refresh} aria-label="detail" onClick={refresh}>
            <Refresh />
          </IconButton>
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
                {prices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
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
                                  <Link to={`/payment/coupon/${row.id}`} style={{textDecoration: 'none'}}>
                                    <IconButton aria-label="detail">
                                      <RemoveRedEye />
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
            count={prices.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </Paper>
    </div>
  )
}

export default Price