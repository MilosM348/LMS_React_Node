import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

import {useAsync} from '../../../../service/utils'
import {getByPartId} from '../../../../api/level'

const CourseTabLevel = (props) => {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const {id}= props
    const [levels, setLevels] = useState([])

    useEffect(() => {
        run(getByPartId(id))
    }, [])
    useEffect(() => {
        if (status === 'resolved') {
            if (data.length !== 0)
                setLevels(data)
        }
        else if (status === 'rejected') {
            console.log(error)
        }
    }, [status, run])
    return (
        <>
        {
            levels.map((item) => (
                <li key={item._id}>
                    <span className="play-icon"><i className="las la-play"></i> Lecture: {item.name}</span>
                    <span className="lecture-title">
                        {item.title}
                    </span>
                </li>
            ))
        }
        </>
    )
}

export default CourseTabLevel