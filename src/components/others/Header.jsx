import React from 'react'

const Header = (props) => {
  return (
    <div className='items-end justify-between flex text-white px-5'>
      <h1 className='text-2xl font-medium'>
        Hello <br />
        <span className='text-3xl font-semibold'>
          {props.data?.firstName} 👋
        </span>
      </h1>

      <button
        onClick={() => {
          localStorage.removeItem('loggedInUser')
          props.changeUser(null)
        }}
        className='bg-red-600 text-lg font-medium px-5 py-2 rounded-xl'
      >
        Log Out
      </button>
    </div>
  )
}

export default Header