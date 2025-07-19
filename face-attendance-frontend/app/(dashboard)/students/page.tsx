import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function Students() {
  return (
    <div>
      <div className='flex items-center justify-between'>
        <h3 className='text-2xl font-semibold'>List Students</h3>
        <Link href='/students/create'>
          <Button>Add Student</Button>
        </Link>
      </div>
    </div>
  )
}
