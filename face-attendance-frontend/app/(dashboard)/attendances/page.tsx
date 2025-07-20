import Link from 'next/link'

// Import Shadcn UI Components
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PlusCircle } from 'lucide-react'
import { Attendance } from '@/lib/types/attendance.types'
import { getAttendances } from '@/actions/attendance.actions'

/**
 * Formats a UTC timestamp string into a more readable local date and time format.
 * @param dateString - The ISO 8601 timestamp string from Supabase.
 * @returns A formatted string e.g., "7/20/2025, 2:02 PM".
 */
function formatCheckinTime(dateString: string): string {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * ListAttendancePage is a Next.js Server Component that fetches and displays a list of attendances.
 * Being a server component, it can directly call async server actions to get data.
 */
export default async function ListAttendancePage() {
  // Fetch data directly on the server before rendering.
  // This is a powerful feature of Next.js App Router.
  let attendances: Attendance[] = []
  let fetchError: string | null = null

  try {
    attendances = await getAttendances()
  } catch (error: any) {
    console.error('Failed to fetch attendances:', error)
    fetchError =
      error.message || 'An unknown error occurred while fetching data.'
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-900'>
      <div className='mx-auto max-w-4xl'>
        <Card>
          <CardHeader>
            <CardTitle>Attendance List</CardTitle>
            <CardDescription>
              A list of all students attendance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fetchError ? (
              <div className='rounded-md bg-red-50 px-4 py-10 text-center dark:bg-red-900/20'>
                <p className='font-semibold text-red-600 dark:text-red-400'>
                  Failed to load attendance data.
                </p>
                <p className='mt-1 text-sm text-red-500 dark:text-red-500'>
                  {fetchError}
                </p>
              </div>
            ) : (
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='hidden w-[25%] sm:table-cell'>
                        Attendance ID
                      </TableHead>
                      <TableHead className='w-[40%]'>Student Name</TableHead>
                      <TableHead className='w-[35%] text-right'>
                        Attended At
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendances.length > 0 ? (
                      attendances.map((attendance) => (
                        <TableRow key={attendance.id}>
                          <TableCell className='hidden font-mono text-xs text-gray-500 sm:table-cell dark:text-gray-400'>
                            {attendance.id}
                          </TableCell>
                          <TableCell className='font-medium'>
                            {attendance.students.name}
                          </TableCell>
                          <TableCell className='text-right text-sm text-gray-600 dark:text-gray-300'>
                            {formatCheckinTime(attendance.check_in_time)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className='h-24 text-center'>
                          No attendances found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
