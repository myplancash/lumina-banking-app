import HeaderBox from '@/components/HeaderBox';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

const Home = async () => {

  const loggedIn = await getLoggedInUser()

  /* const loggedIn = {
    name: 'Sergio',
    lastName: 'Torres',
    email: 'sergio.smiling@gmail.com'
  } */

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type='greeting' 
            title='Welcome back!'
            user={loggedIn?.name || 'Guest'}
            subtext="Access and manage your account afficiently"
          />
          <TotalBalanceBox 
            accounts={[]}
            totalBanks={0}
            totalCurrentBalance={1256000} 
          />
        </header>
      </div>
        {/* TRANSACTIONS */}
         <RightSidebar
          user={loggedIn}
          transactions={[]}
          banks={[
            {currentBalance: 245.000},
            {currentBalance: 545.000}
          ]}
        />
    </section>
  )
}

export default Home;