import HeaderBox from '@/components/HeaderBox';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import React from 'react'

const Home = () => {

  const loggedIn = {
    firstName: 'Sergio',
    lastName: 'Torres',
    email: 'sergio.smiling@gmail.com'
  }

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type='greeting' 
            title='Welcome back!'
            user={loggedIn?.firstName || 'Guest'}
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
            {currentBalance: 245.000}, {currentBalance: 545.000}
          ]}
        />
    </section>
  )
}

export default Home;