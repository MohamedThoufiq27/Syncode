import React, { Children } from 'react'
import { Popup } from './Popup'

const Overlay = ({children}) => {
  return (
    <div className='flex justify-center items-center bg-gray-900 w-screen h-screen absolute opacity-70 z-40'>
        {children}
    </div>
  )
}

export default Overlay