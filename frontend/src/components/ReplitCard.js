import React, {useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  IconButton
} from '@material-ui/core'
import {
  Fullscreen,
  FullscreenExit,
} from '@material-ui/icons'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  fullscreen: {
    position: 'fixed',
    zIndex: 9999,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  common: {
    height: 500
  },
}))
const ReplitCard = (props) => {
  const classes = useStyles()
  const {code} = props
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [frameClass, setFrameClass] = useState('')

  const clickFullscreen = () => {
    setIsFullscreen(true)
  }
  const clickFullscreenExit = () => {
    setIsFullscreen(false)
  }

  useEffect(() => {
    if (isFullscreen) {
      setFrameClass(classes.fullscreen)
    }
    else {
      setFrameClass(classes.common)
    }
  }, [isFullscreen])
  return (
    <>
      <div className={frameClass}>
        <div style={{backgroundColor: 'white', height: 45}}>
          {!isFullscreen?
          (<IconButton aria-label="fullscreen" onClick={clickFullscreen} style={{float: 'right'}}>
              <Fullscreen />
            </IconButton>):
          (<IconButton aria-label="fullscreen" onClick={clickFullscreenExit} style={{float: 'right'}}>
            <FullscreenExit />
          </IconButton>)
          }
        </div>
        {code &&
          <iframe width="100%" height="100%" src={`${code}?lite=true`}></iframe>
        }
      </div>
    </>
  )
}
export default ReplitCard