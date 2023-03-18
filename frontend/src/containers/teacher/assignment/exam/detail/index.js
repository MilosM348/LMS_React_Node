import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {
  Paper, 
  Container,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'

import Back from './back'
import Nav from '../../../../layout/nav_assignment'
import {useAsync} from '../../../../../service/utils'
import {get} from '../../../../../api/exam'
import ReplitCard from '../../../../../components/ReplitCard'

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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))
const Detail = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const {id} = useParams()
  const classes = useStyles()
  const [exam, setExam] = useState({})
  const [pending, setPending] = useState(false)

  useEffect(() => {
    run(get(id))
    setPending(true)
  }, [run, id])
  useEffect(() => {
    if (status === 'resolved') {
      setExam(data)
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
        <h2 style={{textAlign: 'center', padding: 50}}>Exam Detail</h2>
        <Back id={id} />
        <Paper className={classes.root}>
          {exam.code &&
            <ReplitCard code={exam.code} />
          }
        </Paper>
      </Container>
    </>
  )
}
export default Detail
