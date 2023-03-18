import React from 'react'
import {AttachFile} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import {upload} from '../../../../api/file'

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: 'sans-serif',
    textAlign: 'center',
  },
  uploadLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: 15,
  },
  uploadInput: {
    display: 'none'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}))
const CommentFileAttach = (props) => {
  const {callback, ...rest} = props
  const classes = useStyles()

  const onChange = async (e) => {
    let files = [...e.target.files]
    if (files.length !== 0) {
      let filenames = await Promise.all(files.map( async (file) => {
        let result = await upload(file)
        return {
          name: file.name,
          url: result.url,
        }
      }))
      callback(filenames);
    }
  }
  return (
    <div {...rest}>
      <label className={classes.uploadLabel}>
        <input className={classes.uploadInput} multiple type="file" onChange={onChange} />
        <AttachFile />
      </label>
    </div>
  )
}
export default CommentFileAttach
