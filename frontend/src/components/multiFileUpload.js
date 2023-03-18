import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {CloudUpload} from '@material-ui/icons'

const useStyles = makeStyles({
  root: {
    fontFamily: 'sans-serif',
    textAlign: 'center',
  },
  uploadLabel: {
    border: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: 15,
  },
  uploadInput: {
    display: 'none'
  },
  uploadPreview: {
    margin: '0 10px',
  }
})
const MultiFileUpload = (props) => {
  const {label, changeFiles} = props
  const classes = useStyles()
  const [files, setFiles] = useState([])

  const onChange = (e) => {
    const tmp = [...files, ...e.target.files]
    setFiles(tmp)
    changeFiles(tmp)
  }
  return (
    <div className={classes.root}>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <label className={classes.uploadLabel}>
          <input className={classes.uploadInput} multiple type="file" onChange={onChange} />
          <CloudUpload style={{paddingRight: 10, fontSize: 30}} /> {label}
        </label>
      </div>
      <div style={{padding: 10}}>
        {files.map((file, index) => (
          <div className={classes.uploadPreview} key={index}>{file?.name}</div>
          ))
        }
      </div>
    </div>
  )
}
export default MultiFileUpload
