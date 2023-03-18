import React, {useState, useEffect} from 'react'
import { Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {Block} from '@material-ui/icons'

import {getUrl} from '../api/file'
import {useAsync} from '../service/utils'

const CourseItem = (props) => {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const {assignment} = props
    const [src, setSrc] = useState('')
    const [block, setBlock] = useState(false)
    const [defineBlock, setDefineBlock] = useState(false)
    useEffect(() => {
        console.log('assignment', assignment)
        console.log(assignment.block)
        if (!assignment.hasOwnProperty('block')) {
            setBlock(true)
            setDefineBlock(false)
        }
        else {
            setDefineBlock(true)
            setBlock(assignment.block)
        }
    }, [assignment])
    const BlockLink = ({children, isLink, ...rest}) => {
        return (
            <>
            {isLink?
                (<Link {...rest}>
                    {children}
                </Link>):
                children
            }
            </>
        )
    }

    return (
        <Col lg="4" md="6" sm="12" data-id={assignment.subject}>
            <div className="course-item">
                <BlockLink isLink={!block} to={`${process.env.PUBLIC_URL}/course/detail/${assignment._id}`}>
                    <div className="course-image" style={{ backgroundImage: `url(${assignment.image})` }}>
                        <div className="course-price">
                            <p>{assignment.fee}</p>
                        </div>
                        {block&&defineBlock&&
                        <div style={{paddingLeft: 10, paddingTop: 10}}>
                            <Block color="secondary" fontSize="large" />
                        </div>
                        }
                    </div>
                </BlockLink>
                <div className="course-content">
                    <h6 className="heading">
                        <BlockLink isLink={!block} to={`${process.env.PUBLIC_URL}/course/detail/${assignment._id}`}>
                            {assignment.name}
                        </BlockLink>
                    </h6>
                    {/* <p className="desc">{assignment.description}</p> */}
                    <div className="course-face d-flex justify-content-between">
                        <div className="duration">
                            <p><i className="las la-clock"></i>{assignment.lectures}</p>
                        </div>
                        <div className="rating">
                            <ul className="list-unstyled list-inline">
                                <li className="list-inline-item"><i className="las la-star"></i></li>
                                <li className="list-inline-item"><i className="las la-star"></i></li>
                                <li className="list-inline-item"><i className="las la-star"></i></li>
                                <li className="list-inline-item"><i className="las la-star"></i></li>
                                <li className="list-inline-item"><i className="las la-star-half-alt"></i>
                                </li>
                                <li className="list-inline-item">({assignment.review})</li>
                            </ul>
                        </div>
                        <div className="student">
                            <p><i className="las la-chair"></i>{assignment.studentNumber}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Col>
    )
}
export default CourseItem
