import React, { useEffect, useState } from 'react'

import FileAttach from './FileAttach'

function CommentForm(props) {
  const { submit } = props
  const [description, setDescription] = useState('')

  const handleUpload = (filenames) => {
    filenames.map((item) => {
      submit({
        description: item.name,
        isFile: true,
        fileUrl: item.url,
      })
    })
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (description !== "") {
        submit({
          isFile: false,
          description: description,
        });
        setDescription('')
      }
    }
  }

  return (
    <div className="message-form">
      <input onChange={(e) => setDescription(e.target.value)} onKeyDown={handleKeyDown} value={description} />
      <FileAttach className="attach-file" callback={handleUpload} style={{paddingTop: 10}} />
    </div>
  )
}

export default CommentForm