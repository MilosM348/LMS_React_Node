import React, {useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, forwardRef} from 'react'
import NotificationManager from 'react-notifications/lib/NotificationManager'
import socketIOClient from "socket.io-client";
import {
  Paper, 
  Container,
  Badge,
} from '@material-ui/core'

import Nav from '../../layout/nav_assignment'
import { useAsync } from "../../../service/utils";
import { getFilter as getMessages } from "../../../api/message";
import { getStudents as getUsers } from "../../../api/student";
import { download } from "../../../api/file";
import { getFilter as getAssignments } from '../../../api/assignment'
import { useSetting } from "../../../provider/setting";
import { Styles } from "./style/index";
import MessageForm from "../../student/courses/components/MessageForm";
import siteConfig from "../../../config/site.config";

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
          <div className="message-item" key={index}>
            <div className="message-content">
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
const Message = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const [setting] = useSetting()
  const messageDisplayRef = useRef()
  const [assignments, setAssignments] = useState([])
  const [assignmentId, setAssignmentId] = useState(-1)
  const [assignmentName, setAssignmentName] = useState('')
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState({})
  const [users, setUsers] = useState([])
  const [selectUserId, setSelectUserId] = useState(-1)
  const [selectUserName, setSelectUserName] = useState('')
  const [available, setAvailable] = useState(false)

  const handleChangeSelectUser = (id, name) => {
    setSelectUserId(id)
    setSelectUserName(name)
    changeRestNum(id, true)
  }
  const handleChangeAssignment = (id, name) => {
    setAssignmentId(id)
    setAssignmentName(name)
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
    if (!setting?.auth)
      return
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
    (async () => {
      if (setting?.auth) {
        let _assignments = await getAssignments({ ownerID: setting?.auth?._id })
        setAssignments(_assignments)
        if (_assignments.length !== 0)
          setAssignmentId(_assignments[0]._id)
      }
    })()
  }, [setting?.auth])
  useEffect(() => {
    receiveMessage(newMessage);
  }, [newMessage])
  useEffect(() => {
    (async () => {
      let students = await getUsers(assignmentId)
      students = students.map((item) => {
        let student = {}
        student.id = item._id
        student.userName = item.firstName
        student.restNum = 0
        return student
      })
      setUsers(students)
      if (students.length !== 0) {
        setSelectUserId(students[0].id)
        setSelectUserName(students[0].userName)
      }
      socket.emit('joinRoom', {
        companyId: setting?.auth?.companyID,
        assignmentId: assignmentId,
        userId: setting?.auth?._id,
      }, function (data) {
        console.log(data)
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
  }, [assignmentId, setting?.auth])
  useEffect(() => {
    console.log('select user')
    if (setting?.auth && users.length !== 0) {
      let filter = {
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
    <div>
      <Nav />
      <Container maxWidth="lg">
        <h2 style={{ textAlign: "center", padding: 50 }}>Message Manage</h2>
        <Paper>
          <Styles>
            <div className="message-tab">
              <div className="assignment-list">
                {assignments.map((item, index) => (
                  <div className={`assignment-item ${assignmentId === item._id ? 'active' : ''}`} onClick={() => handleChangeAssignment(item._id, item.name)} key={index}>
                    {item.name}
                  </div>
                ))}
              </div>
              <div className="message-box">
                <div className="message-body">
                  <h5 className="message-header">
                    <span>{assignmentName}</span> &gt;
                    <span>{selectUserName}</span>
                  </h5>
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
          </Styles>
        </Paper>
      </Container>
    </div>
  );
}

export default Message