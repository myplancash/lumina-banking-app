import HeaderBox from '@/components/HeaderBox';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import React from 'react'

const Home = () => {

  const loggedIn = { firstName: 'Sergio' }

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
    </section>
  )
}

export default Home;