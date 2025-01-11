import HomePage from '@/Components/HomePage'
import React from 'react'
import Account from './accounts/Account'
import PriceAlert from './priceAlert/priceAlert'

const page = () => {
  return (
    <>
      <HomePage/>
      <Account/>
      <PriceAlert/>
    </>
  )
}

export default page
