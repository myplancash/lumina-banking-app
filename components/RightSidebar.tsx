import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BankCard from './BankCard'

const RightSidebar = ({user, transactions, banks}: RightSidebarProps) => {
  return (
    <aside className='right-sidebar'>
      <section className='flex flex-col pb-8'>
        <div className='profile-banner'/>
        <div className="profile">
          <div className="profile-img">
            <span className='text-5xl font-bold text-blue-500'>{user.firstName[0]}</span>
          </div>

          <div className="profile-details">
            <h3 className='profile-name'>{user.firstName} {user.lastName}</h3>
            <p className='profile-email'>{user.email}</p>
          </div>
        </div>
      </section>

      <section className='banks'>
        <div className='w-full flex justify-between'>
          <h2 className='header-2'>Banks</h2>
          <Link  
            href='/'
            className='flex gap-2'
          >
            <Image 
              src='/icons/plus.svg'
              alt='Add bank'
              width={20}
              height={20}  
            />
            <h2 className='text-14 font-semibold text-gray-600'>Add Bank</h2>
          </Link>
        </div>
        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className='realtive z-10'>
              <BankCard
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user.firstName} ${user.lastName}`}
                showBalance={false}
              />
            </div>
            {banks[1] && ( // if we have 2 different cards
              <div className='absolute right-0 top-8 z-0 w-[90%]'>
                <BankCard
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user.firstName} ${user.lastName}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}
        
      </section>
    </aside>
  )
}

export default RightSidebar