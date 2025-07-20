import Link from 'next/link'
import { getStudents } from '@/actions/student.actions' // Adjust path if needed
import { Student } from '@/lib/types/student.types' // Adjust path if needed

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
import { DeleteStudentButton } from './components/DeleteStudentButton'

/**
 * Formats a UTC timestamp string into a more readable local date and time format.
 * @param dateString - The ISO 8601 timestamp string from Supabase.
 * @returns A formatted string e.g., "7/20/2025, 2:02 PM".
 */
function formatCreatedAt(dateString: string): string {
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
 * ListStudentPage is a Next.js Server Component that fetches and displays a list of students.
 * Being a server component, it can directly call async server actions to get data.
 */
export default async function ListStudentPage() {
  // Fetch data directly on the server before rendering.
  // This is a powerful feature of Next.js App Router.
  let students: Student[] = []
  let fetchError: string | null = null

  try {
    students = await getStudents()
  } catch (error: any) {
    console.error('Failed to fetch students:', error)
    fetchError =
      error.message || 'An unknown error occurred while fetching data.'
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-900'>
      <div className='mx-auto max-w-4xl'>
        <Card>
          <CardHeader className='sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <CardTitle>Student List</CardTitle>
              <CardDescription>
                A list of all registered students in the system.
              </CardDescription>
            </div>
            <Link href='/students/create' passHref>
              <Button className='mt-4 w-full sm:mt-0 sm:w-auto'>
                <PlusCircle className='mr-2 h-4 w-4' />
                Create New Student
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {fetchError ? (
              <div className='rounded-md bg-red-50 px-4 py-10 text-center dark:bg-red-900/20'>
                <p className='font-semibold text-red-600 dark:text-red-400'>
                  Failed to load student data.
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
                      <TableHead className='w-[40%]'>Name</TableHead>
                      <TableHead className='hidden w-[25%] sm:table-cell'>
                        Student ID
                      </TableHead>
                      <TableHead className='w-[35%] text-right'>
                        Registration Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.length > 0 ? (
                      students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className='font-medium'>
                            {student.name}
                          </TableCell>
                          <TableCell className='hidden font-mono text-xs text-gray-500 sm:table-cell dark:text-gray-400'>
                            {student.id}
                          </TableCell>
                          <TableCell className='text-right text-sm text-gray-600 dark:text-gray-300'>
                            {formatCreatedAt(student.created_at)}
                          </TableCell>
                          <TableCell className='text-right text-sm text-gray-600 dark:text-gray-300'>
                            <DeleteStudentButton
                              studentId={student.id}
                              studentName={student.name}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className='h-24 text-center'>
                          No students found.
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
