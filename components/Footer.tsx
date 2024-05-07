import Image from 'next/image'
import React from 'react'

const Footer = ({ user, type }: FooterProps) => {
  return (
    <footer className='footer'>
      <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
        <p className='text-xl font-semibold text-gray-700'>
          {user.name[0]}
        </p>
      </div>  

      <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
        <h1 className='text-14 font-normal truncate text-gray-600'>
          {user.name}
        </h1>
        <p className='text-14 truncate font-normal text-gray-600'>{user.email}</p>
      </div>

      <div className='footer_image'>
        <Image
          src='icons/logout.svg'
          alt="user avatar"
          fill
          className='rounded-full'
        />
      </div>
    </footer>
  )
}

export default Footer