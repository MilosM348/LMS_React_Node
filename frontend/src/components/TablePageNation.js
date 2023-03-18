import React from 'react'
import {IconButton} from '@material-ui/core'
import {ArrowBackIos, ArrowForwardIos} from '@material-ui/icons'

const TablePageNation = (props) => {
  const {enablePrev, enableNext, handlePrev, handleNext, ...rest} = props
  return (
    <div style={{float: 'right'}} {...rest}>
      {!enablePrev?
      (
        <IconButton aria-label="detail" disabled>
          <ArrowBackIos />
        </IconButton>
        ):(
        <IconButton aria-label="detail" onClick={(e) => handlePrev()}>
          <ArrowBackIos />
        </IconButton>
        )
      }
      {!enableNext?
        (
          <IconButton aria-label="detail" disabled>
            <ArrowForwardIos />
          </IconButton>
        ):(
          <IconButton aria-label="detail" onClick={(e) => handleNext()}>
            <ArrowForwardIos />
          </IconButton>
        )
      }
    </div>
  )
}
export default TablePageNation