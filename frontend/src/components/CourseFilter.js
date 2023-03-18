import React, { useEffect, useState } from 'react'
import Datas from '../data/course/filter.json'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { Styles } from "./styles/courseFilter.js"
import CourseItem from './CourseItem'
import {getFilter as getAssignments} from '../api/assignment'
import {getAll as getAllSubjects} from '../api/subject'
import {useAsync} from '../service/utils'
import {useSetting} from '../provider/setting'

function CourseFilter() {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const [setting] = useSetting()
    const [assignments, setAssignments] = useState([])
    const [subjects, setSubjects] = useState([])
    const [asyncState, setAsyncState] = useState('')

    useEffect(() => {
        run(getAssignments({activate: true}))
        setAsyncState('assignment')
    }, [run])
    useEffect(() => {
        if (status === 'resolved') {
            if (asyncState === 'assignment') {
                let assignments = data.map((item) => {
                let res = item
                res.owner = item?.owner?.name
                if (item?.parts)
                    res.part = item?.parts?.length
                else
                    res.part = 0
                return res
                })
                setAssignments(assignments)
                run(getAllSubjects())
                setAsyncState('subject')
            }
            else if (asyncState === 'subject') {
                setSubjects(data)
                setAsyncState('')
            }
        }
        else if (status === 'rejected') {
            console.log(error)
        }
    }, [status])
    useEffect(() => {
        const buttons = document.querySelector(".filter-btn-list").children
        const items = document.querySelector(".filter-items").children

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", function () {

                for (let j = 0; j < buttons.length; j++) {
                    buttons[j].classList.remove("active")
                }

                this.classList.add("active")
                const target = this.getAttribute("data-target");

                for (let k = 0; k < items.length; k++) {
                    items[k].style.display = "none"

                    if (items[k].getAttribute("data-id") === target) {
                        items[k].style.display = "block"
                    }

                    if (target === "*") {
                        items[k].style.display = "block"
                    }
                }
            })
        }
    });

    return (
        <Styles>
            {/* Course Area */}
            <section className="course-filter">
                <Container>
                    <Row>
                        <Col md="12">
                            <div className="sec-title text-center">
                                <h4>{Datas.secTitle}</h4>
                            </div>
                        </Col>
                        <Col md="12">
                            <div className="filter-btns text-center">
                                <ul className="filter-btn-list list-unstyled list inline">
                                    <li data-target="*" className="active list-inline-item">All Courses</li>
                                    {
                                        subjects.map((item) => (
                                            <li data-target={item.name} className="list-inline-item" key={item._id}>{item.name}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                            <Row className="filter-items">
                                {
                                    assignments.map((data, i) => (
                                        <CourseItem data-id={data.subject} assignment={data} key={i} />
                                    ))
                                }
                            </Row>
                        </Col>
                        {setting.auth && 
                            <Col md="12" className="text-center">
                                <div className="viewall-btn">
                                    <Link to={process.env.PUBLIC_URL + "/course"}>View All Courses</Link>
                                </div>
                            </Col>
                        }
                    </Row>
                </Container>
            </section>
        </Styles>
    )
}

export default CourseFilter
