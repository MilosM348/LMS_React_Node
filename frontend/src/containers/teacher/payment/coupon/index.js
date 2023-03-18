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
  Grid, 
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
import Delete from './delete'
import {useAsync} from '../../../../service/utils'
import {getFilter} from '../../../../api/coupon'

const columns = [
  { id: 'code', label: 'Code', minWidth: 150 },
  { id: 'discount', label: 'Discount', minWidth: 100 },
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

const AddCoupon = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const {id} = useParams()
  const classes = useStyles()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [asyncState, setAsyncState] = useState('')
  const [coupons, setCoupons] = useState([])
  const [pending, setPending] = useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  const refresh = () => {
    run(getFilter({priceID: {eq: id}}))
    setPending(true)
  }

  useEffect(() => {
    run(getFilter({priceID: {eq: id}}))
    setPending(true)
  }, [run, id])
  useEffect(() => {
    if (status === 'resolved') {
      let tmp = data.map((item) => {
        let discount = ''
        if (item.isFree)
          discount = 'Free'
        else {
          discount = `${item.discountPercentage} %`
        }
        item.discount = discount
      })
      setCoupons(data)
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
        <h2 style={{textAlign: 'center', padding: 50}}>Add Coupon</h2>
        <Create priceId={id} refresh={refresh} />
        <IconButton className={classes.refresh} aria-label="detail" onClick={refresh}>
          <Refresh />
        </IconButton>
        <Link to="/payment" style={{textDecoration: 'none'}}>
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
                {coupons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} style={{fontSize: 15}}>
                            {column.id === 'action'?
                              (
                                <>
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
            count={coupons.length}
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

export default AddCoupon
