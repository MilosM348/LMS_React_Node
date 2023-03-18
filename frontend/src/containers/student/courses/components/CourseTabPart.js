import React, {useState, useEffect} from 'react'

import {useAsync} from '../../../../service/utils'
import {getByAssignmetId} from '../../../../api/part'
import CourseTabLevel from './CourseTabLevel'

const CourseTabPart = (props) => {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const {id}= props
    const [parts, setParts] = useState([])

    useEffect(() => {
        run(getByAssignmetId(id))
    }, [])
    useEffect(() => {
        if (status === 'resolved') {
            if (data.length !== 0)
                setParts(data)
        }
        else if (status === 'rejected') {
            console.log(error)
        }
    }, [status, run])
    return (
        <>
        {
            parts.map((item) => (
                <div className="course-item" key={item._id}>
                    <button className="course-button active">Part {item.name}: {item.title}</button>
                    <div className="course-content show">
                        <ul className="list-unstyled">
                            <CourseTabLevel id={item.id} />
                        </ul>
                    </div>
                </div>
            ))
        }
        </>
    )
}

export default CourseTabPart