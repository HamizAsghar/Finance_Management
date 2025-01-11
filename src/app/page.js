
import React from 'react'
import Account from './accounts/Account'
import PriceAlert from './priceAlert/priceAlert'
import HomePage from './home/page'

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
