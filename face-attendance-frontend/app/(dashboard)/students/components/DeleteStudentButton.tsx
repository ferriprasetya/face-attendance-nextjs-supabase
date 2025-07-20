// app/students/components/DeleteStudentButton.tsx

'use client'

import { useState, useTransition } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog' // Adjust path if necessary
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { deleteStudent } from '@/actions/student.actions' // Adjust path to your actions file

interface DeleteStudentButtonProps {
  studentId: string
  studentName: string
}

export function DeleteStudentButton({
  studentId,
  studentName,
}: DeleteStudentButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    toast.promise(
      new Promise((resolve) =>
        startTransition(() => {
          // Call the server action and forward its result
          resolve(deleteStudent(studentId, studentName))
        }),
      ),
      {
        loading: `Deleting ${studentName}...`,
        success: (result: any) => {
          // Close the dialog on success
          setIsDialogOpen(false)
          return result.message // Success message from server action
        },
        error: (result: any) => {
          return result.message // Error message from server action
        },
      },
    )
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' size='sm'>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the student record for{' '}
            <span className='font-bold'>{studentName}</span>. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Button to cancel the action */}
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* Button to confirm and trigger the delete action */}
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className='bg-red-600 hover:bg-red-700'
          >
            {isPending ? 'Deleting...' : 'Yes, Delete Student'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
