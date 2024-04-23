import React from 'react'
import '../css/loader.css'

const Loading = ({ containerStyle }) => {
  return (
    <div className={`${containerStyle}`}>
      <div className='loader'></div>
    </div>
  )
}

export default Loading