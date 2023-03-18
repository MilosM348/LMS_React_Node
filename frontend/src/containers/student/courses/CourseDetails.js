import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import {useParams} from 'react-router-dom'
import {
    Backdrop,
    CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'

import Header from '../../../components/NavTwoStudent'
import { BreadcrumbBox } from '../../../components/common/Breadcrumb'
import Footer from '../../../components/FooterTwo'
import { Styles } from './styles/course.js'
import {useAsync} from '../../../service/utils'
import {useSetting} from '../../../provider/setting'
import {get} from '../../../api/assignment'
import {update} from '../../../api/user'
import {getAssignmentState, addAssignment} from '../../../api/student'
import CourseTabPart from './components/CourseTabPart'
import IsPayment from './payment/isPayment'

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
}))
function CourseDetails() {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const {id} = useParams()
    const [setting] = useSetting()
    const classes = useStyles()
    const [assignment, setAssignment] = useState({})
    const [state, setState] = useState('')
    const [asyncState, setAsyncState] = useState('')
    const [pending, setPending] = useState(false)

    const handleFavorite = () => {
        console.log(assignment)
        if (assignment.parts.length === 0)
            return
        if (assignment.parts[0].levels.length === 0)
            return
        if (state === 'complete' || state === 'ongoing')
            return
        const levels = assignment.parts[0].levels.filter((item) => item.name === 1)
        if (levels.length === 0)
            return
        run(addAssignment({
            assignmentID: assignment._id,
            studentID: setting?.auth?._id,
            levelID: levels[0]._id,
            levelState: 'ongoing',
            state: 'ongoing',
            companyID: setting?.auth?.companyID
        }))
        setAsyncState('addAssignment')
    }

    useEffect(() => {
        run(get(id))
        setAsyncState('get')
        setPending(true)
    }, [id, run])
    useEffect(() => {
        if (status === 'resolved') {
            if (asyncState === 'get') {
                setAssignment(data)
                run(getAssignmentState(id, setting.auth._id))
                setAsyncState('getState')
            }
            else if (asyncState === 'getState') {
                setState(data)
                setAsyncState('')
                setPending(false)
            }
            else if (asyncState === 'addAssignment') {
                if (data.message === 'success') {
                    setState('ongoing')
                    let user = {}
                    user._id = setting.auth._id
                    user.helpline = 10
                    update(user)
                }
            }
        }
        else if (status === 'rejected') {
            console.log(error)
            setPending(false)
        }
    }, [status, run])
    useEffect(() => {
        const courseButton = document.querySelectorAll(".course-button");
        courseButton.forEach(button => {
            button.addEventListener("click", () => {
                button.classList.toggle("active");
                const content = button.nextElementSibling;

                if (button.classList.contains("active")) {
                    content.className = "course-content show";
                    content.style.maxHeight = content.scrollHeight + "px";
                } else {
                    content.className = "course-content";
                    content.style.maxHeight = "0";
                }
            });
        });
    });

    return (
        <div className="main-wrapper course-details-page" >
            <Backdrop className={classes.backdrop} open={pending}>
                <CircularProgress color="primary" />
            </Backdrop>
            {/* Header 2 */}
            < Header />

            {/* Breadcroumb */}
            < BreadcrumbBox title="Course Details" />

            <Styles>
                {/* Course Details */}
                <section className="course-details-area">
                    <Container>
                        <Row>
                            <Col lg="9" md="8" sm="12">
                                <div className="course-details-top">
                                    <div className="heading">
                                        <h4>{assignment.title}</h4>
                                    </div>
                                    <div className="course-top-overview">
                                        {state === 'ongoing'?
                                            <div className="float-right" style={{fontSize: 16, color: 'green'}}>
                                                {state}
                                            </div>:
                                            state === 'complete'?
                                            <div className="float-right" style={{fontSize: 16, color: 'gray'}}>
                                                {state}
                                            </div>:
                                            state === 'rest'?
                                            <div className="float-right" style={{fontSize: 16, color: '#1a2245'}}>
                                                next
                                            </div>:''
                                        }
                                        <div className="d-flex overviews">
                                            <div className="price">
                                                <h6>Price</h6>
                                                <p>${assignment.fee}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="course-details-banner">
                                        <img src={assignment.image} className="img-fluid" alt="" style={{width: '100%'}} />
                                    </div>
                                    <div className="d-flex justify-content-center pb-3">
                                        {state === 'ongoing'?
                                        (
                                            <IsPayment to={`${process.env.PUBLIC_URL}/level/detail/${assignment._id}`} assignmentId={assignment._id} />
                                        ):
                                        state === 'rest'?
                                            <button type="button" className="start-btn" onClick={handleFavorite}>Favorite</button>:
                                            ''
                                        }
                                    </div>
                                    <div className="course-tab-list">
                                        <Tab.Container defaultActiveKey="overview">
                                            <Nav className="flex-column">
                                                <Nav.Item>
                                                    <Nav.Link eventKey="overview">Overview</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="curriculum">Curriculum</Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="overview" className="overview-tab">
                                                    {assignment.description &&
                                                        <SunEditor
                                                            defaultValue={assignment.description}
                                                            disable={true}
                                                            showToolbar={false}
                                                            setDefaultStyle="height: auto"
                                                        />
                                                    }
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="curriculum" className="curriculum-tab">
                                                    <div className="course-element">
                                                        <h5>Course Content</h5>
                                                        <CourseTabPart id={id} />
                                                    </div>
                                                </Tab.Pane>
                                            </Tab.Content>
                                        </Tab.Container>
                                    </div>
                                </div>
                            </Col>
                            <Col lg="3" md="4" sm="12">
                                <div className="single-details-sidbar">
                                    <Row>
                                        <Col md="12">
                                            <div className="course-details-feature">
                                                <h5 className="title">Course Details</h5>
                                                <ul className="list-unstyled feature-list">
                                                    <li><i className="las la-calendar"></i> Start Date: <span>{assignment.startDate}</span></li>
                                                    <li><i className="las la-clock"></i> Duration: <span>{assignment.Duration}</span></li>
                                                    <li><i className="las la-globe"></i> Language: <span>{assignment.language}</span></li>
                                                    <li><i className="las la-sort-amount-up"></i> Skill Level: <span>{assignment.skillLevel}</span></li>
                                                    <li><i className="las la-graduation-cap"></i> Subject: <span>{assignment.subject}</span></li>
                                                    <li><i className="las la-book"></i> Lectures: <span>{assignment.lectures}</span></li>
                                                    <li><i className="las la-bookmark"></i> Enrolled: <span>{assignment.enrolled}</span></li>
                                                </ul>
                                            </div>
                                        </Col>
                                    </Row>
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

export default CourseDetails