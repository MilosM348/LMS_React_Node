import React, { Fragment, useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import {
    Backdrop,
    CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Header from '../../../components/NavTwoStudent'
import { BreadcrumbBox } from '../../../components/common/Breadcrumb'
// import CourseSidebar from './components/CourseSidebar'
// import CourseItemGrid from './components/CourseItemsGrid'
import Footer from '../../../components/FooterTwo'
import { Styles } from './styles/course.js'
import CourseItem from '../../../components/CourseItem'
import { getAssignments } from '../../../api/student'
import {getBlocks} from '../../../api/block'
import {useAsync} from '../../../service/utils'
import {useSetting} from '../../../provider/setting'

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
}))
const CourseGrid = () => {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const [setting] = useSetting()
    const classes = useStyles()
    const [blocks, setBlocks] = useState([])
    const [ongoings, setOngoings] = useState([])
    const [completes, setCompletes] = useState([])
    const [rests, setRests] = useState([])
    const [pending, setPending] = useState(false)
    const [asyncState, setAsyncState] = useState('')
    const indexOf = (array, value) => {
        let res = -1
        array.forEach((item, index) => {
        if (item.assignmentID === value.id)
            res = index
        })
        return res
    }
    const createAssignment = (low) => {
        let res = low.map((item) => {
            let tmp = item
            if (indexOf(blocks, tmp) !== -1)
                tmp.block = true
            else 
                tmp.block = false
            tmp.ownerName = item?.owner?.name
            if (item?.parts)
                tmp.partLength = item?.parts?.length
            else
                tmp.partLength = 0
            return tmp
        })
        return res
    }

    useEffect(() => {
        if (setting.auth) {
            run(getBlocks(setting.auth.id))
            setPending(true)
            setAsyncState('getBlocks')
        }
    }, [run, setting.auth])
    useEffect(() => {
        if (status === 'resolved') {
            if (asyncState === 'getBlocks') {
                setBlocks(data)
                if (setting.auth) {
                    run(getAssignments(setting?.auth?._id, setting?.auth?.companyID))
                    setAsyncState('getAssignments')
                }
            }
            else if (asyncState === 'getAssignments') {
                console.log(data)
                setOngoings(createAssignment(data.ongoing))
                setCompletes(createAssignment(data.complete))
                setRests(createAssignment(data.rest))
                setPending(false)
            }
        }
        else if (status === 'rejected') {
            console.log(error)
            setPending(false)
        }
    }, [status])
    return (
        <div className="main-wrapper course-page">
            <Backdrop className={classes.backdrop} open={pending}>
                <CircularProgress color="primary" />
            </Backdrop>
            {/* Header 2 */}
            <Header />

            {/* Breadcroumb */}
            <BreadcrumbBox title="Courses" />

            <Styles>
                {/* Course Grid */}
                <section className="course-grid-area">
                    <Container>
                        <div className="course-items">
                            {completes.length !== 0 &&
                                <h4 style={{paddingBottom: 20}}>Complete Assignments</h4>
                            }
                            <Row>
                                <Fragment>
                                    {/* Course Item */}
                                    {
                                        completes.map((data, i) => (
                                            <CourseItem assignment={data} key={i} />
                                        ))
                                    }
                                </Fragment>
                            </Row>
                            {ongoings.length !== 0 &&
                                <h4 style={{paddingBottom: 20}}>Ongoing Assignments</h4>
                            }
                            <Row>
                                <Fragment>
                                    {/* Course Item */}
                                    {
                                        ongoings.map((data, i) => (
                                            <CourseItem assignment={data} key={i} />
                                        ))
                                    }
                                </Fragment>
                            </Row>
                            <h4 style={{paddingBottom: 20}}>Next Available Assignments</h4>
                            <Row>
                                <Fragment>
                                    {/* Course Item */}
                                    {
                                        rests.map((data, i) => (
                                            <CourseItem assignment={data} key={i} />
                                        ))
                                    }
                                </Fragment>
                            </Row>
                        </div>
                    </Container>
                </section>
            </Styles>

            {/* Footer 2 */}
            <Footer />

        </div>
    )
}

export default CourseGrid