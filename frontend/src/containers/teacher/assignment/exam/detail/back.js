import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import {Button} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import {useAsync} from '../../../../../service/utils'
import {get} from '../../../../../api/exam'

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
}))
const Back = (props) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const {id} = props
  const classes = useStyles()
  const [levelId, setLevelId] = useState('')

  useEffect(() => {
    run(get(id))
  }, [run])
  useEffect(() => {
    if (status === 'resolved') {
      setLevelId(data.levelID)
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [status])

  return (
    <Link to={`/teacher/level/exam/${levelId}`} style={{textDecoration: 'none'}}>
      <Button className={classes.button} color="inherit" variant="outlined" >
        Back
      </Button>
    </Link>
  )
}
export default Back
