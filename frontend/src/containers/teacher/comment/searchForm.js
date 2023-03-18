import React, { useEffect, useState } from 'react'
import {
  Grid, 
  Select,
  MenuItem,
} from '@material-ui/core'

import {getFilter as getAssignments} from '../../../api/assignment'
import {getStudents} from '../../../api/student'
import {getByAssignmetId} from '../../../api/part'
import { useAsync } from '../../../service/utils'
import { useSetting } from '../../../provider/setting'

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
const SearchForm = (props) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const { refresh } = props
  const [setting] = useSetting()
  const [assignments, setAssignments] = useState([])
  const [assignment, setAssignment] = useState('')
  const [students, setStudents] = useState([])
  const [student, setStudent] = useState('')
  const [parts, setParts] = useState([])
  const [part, setPart] = useState(0)
  const [level, setLevel] = useState('')
  const [asyncState, setAsyncState] = useState('')

    const handleChangeAssignment = (event) => {
      const assignmentId = event.target.value
      setAssignment(assignmentId)
      run(getStudents(assignmentId))
      setAsyncState('getStudents')
    }
    const handleChangeStudent = (event) => {
      const studentId = event.target.value
      setStudent(studentId)
      refresh(studentId, level)
    }
    const handleChangePart = (event) => {
      const partId = event.target.value
      setPart(partId)
      if (data[partId].levels.length !== 0) {
        const levelId = data[partId].levels[0].id
        setLevel(levelId)
        refresh(student, levelId)
      }
    }
    const handleChangeLevel = (event) => {
      const levelId = event.target.value
      setLevel(levelId)
      refresh(student, levelId)
    }

    useEffect(() => {
      run(getAssignments({ownerID: setting?.auth?._id}))
      setAsyncState('getAssignments')
    }, [run])
    useEffect(() => {
      if (status === 'resolved') {
        if (asyncState === 'getAssignments') {
          console.log(data)
          setAssignments(data)
          if (data.length !== 0) {
            setAssignment(data[0]._id)
            run(getStudents(data[0]._id))
            setAsyncState('getStudents')
          }
        }
        else if (asyncState === 'getStudents') {
          setStudents(data)
          if (data.length !== 0) {
            setStudent(data[0]._id)
          }
          run(getByAssignmetId(assignment))
          setAsyncState('getPart')
        }
        else if (asyncState === 'getPart') {
          setParts(data)
          if (data.length !== 0) {
            setPart(0)
            if (data[0].levels.length !== 0) {
              const levelId = data[0].levels[0]._id
              setLevel(levelId)
              refresh(student, levelId)
            }
          }
        }
      }
      else if (status === 'rejected') {
      console.log(error)
      }
    }, [run, status])

    return (
        <Grid container spacing={3}>
            <Grid item md={3} sm={6} xs={12}>
                <Select
                  style={{width: '100%', textAlign: 'center', marginBottom: 10}}
                  value={assignment}
                  onChange={handleChangeAssignment}
                  MenuProps={MenuProps}
                >
                  {assignments.map((item) => (
                  <MenuItem key={item._id} value={item._id} style={{}}>
                      {item.name}
                  </MenuItem>
                  ))}
                </Select>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
                <Select
                    style={{width: '100%', textAlign: 'center', marginBottom: 10}}
                    value={student}
                    onChange={handleChangeStudent}
                    MenuProps={MenuProps}
                >
                    {students.map((item) => (
                    <MenuItem key={item._id} value={item._id} style={{}}>
                        {item.name}
                    </MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
                <Select
                    style={{width: '100%', textAlign: 'center', marginBottom: 10}}
                    value={part}
                    onChange={handleChangePart}
                    MenuProps={MenuProps}
                >
                    {parts.map((item, index) => (
                    <MenuItem key={index} value={index} style={{}}>
                        {'Part ' + item.name}
                    </MenuItem>
                    ))}
                </Select>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
                <Select
                    style={{width: '100%', textAlign: 'center', marginBottom: 10}}
                    value={level}
                    onChange={handleChangeLevel}
                    MenuProps={MenuProps}
                >
                    {parts.length !== 0 &&
                    parts[part].levels.map((item) => (
                    <MenuItem key={item._id} value={item._id} style={{}}>
                        {'Level ' + item.name}
                    </MenuItem>
                    ))
                    }
                </Select>
            </Grid>
        </Grid>
    )
}

export default SearchForm