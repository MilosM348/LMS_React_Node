import React, {useEffect, useState} from 'react'
import { Row, Col } from 'react-bootstrap'
import {IconButton} from '@material-ui/core'
import {ArrowBackIos, ArrowForwardIos} from '@material-ui/icons'

import {useAsync} from '../../../../service/utils'
import {getAll} from '../../../../api/comment'
import { download } from '../../../../api/file'
import { useSetting } from '../../../../provider/setting'
import CommentForm from './CommentForm'

const CommentTab = (props) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const [setting] = useSetting()
  const {ownerId, levelId} = props
  const [comments, setComments] = useState([])
  const [row, setRow] = useState(5)
  const [from, setFrom] = useState(0)
  const [isEnd, setIsEnd] = useState(false)

  const refresh = () => {
    run(getAll(setting?.auth?._id, levelId))
    setFrom(0)
    setIsEnd(false)
  }
  const handleDownload = (comment) => {
    download(comment.fileUrl, comment.description);
  };
  const handlePrev = () => {
    if (isEnd)
      return
    let newFrom = from+row
    setFrom(newFrom)
  }
  const handleNext = () => {
    setIsEnd(false)
    let newFrom = from-row
    if (newFrom < 0)
      return
    setFrom(newFrom)
  }

  useEffect(() => {
    if (setting?.auth) {
      run(getAll(setting?.auth?._id, levelId))
    }
  }, [run, setting?.auth])
  useEffect(() => {
      if (status === 'resolved') {
        if (data.length !== 0) {
          const tmp = data.map((item) => {
            let sender = 'you'
            if (item.isOwner)
              sender = 'owner'
            item.sender = sender
            return item
          })
          setComments(tmp.reverse())
        }
        else {
          setComments([]);
        }
      }
      else if (status === 'rejected') {
          console.log(error)
      }
  }, [status, run])
  return (
    <Row>
      <Col md="12">
        <div className="review-comments">
          <h5>Course Comments</h5>
          {
            comments.map((comment, index) => (
              <div className="comment-box d-flex" key={index}>
                <div className="comment-content">
                  <div className="content-title d-flex justify-content-between">
                    <div className="comment-writer">
                      <h6>{comment.sender}</h6>
                    </div>
                  </div>
                  <div className="comment-desc">
                    {comment.isFile?
                      <p style={{cursor: 'pointer', color: 'green'}} onClick={(e) => handleDownload(comment)}>file</p>:
                      <p style={{overflowWrap: 'anywhere'}}>{comment.description}</p>
                    }
                  </div>
                </div>
              </div>
            ))
          }
        </div>
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
        <div className="review-form">
          <h5>Submit Comment</h5>
          <CommentForm refresh={refresh} ownerId={ownerId} levelId={levelId} />
        </div>
      </Col>
    </Row>
  )
}
export default CommentTab
