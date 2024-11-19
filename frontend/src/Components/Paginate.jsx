import { Pagination, Stack } from '@mui/material'
import React from 'react'

const Paginate = ({ perPage }) => {
  return (
    <div className='fixed bottom-0 left-0 w-[80%] bg-white'>
        <Stack>
        <Pagination count={perPage}/>
        </Stack>
    </div>
  )
}

export default Paginate