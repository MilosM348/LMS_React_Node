import React, { useEffect, useState } from 'react';
import Datas from '../data/faq-event/faq-event.json';
import { Col } from 'react-bootstrap';
import {getAll} from '../api/settingEvent'
import {useAsync} from '../service/utils'
import {getMonth} from '../service/string'

function Event() {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const [datas, setDatas] = useState([])

    useEffect(() => {
        run(getAll())
    }, [run])
    useEffect(() => {
        if (status === 'resolved') {
            if (data.length !== 0) {
                setDatas(data)
            }
        }
        else if (status === 'rejected') {
            console.log(error)
        }
    }, [status])
    return (
        <Col md="12">
            {
                datas.map((eventData, i) => (
                    <div className="event-box d-flex" key={i}>
                        <div className="event-date text-center">
                            <p>{`${eventData.day} ${getMonth(eventData.month)}`}</p>
                        </div>
                        <div className="event-details">
                            <h6>{eventData.title}</h6>
                            <ul className="list-unstyled list-inline">
                                <li className="list-inline-item"><i className="las la-clock"></i>{`${eventData.startTime} - ${eventData.endTime}`}</li>
                                <li className="list-inline-item"><i className="las la-map-marker"></i>{eventData.location}</li>
                            </ul>
                            <p>{eventData.description}</p>
                        </div>
                    </div>
                ))
            }
        </Col>
    )
}
export default Event