import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // const loggedIn = {first Name: 'Sergio', lastName: 'Torres'}; mock for start it hardcoded
  const loggedIn = await getLoggedInUser()
  
  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} /> 

      <div className="flex flex-col size-full">
        <div className="root-layout">
          <Image 
            src={"/icons/logo.svg"}
            height={30}
            width={30 }
            alt="menu icon"
          />
          <div>
            <MobileNav user={loggedIn} />
          </div> 
        </div>
        {children}
      </div>
    </main>
  );
}
