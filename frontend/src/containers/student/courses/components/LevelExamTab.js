import React, {useEffect, useState} from 'react'
import { Row, Col } from 'react-bootstrap'
import {
    Grid, 
    Select,
    MenuItem,
    IconButton,
} from '@material-ui/core'  
import {ArrowBackIos, ArrowForwardIos} from '@material-ui/icons'
import SunEditor from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css'

import {useAsync} from '../../../../service/utils'
import {useSetting} from '../../../../provider/setting'
import {getBy as getExamPool, update as updateExamPool} from '../../../../api/exampool'
import {getFilter as getReplit} from '../../../../api/replit'
import ReplitCard from '../../../../components/ReplitCard'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};
const ExamTab = (props) => {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const {levelId} = props
    const [setting] = useSetting()
    const [examPool, setExamPool] = useState({})
    const [exam, setExam] = useState({})
    const [state, setState] = useState('')
    const [startTime, setStartTime] = useState('')
    const [time, setTime] = useState('')
    const [timeOut, setTimeOut] = useState(false)
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [asyncState, setAsyncState] = useState('')
    const handleStart = () => {
        const current = new Date()
        let tmp = {}
        tmp.id = examPool.id
        tmp.state = 'ongoing'
        tmp.startTime = current
        run(updateExamPool(tmp))
        setAsyncState('updateExamPool')
        setStartTime(current)
    }
    const handleSubmit = () => {
        let tmp = {}
        tmp.id = examPool.id
        tmp.state = 'submit'
        run(updateExamPool(tmp))
        setState('submit')
    }

    useEffect(() => {
        run(getReplit({userID: {eq: setting?.auth?.id}}))
        setAsyncState('getReplit')
        
        const interval = setInterval(function () {
            if (startTime !== '' && exam.time) {
                const current = new Date()
                const start = new Date(startTime)
                const dif = Math.ceil((current - start)/1000)
                const restTime = exam.time * 60 - dif
                let tmp = ''
                if (restTime > 0) {
                    tmp = `${Math.floor(restTime/60)} min ${restTime%60} s`
                }
                else {
                    tmp = '0 min 0 s'
                    if (!timeOut&&state === 'ongoing') {
                        setTimeOut(true)
                        clearInterval(interval)
                        let tmp = {}
                        tmp.id = examPool.id
                        tmp.state = 'timeout'
                        run(updateExamPool(tmp))
                        setState('timeout')
                    }
                }
                setTime(tmp)
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime, exam.time])
    useEffect(() => {
        if (status === 'resolved') {
            if (asyncState === 'getExamPool') {
                if (data.length !== 0) {
                    setExamPool(data[0])
                    setStartTime(data[0].startTime)
                    setExam(data[0].exam)
                    setState(data[0].state)
                }
                setAsyncState('')
            }
            else if (asyncState === 'getReplit') {
                if (data.length !== 0) {
                    setName(data[0].name)
                    setPassword(data[0].password)
                }
                run(getExamPool(levelId, setting?.auth?.id))
                setAsyncState('getExamPool')
            }
            else if (asyncState === 'updateExamPool') {
                setState('ongoing')
            }
        }
        else if (status === 'rejected') {
            console.log(error)
        }
    }, [status, run])
    return (
    <>
        {
            state === 'ongoing' ?
            <>
                {exam.description&&
                <>
                    <button type="button" className="start-btn float-right" onClick={handleSubmit}>Submit</button>
                    <div style={{color: 'red', padding: 10, fontSize: 18}}>{time}</div>
                    <div style={{padding: 10}}>User Name: {name}</div>
                    <div style={{padding: 10}}>Password: {password}</div>
                    <SunEditor
                        defaultValue={exam.description}
                        disable={true}
                        showToolbar={false}
                        setDefaultStyle="height: auto"
                    />
                    <ReplitCard code={exam.code} />
                </>
                }
            </>:
            state === 'pending' ?
            <>
                <button type="button" className="start-btn float-right" onClick={handleStart}>Start</button>
                <div>You have {exam.time} minutes to complete this programming</div>
            </>:''
        }
    </>
  )
}
export default ExamTab
