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
  Container,
  IconButton,
  Backdrop,
  CircularProgress,
} from '@material-ui/core'
import {ArrowBackIos, ArrowForwardIos, Refresh} from '@material-ui/icons'

import Nav from '../../layout/nav_assignment'
import SearchForm from './searchForm'
import {getAll as getComments, create} from '../../../api/comment'
import {download} from '../../../api/file'
import { useAsync } from '../../../service/utils'
import { useSetting } from '../../../provider/setting'
import Create from './create'
import FileAttach from '../../student/courses/components/FileAttach'

const columns = [
  { id: 'sender', label: 'Sender', minWidth: 20, maxWidth: 20 },
  { id: 'description', label: 'Description', minWidth: 200, maxWidth: 400 }
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
  refresh: {
    cursor: 'pointer',
    fontSize: 25,
    paddingBottom: 4,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))
const Comment = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const classes = useStyles()
  const [setting] = useSetting()
  const [from, setFrom] = useState(0)
  const [isEnd, setIsEnd] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [comments, setComments] = useState([])
  const [studentId, setStudentId] = useState('')
  const [levelId, setLevelId] = useState('')
  const [filenames, setFilenames] = useState([])
  const [pending, setPending] = useState(false)
  const [asyncState, setAsyncState] = useState('')
  const [fileState, setFileState] = useState(-1)

  const handlePrev = () => {
    if (isEnd)
      return
    let newFrom = from+rowsPerPage
    setFrom(newFrom)
  }
  const handleNext = () => {
    setIsEnd(false)
    let newFrom = from-rowsPerPage
    if (newFrom < 0)
      return
    setFrom(newFrom)
  }
  const refresh = (studentId, levelId) => {
    run(getComments(studentId, levelId))
    setAsyncState('getAll')
    setStudentId(studentId)
    setLevelId(levelId)
    setIsEnd(false)
    setFrom(0)
  }
  const handleDownload = (comment) => {
    download(comment.fileUrl, comment.description)
  }
  const handleUpload = (filenames) => {
    setFilenames(filenames)
    run(create({
      description: filenames[0].name,
      fileUrl: filenames[0].url,
      userID: studentId,
      ownerID: setting?.auth?._id,
      levelID: levelId,
      isOwner: true,
      isFile: true,
      companyID: setting?.auth?.companyID
    }))
    setFileState(1)
    setAsyncState('file')
  }
  const fileAttach = () => {
    if (fileState >= filenames.length)
      return
    run(create({
      description: filenames[fileState].name,
      fileUrl: filenames[fileState].url,
      userID: studentId,
      ownerID: setting?.auth?._id,
      levelID: levelId,
      isOwner: true,
      isFile: true,
      companyID: setting?.auth?.companyID
    }))
    setFileState(fileState + 1)
  }
  
  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'getAll') {
        if (data.length !== 0) {
          const tmp = data.map((item) => {
            let sender = 'you'
            if (!item.isOwner)
              sender = 'student'
            item.sender = sender
            return item
          })
          setComments(tmp.reverse())
        }
        else {
          setIsEnd(true)
        }
      }
      else if (asyncState === 'file') {
        if (fileState < filenames.length) {
          fileAttach()
          console.log(fileState)
        }
        else if (fileState === filenames.length) {
          refresh(studentId, levelId)
          setFilenames([])
          setFileState(-1)
        }
      }
    }
    else if (status === 'rejected') {
      console.log(error)
      setPending(false)
    }
  }, [run, status])

  return (
    <div>
      <Nav />
      <Backdrop className={classes.backdrop} open={pending}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Container maxWidth="lg">
        <h2 style={{textAlign: 'center', padding: 50}}>Comment Manage</h2>
        <SearchForm refresh={refresh} />
        <div className="d-flex align-items-center float-right">
          <Refresh className={classes.refresh} onClick={(e) => refresh(studentId, levelId)} />
          <FileAttach callback={handleUpload}/>
          <Create refresh={refresh} studentId={studentId} levelId={levelId} />
        </div>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {comments.slice(from, from + rowsPerPage).map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, maxWidth: column.maxWidth, overflowWrap: 'anywhere' }}>
                            {column.id === 'description' && row.isFile?
                            <span style={{cursor: 'pointer', color: 'green'}} onClick={(e) => handleDownload(row)}>file</span>:
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
          <div style={{float: 'right'}}>
            {isEnd?
            (
              <IconButton aria-label="detail" disabled>
                <ArrowBackIos />
              </IconButton>
              ):(
              <IconButton aria-label="detail" onClick={(e) => handlePrev()}>
                <ArrowBackIos />
              </IconButton>
              )
            }
            {from===0?
              (
                <IconButton aria-label="detail" disabled>
                  <ArrowForwardIos />
                </IconButton>
              ):(
                <IconButton aria-label="detail" onClick={(e) => handleNext()}>
                  <ArrowForwardIos />
                </IconButton>
              )
            }
          </div>
        </Paper>
      </Container>
    </div>
  )
}

export default Comment