import HeaderBox from '@/components/HeaderBox'
// import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
// import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
 /*  const accounts = await getAccounts({ 
    userId: loggedIn.$id 
  })
 */
  /* if(!accounts) return;
  
  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId }) */

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox 
            type="greeting"
            title="Welcome"
            user={loggedIn?.name || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          {/* <TotalBalanceBox 
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          /> */}
        </header>

        {/* <RecentTransactions 
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        /> */}
      </div>

      <RightSidebar 
        user={loggedIn}
        transactions={[]}
        banks={[
          {
            name: 'Bank of America',
            currentBalance: 1000,
            mask: '1234',
            $id: '1234',
            appwriteItemId: '1234'
          },
          {
            name: 'Chase Bank',
            currentBalance: 2000,
            mask: '5678',
            $id: '5678',
            appwriteItemId: '5678'
          }
        ]}
      />
    </section>
  )
}

export default Home