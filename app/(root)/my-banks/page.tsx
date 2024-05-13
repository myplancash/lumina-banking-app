import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

type User = {
  $id: string;
  firstName: string;
  // Define the rest of the user properties here
};

type MyBanksProps = {
  accounts: {
    data: Account[];
    // Define the rest of the accounts properties here
  };
  loggedIn: User;
};

const MyBanks: React.FC<MyBanksProps> = ({ accounts, loggedIn }) => {
  return (
    <section className='flex'>
      <div className="my-banks">
        <HeaderBox 
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activites."
        />

        <div className="space-y-4">
          <h2 className="header-2">
            Your cards
          </h2>
          <div className="flex flex-wrap gap-6">
            {accounts && accounts.data.map((a: Account) => (
              <BankCard 
                key={a.id}
                account={a}
                userName={loggedIn?.firstName}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export async function getServerSideProps() {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ 
    userId: loggedIn.$id 
  })

  return {
    props: {
      accounts,
      loggedIn
    }
  }
}

export default MyBanks