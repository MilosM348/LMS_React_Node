import React, {useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, forwardRef} from 'react'
import NotificationManager from 'react-notifications/lib/NotificationManager'
import {
  Badge
} from "@material-ui/core";
import socketIOClient from "socket.io-client";

import {useAsync} from '../../../../service/utils'
import { getFilter as getMessages } from '../../../../api/message'
import { getStudents as getUsers } from '../../../../api/student'
import { download } from '../../../../api/file'
import { useSetting } from '../../../../provider/setting'
import { Styles } from './style/LevelMessage'
import MessageForm from './MessageForm'
import siteConfig from '../../../../config/site.config';

const MessageDisplay = forwardRef(function MessageDisplay(
  { messages },
  ref,
) {
  const containerRef = useRef()
  const scrollToTop = () => {
    containerRef.current.scrollTop = 0
  }
  const scrollToBottom = () => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }
  const handleDownload = (message) => {
    download(message.fileUrl, message.description);
  };
  
  useLayoutEffect(() => {
    scrollToBottom()
  }, [messages])
  useImperativeHandle(ref, () => ({
    scrollToTop,
    scrollToBottom,
  }))

  return (
    <div ref={containerRef} className="message-list">
      {
        messages.map((message, index) => (
          <div className="comment-box d-flex" key={index}>
            <div className="comment-content">
              <div className="content-title d-flex justify-content-between">
                <div className="message-writer">
                  <div>{message.fromUser}</div>
                </div>
              </div>
              <div className="message-desc">
                {message.isFile?
                  <p style={{cursor: 'pointer', color: 'green'}} onClick={(e) => handleDownload(message)}>{message.description}</p>:
                  <p style={{overflowWrap: 'anywhere'}}>{message.description}</p>
                }
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
})
const socket = socketIOClient(siteConfig.apiUrl);
const MessageTab = (props) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const [setting] = useSetting()
  const messageDisplayRef = useRef()
  const {ownerId, assignmentId} = props
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState({})
  const [users, setUsers] = useState([])
  const [selectUserId, setSelectUserId] = useState(-1)
  const [selectUserName, setSelectUserName] = useState('All')
  const [available, setAvailable] = useState(false)

  const handleChangeSelectUser = (id, name) => {
    setSelectUserId(id)
    setSelectUserName(name)
    changeRestNum(id, true)
  }
  const handleSendMessage = (message) => {
    let _message = message
    _message.from = setting?.auth?._id
    _message.to = selectUserId
    _message.assignmentID = assignmentId
    _message.companyID = setting?.auth?.companyID
    socket.emit('message', _message)
  }
  const changeRestNum = (userId, isReset = false) => {
    let _users = [...users]
    _users = _users.map((item) => {
      if (item.id === userId) {
        if (isReset)
          item.restNum = 0
        else
          item.restNum += 1
      }
      return item
    })
    setUsers(_users)
  }
  const addMessage = (message) => {
    message.fromUser = findUserName(message.from)
    let _messages = [...messages, message];
    setMessages(_messages)
  }
  const receiveMessage = (message) => {
    // private chatting
    if (message.to === setting?.auth?._id) { 
      if (message.from === selectUserId) {
        addMessage(message)
      } else {
        changeRestNum(message.from);
      }
    }
    if (message.from === setting?.auth._id && message.to === selectUserId)
      addMessage(message)
    // group chatting
    if (message.to === -1) { 
      if (selectUserId === -1) {
        addMessage(message)
      }
      else if (message.from !== setting?.auth?._id)
        changeRestNum(-1)
    }
  }
  const findUserName = (userId) => {
    if (users.length === 0)
      return ''
    let res = ''
    if (userId === setting?.auth?._id)
      res = setting?.auth?.firstName;
    else {
      const fromUser = users.filter((user) => user.id === userId);
      res = fromUser[0].userName;
    }
    return res
  }
  const scrollToTop = () => messageDisplayRef.current.scrollToTop();
  const scrollToBottom = () => messageDisplayRef.current.scrollToBottom();

  useEffect(() => {
    receiveMessage(newMessage);
  }, [newMessage])
  useEffect(() => {
    (async () => {
      const students = await getUsers(assignmentId)
      let _users = [
        { id: -1, userName: 'All', restNum: 0 },
        { id: ownerId, userName: 'Owner', restNum: 0 },
      ]
      let _students = students.map((item) => {
        let student = {}
        student.id = item._id
        student.userName = item.firstName
        student.restNum = 0
        return student
      })
      _students = _students.filter((student) => student.id !== setting?.auth?._id) // remove me from student list
      _users = [..._users, ..._students]
      setUsers(_users)
      socket.emit('joinRoom', {
        companyId: setting?.auth?.companyID,
        assignmentId: assignmentId,
        userId: setting?.auth?._id,
      }, function (data) {
        setAvailable(data.available)
        if (!data.available) {
          NotificationManager.warning(data.error, 'Warning', 3000);
        }
      })
      socket.on('message', (message) => {
        setNewMessage(message)
      })
    })()
    return () => socket.close();
  }, [assignmentId, ownerId, setting?.auth])
  useEffect(() => {
    console.log('select user')
    if (setting?.auth && users.length !== 0) {
      let filter = {}
      if (selectUserId === -1) {
        filter = {
          to: selectUserId,
          assignmentID: assignmentId,
          companyID: setting?.auth?.companyID,
        };
      }
      else {
        filter = {
          $or: [
            {
              from: setting?.auth?._id,
              to: selectUserId,
              assignmentID: assignmentId,
              companyID: setting?.auth?.companyID,
            },
            {
              from: selectUserId,
              to: setting?.auth?._id,
              assignmentID: assignmentId,
              companyID: setting?.auth?.companyID,
            },
          ],
        };
      }
      run(getMessages(filter))
    }
  }, [run, setting?.auth, assignmentId, selectUserId, users])
  useEffect(() => {
    if (status === 'resolved') {
      console.log(data)
      if (data.length !== 0) {
        let _messages = data.map((item) => {
          item.fromUser = findUserName(item.from)
          return item
        })
        setMessages(_messages)
      }
      else {
        setMessages([]);
      }
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [status, run])
  return (
    <Styles>
      {available &&
        <div className="message-tab">
          <div className="message-box">
            <div className="review-comments">
              <h5>{selectUserName}</h5>
              <MessageDisplay ref={messageDisplayRef} messages={messages} />
            </div>
            <MessageForm submit={handleSendMessage} />
          </div>
          <div className="user-list">
            {users.map((item, index) => (
              <div className={`user-item ${selectUserId === item.id ? 'active' : ''}`} onClick={() => handleChangeSelectUser(item.id, item.userName)} key={index}>
                <Badge color="secondary" badgeContent={item.restNum>99? "+99":item.restNum}
                  anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}>
                  {item.userName}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      }
    </Styles>
  )
}
export default MessageTab
