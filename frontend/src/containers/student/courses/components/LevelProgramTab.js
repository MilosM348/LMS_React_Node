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
import {getFilter as getPrograms} from '../../../../api/program'
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
const ProgramTab = (props) => {
    const {data, status, error, run} = useAsync({
        status: 'idle',
    })
    const {levelId} = props
    const [setting] = useSetting()
    const [program, setProgram] = useState('')
    const [programs, setPrograms] = useState([])
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [asyncState, setAsyncState] = useState('')

    const handleChangeProgram = (e) => {
        const index = e.target.value
        setProgram(index)
    }

    useEffect(() => {
        if (setting.auth) {
            run(getReplit({userID: setting?.auth?._id}))
            setAsyncState('getReplit')
        }
    }, [setting])
    useEffect(() => {
        if (status === 'resolved') {
            if (asyncState === 'getPrograms') {
                console.log(data)
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
                    setPrograms(data)
                    setProgram(0)
                }
                setAsyncState('')
            }
            else if (asyncState === 'getReplit') {
                if (data.length !== 0) {
                    setName(data[0].name)
                    setPassword(data[0].password)
                }
                run(getPrograms({levelID: levelId}))
                setAsyncState('getPrograms')
            }
        }
        else if (status === 'rejected') {
            console.log(error)
        }
    }, [status, run])
    return (
    <>
        <div style={{padding: 10}}>User Name: {name}</div>
        <div style={{padding: 10}}>Password: {password}</div>
        <Grid container spacing={3}>
            <Grid item lg={3} md={4} sm={6} xs={12}>
                <Select
                    style={{width: '100%', textAlign: 'center', marginBottom: 10}}
                    value={program}
                    onChange={handleChangeProgram}
                    MenuProps={MenuProps}
                >
                {programs.map((item, index) => (
                    <MenuItem key={item._id} value={index} style={{}}>
                        Program {item.name}
                    </MenuItem>
                ))}
                </Select>
            </Grid>
        </Grid>
        {
            programs.map((item, index) => (
                index === program &&
                <div key={index}>
                    <SunEditor
                        defaultValue={item.description}
                        disable={true}
                        showToolbar={false}
                        setDefaultStyle="height: auto"
                    />
                    <ReplitCard code={item.code} />
                </div>
            ))
        }
    </>
  )
}
export default ProgramTab
