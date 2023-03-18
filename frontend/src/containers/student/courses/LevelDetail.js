import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap'
import {useParams} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'

import Header from '../../../components/NavTwoStudent'
import { BreadcrumbBox } from '../../../components/common/Breadcrumb'
import Footer from '../../../components/FooterTwo'

import CommentTab from './components/LevelCommentTab'
import MessageTab from './components/LevelMessageTab'
import Upload from './components/upload'
import { Styles } from './styles/course.js'
import {useAsync} from '../../../service/utils'
import {getByStudentId, getByPartId} from '../../../api/level'
import {useSetting} from '../../../provider/setting'
import {update, get as getUser} from '../../../api/user'
import {download} from '../../../api/file'
import ProgramTab from './components/LevelProgramTab'
import ExamTab from './components/LevelExamTab'

const useStyles = makeStyles((theme) => ({
    title: {
      fontSize: 17,
      fontFamily: "'Poppins',sans-serif",
      padding: '15px 10px'
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
}))

function LevelDetail() {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const {id} = useParams()
    const classes = useStyles()
    const [setting] = useSetting()
    const [level, setLevel] = useState({})
    const [levels, setLevels] = useState([])
    const [state, setState] = useState('')
    const [assignmentStudent, setAssignmentStudent] = useState({})
    const [isShowRes, setIsShowRes] = useState(false)
    const [helpline, setHelpline] = useState(0)
    const [asyncState, setAsyncState] = useState('')
    const [pending, setPending] = useState(false)

    const handleDownload = (files) => {
        if (files) {
            files.forEach((file) => {
                download(file.url, file.name)
            })
        }
    }
    const handleHelpline = () => {
        if (helpline <= 0 || isShowRes)
            return
        let tmp = {}
        tmp._id = setting.auth._id
        tmp.helpline = helpline - 1
        run(update(tmp))
        setAsyncState('update')
        setPending(true)
    }
    const refresh = () => {
        run(getByStudentId(id, setting.auth._id))
        setAsyncState('getLevel')
        setPending(true)
    }
    
    useEffect(() => {
        if (setting.auth) {
            console.log('id', id)
            console.log('auth', setting.auth._id)
            run(getByStudentId(id, setting.auth._id))
            setAsyncState('getLevel')
        }
    }, [setting.auth, id])
    useEffect(() => {
        if (status === 'resolved') {
            if (asyncState === 'getLevel') {
                console.log(data)
                if (data !== null) {
                    setAssignmentStudent(data.assignmentStudent)
                    setLevel(data.level)
                    setState(data.assignmentStudent.levelState)
                    run(getByPartId(data.level.partID))
                    setAsyncState('getLevels')
                }
            }
            else if (asyncState === 'getLevels') {
                if (data.length !== 0) {
                    data.sort((a, b) => {
                        let comparison = 0;
                        if (a.name > b.name) {
                            comparison = 1;
                        } else if (a.name < b.name) {
                            comparison = -1;
                        }
                        return comparison;
                    })
                    setLevels(data)
                }
                run(getUser(setting.auth._id))
                setAsyncState('getUser')
            }
            else if (asyncState === 'getUser') {
                setHelpline(data.helpline)
                setPending(false)
                setAsyncState('')
            }
            else if (asyncState === 'update') {
                setIsShowRes(true)
                setHelpline(helpline - 1)
                setPending(false)
                setAsyncState('')
            }
        }
        else if (status === 'rejected') {
            console.log(error)
        }
    }, [status, run])
    useEffect(() => {
        const courseButton = document.querySelectorAll(".course-button")
        courseButton.forEach(button => {
            button.addEventListener("click", () => {
                button.classList.toggle("active")
                const content = button.nextElementSibling

                if (button.classList.contains("active")) {
                    content.className = "course-content show"
                    content.style.maxHeight = content.scrollHeight + "px"
                } else {
                    content.className = "course-content"
                    content.style.maxHeight = "0"
                }
            });
        });
    });

    return (
        <div className="main-wrapper course-details-page" >

            {/* Header 2 */}
            < Header />

            {/* Breadcroumb */}
            < BreadcrumbBox title="Level Detail" />

            <Styles>
                {/* Course Details */}
                <section className="course-details-area">
                    <Container>
                        <Row>
                            <Col lg="3" md="4" sm="12">
                                <div className="single-details-sidbar">
                                    <Row>
                                        <Col md="12">
                                            <div className="course-details-feature">
                                                <h5 className="title">Level List</h5>
                                                <ul className="list-unstyled feature-list">
                                                    {
                                                        levels.map((item) => (
                                                            item.name === level.name?
                                                            <li key={item._id}>
                                                                <i className="las la-play"></i> Lecture: {item.name} <span style={{color: 'green'}}>ongoing</span>
                                                            </li>:
                                                            item.name < level.name?
                                                            <li key={item._id}>
                                                                <i className="las la-play"></i> Lecture: {item.name} <span style={{color: 'gray'}}>complete</span>
                                                            </li>:
                                                            <li key={item._id}>
                                                                <i className="las la-play"></i> Lecture: {item.name} <span style={{color: '#1a2245'}}>next</span>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col lg="9" md="8" sm="12">
                                <div className="course-details-top">
                                    <div className={classes.title}>Part {level?.part?.name}</div>
                                    {state === 'ongoing'?
                                        <div className="float-right" style={{fontSize: 16, color: 'green'}}>
                                            {state}
                                        </div>:
                                        state === 'complete'?
                                        <div className="float-right" style={{fontSize: 16, color: 'gray'}}>
                                            {state}
                                        </div>:
                                        <div className="float-right" style={{fontSize: 16, color: '#1a2245'}}>
                                            {state}
                                        </div>
                                    }
                                    <div className="heading">
                                        <h4>Lecture {level.name}. {level.title}</h4>
                                    </div>
                                    <div className="course-details-banner">
                                        <img src={level.image} alt="" className="img-fluid" style={{width: '100%'}} />
                                    </div>
                                    <div className="course-tab-list">
                                        <Tab.Container defaultActiveKey="description">
                                            <Nav className="flex-column">
                                                <Nav.Item>
                                                    <Nav.Link eventKey="description">Description</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="video">Video</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="programming">Programming</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="solution">Solution</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="comment">Comments</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="message">Message</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="upload">Upload</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="exam">Exam</Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="description" className="overview-tab">
                                                    {level.description &&
                                                        <SunEditor
                                                            defaultValue={level.description}
                                                            disable={true}
                                                            showToolbar={false}
                                                            setDefaultStyle="height: auto"
                                                        />
                                                    }
                                                    <div className="d-flex justify-content-center pt-3">
                                                        <button type="button" className="start-btn" onClick={(e) => handleDownload(level.files)}>Download</button>
                                                    </div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="video" className="video-tab">
                                                    <video src={level.video} style={{width: '100%'}} controls />
                                                    <div className="d-flex justify-content-center pt-3">
                                                        <button type="button" className="start-btn" onClick={(e) => handleDownload(level.files)}>Download</button>
                                                    </div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="programming" className="programming-tab">
                                                    <ProgramTab levelId={level?._id} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="solution" className="solution-tab">
                                                    <button type="button" className="start-btn float-right" onClick={handleHelpline}>Helpline({helpline})</button>
                                                    {isShowRes?
                                                    (
                                                    <>
                                                        <img src={level.resImage} style={{width: '100%', padding: '20px 0px'}} />
                                                        {level.resDescription &&
                                                            <SunEditor
                                                                defaultValue={level.resDescription}
                                                                disable={true}
                                                                showToolbar={false}
                                                                setDefaultStyle="height: auto"
                                                            />
                                                        }
                                                        <video src={level.resVideo} style={{width: '100%', paddingTop: 20}} controls />
                                                        <div style={{color: '#3f51b5', padding: '10px 0'}}>Please download files</div>
                                                        <div className="d-flex justify-content-center pt-3">
                                                            <button type="button" className="start-btn" onClick={(e) => handleDownload(level.resFiles)}>Download</button>
                                                        </div>
                                                    </>
                                                    ):
                                                    <div>You can use the helpline</div>
                                                    }
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="comment" className="review-tab">
                                                    {state === 'ongoing' &&
                                                        <CommentTab levelId={level?._id} ownerId={level?.assignment?.ownerID} />
                                                    }
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="message" className="review-tab">
                                                    {state === 'ongoing' &&
                                                        <MessageTab assignmentId={level?.assignment?._id} ownerId={level?.assignment?.ownerID} />
                                                    }
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="upload" className="upload-tab">
                                                    {state === 'ongoing' &&
                                                        <Upload assignmentId={id} levelId={level._id} assignmentStudent={assignmentStudent} ownerId={level?.assignment?.ownerID} refresh={refresh}/>
                                                    }
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="exam" className="exam-tab">
                                                    {state === 'exam'?
                                                        <ExamTab levelId={level?._id} />:
                                                        <div>Once you complete the upload and approved by professor the exam will be available</div>
                                                    }
                                                </Tab.Pane>
                                            </Tab.Content>
                                        </Tab.Container>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </Styles>

            {/* Footer 2 */}
            <Footer />

        </div >
    )
}

export default LevelDetail