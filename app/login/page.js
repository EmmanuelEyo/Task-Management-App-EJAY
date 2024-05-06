"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import '../chatlify/index.css'

const Login = () => {
  const { user, handleUserLogin } = useAuth()
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if(user) {
      router.replace('/')
    }
  }, [router, user])

  const handleInputChange = (e) => {
    let name = e.target.name
    let value = e.target.value
    
    setCredentials({...credentials, [name]:value})
  }
  return (
      <div className='auth--container'>
        <div className='form--wrapper'>
          <form onSubmit={e => {
            handleUserLogin(e, credentials)
          }}>
            <div className='field--wrapper'>
              <label>Email:</label>
              <input type='email' required name='email' placeholder='Enter your email...' value={credentials.email} onChange={handleInputChange} />
            </div>
            <div className='field--wrapper'>
              <label>Password:</label>
              <input type='password' required name='password' placeholder='Enter password...' value={credentials.password} onChange={handleInputChange} />
            </div>
            <div className='field-wrapper'>
              <input type='submit' value='Login' className='btn btn--lg btn--main' />
            </div>
          </form>

          <p>Don&apos;t have an account? Register <Link href='/register'>here</Link></p>
        </div>
      </div>
  )
}

export default Login