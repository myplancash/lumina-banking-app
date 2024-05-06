'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/actions/user.actions'

const AuthForm = ({type}: {type: string}) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const formSchema = authFormSchema(type)
  const router = useRouter()



  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ''
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      // sing up with Appwrite & create plaid link token, for linkiing our bank account

      if(type === 'sign-up') {
        const newUser = await signUp(data)
        setUser(newUser)
      }
      if(type === 'sign-in') {
        const response = signIn({
          email: data.email,
          password: data.password
        })

        if(response) router.push('/')
      }
      console.log(data)


    } catch(error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <section className='auth-form'>
      <header className='flex flex-col gap-5 md:gap-8'>
        <Link  href="/" className="cursor-pointer flex items-center gap-1">
          <Image 
            src="/icons/logo.svg"
            width={34}
            height={ 34}
            alt="Lumina logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Lumina</h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
            {user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </h1>
          <p className='text-16 font-normal text-gray-600 '>
            {
              user ? 'Link your account to get started' : 'Please enter your details'
            }
          </p>
        </div>
      </header>
      {user ? (
        <div className='flex flex-col gap-4'>
          {/* <p>Plaid Link</p> */}
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               {type === 'sign-up' && (
                  <>
                  <div className='flex gap-4'>
                    <CustomInput
                      control={form.control}
                      name='firstName'
                      label='First Name'
                      placeholder='enter your first name'
                    />
                    <CustomInput
                      control={form.control}
                      name='lastName'
                      label='Last Name'
                      placeholder='enter your last name'
                    />
                  </div>
                    <CustomInput
                      control={form.control}
                      name='address1'
                      label='Address'
                      placeholder='enter your specific address'
                    />
                    <CustomInput
                      control={form.control}
                      name='city'
                      label='City'
                      placeholder='enter your City'
                    />
                    <div className='flex gap-4'>
                      <CustomInput
                        control={form.control}
                        name='state'
                        label='State'
                        placeholder='ex NY'
                      />
                      <CustomInput
                        control={form.control}
                        name='postalCode'
                        label='Postal Code'
                        placeholder='ex: 11101'
                      />
                    </div>
                    <div className='flex gap-4'>
                      <CustomInput
                        control={form.control}
                        name='dataOfBirth'
                        label='Date of Birth'
                        placeholder='yyy-mm-dd'
                      />
                      <CustomInput
                        control={form.control}
                        name='ssn'
                        label='SSN'
                        placeholder='ex: 1234'
                      />
                    </div>
                  </>
               )}
                <CustomInput
                  control={form.control}
                  name='email'
                  label='Email'
                  placeholder='enter your email'
                />
                <CustomInput 
                  control={form.control}
                  name='password'
                  label='Password'
                  placeholder='enter your password'
                />
              <div className='flex flex-col gap-4'>  
                <Button
                  disabled={isLoading}
                  type="submit" 
                  className='form-btn border rounded-lg border-black-1'>
                  {isLoading ? (
                  <>
                    <Loader2
                      size={20}
                      className='animate-spin'
                    />&nbsp; Loading...
                  </> 
                  ) : (type === 'sign-in' ? 'Sign In' : 'Sign Up')}
                </Button>
              </div>
            </form>
          </Form> 
          <footer className='flex justify-center gap-1'>
            <p className='text-14 font-normal text-gray-600 '>
              {
                type === 'sign-in' ? 
                "Don't have an account?" :
                'Already have an account?'
              }
            </p>
            <Link 
              className='form-link'
              href={type === 'sign-in' ? '/sign-up' : '/sign-in'}>
              {type === 'sign-up' ? 'Sign In' : 'Sign Up'}
            </Link>
          </footer>
        </>
      )
      }
    </section>
  )
}

export default AuthForm 