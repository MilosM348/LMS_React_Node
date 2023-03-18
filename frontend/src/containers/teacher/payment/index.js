import React, {useEffect, useState} from 'react'
import {
  Container,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Nav from '../../layout/nav_assignment'
import {useAsync} from '../../../service/utils'
import Price from './price/index'

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
const Payment = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  useEffect(() => {
    if (status === 'resolved') {
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [status])
  return (
    <div>
      <Nav />
      <Container maxWidth="lg">
        <h2 style={{textAlign: 'center', padding: 50}}>Payment Manage</h2>
        <Price />
      </Container>
    </div>
  )
}

export default Payment