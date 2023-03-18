import React, {useState, useEffect} from 'react'

import MultiFileUpload from '../../../../components/multiFileUpload'
import {useAsync} from '../../../../service/utils'
import {useSetting} from '../../../../provider/setting'
import {upload} from '../../../../api/file'
import {create} from '../../../../api/notification'
import {setState} from '../../../../api/level'
import { Styles } from '../styles/upload.js'

const UploadForm = (props) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const [setting] = useSetting()
  const {assignmentId, levelId, assignmentStudent, refresh} = props
  const [files, setFiles] = useState([])
  const [asyncState, setAsyncState] = useState(0)

  const validate = () => {
    let res = true
    if (files.length === 0)
      res = false
    return res
  }
  const handleUpload = async () => {
    if (!validate())
      return
    if (files.length !== 0) {
      let filenames = await Promise.all(files.map( async (file) => {
        let result = await upload(file)
        return {
          name: file.name,
          url: result.url,
        }
      }))
      const notification = {
        assignmentID: assignmentId,
        companyID: setting?.auth?.companyID,
        studentID: setting.auth._id,
        levelID: levelId,
        files: filenames,
        state: "pending",
      };
      run(create(notification));
      setAsyncState("create");
    }
  }
  const changeFiles = (files) => {
    setFiles(files)
  }

  useEffect(() => {
    if (status === 'resolved') {
      if (asyncState === 'create') {
        let tmp = {}
        tmp._id = assignmentStudent._id
        tmp.assignmentID = assignmentStudent.assignmentID
        tmp.studentID = assignmentStudent.studentID
        tmp.levelID = assignmentStudent.levelID
        tmp.levelState = 'evaluating'
        tmp.state = assignmentStudent.state
        run(setState(tmp))
        setAsyncState('setState')
      }
      else if (asyncState === 'setState') {
        refresh()
      }
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [run, status])
  return (
    <Styles>
        <MultiFileUpload label={'Upload Files'} changeFiles={changeFiles} />
        <div className="d-flex justify-content-center">
            <button onClick={handleUpload} color="primary">
                Upload
            </button>
        </div>
    </Styles>
  )
}
export default UploadForm
