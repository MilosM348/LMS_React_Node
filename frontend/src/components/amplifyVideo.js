import React, {useEffect, useState} from 'react'
import {getUrl} from '../api/file'
import {useAsync} from '../service/utils'

const AmplifyVideo = (props) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const {videoKey, style} = props
  const [src, setSrc] = useState('')

  useEffect(() => {
    if (videoKey !== '')
      run(getUrl(videoKey))
  }, [run, videoKey])
  useEffect(() => {
    if (status === 'resolved') {
      setSrc(data)
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [status, data])
  return (
    <>
    {videoKey !== ''&&
      <video src={src} style={style} controls></video>
    }
    </>
  )
}
export default AmplifyVideo
