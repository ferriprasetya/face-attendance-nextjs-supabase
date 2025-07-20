'use client'

import React, { useState, useTransition, useEffect, useRef } from 'react'
import FaceDetector from '@/components/FaceDetector'
import { validateAttendance } from '@/actions/attendance.actions'
import { ActionResult } from '@/lib/types/general.types'

// Import Shadcn UI Components for a polished look
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

/**
 * The main page for the Face Attendance system.
 * It orchestrates the face detection, server-side validation, and user feedback.
 */
export default function AttendancePage() {
  // useTransition handles the pending state of the server action without blocking the UI.
  const [isPending, startTransition] = useTransition()

  // State to hold the result from the server action (success or error message).
  const [result, setResult] = useState<ActionResult | null>(null)

  // A ref to hold the timeout ID for resetting the state.
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * This is the core callback function. It's triggered by the FaceDetector whenever a face is detected.
   * @param {Float32Array | null} embedding - The detected face descriptor or null.
   */
  const handleFaceDetected = (embedding: Float32Array | null) => {
    // We only proceed if:
    // 1. A face is actually detected (embedding is not null).
    // 2. We are not already processing a request (isPending is false).
    // 3. We are not currently displaying a result message.
    if (embedding && !isPending && !result) {
      startTransition(async () => {
        const actionResult = await validateAttendance(embedding)
        setResult(actionResult)
      })
    }
  }

  // This effect runs whenever the result changes, setting a timer to reset the UI.
  useEffect(() => {
    // Clear any existing timeout to prevent memory leaks.
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
    }

    // If there's a result, set a timer to clear it after 5 seconds.
    if (result) {
      timeoutIdRef.current = setTimeout(() => {
        setResult(null)
      }, 5000) // Display the result for 5 seconds.
    }

    // Cleanup function to clear the timeout if the component unmounts.
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
      }
    }
  }, [result])

  // The FaceDetector should be paused if we are processing or displaying a result.
  const isPaused = isPending || !!result

  return (
    <div className='flex flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900'>
      <Card className='w-full max-w-xl flex-1'>
        <CardHeader>
          <CardTitle className='text-center text-2xl'>
            Face Attendance
          </CardTitle>
          <CardDescription className='text-center'>
            Position your face in the camera frame to log your attendance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* The FaceDetector component is controlled by the isPaused prop */}
            <FaceDetector
              onFaceDetected={handleFaceDetected}
              isPaused={isPaused}
            />

            {/* This div displays the status feedback to the user */}
            <div className='flex h-16 items-center justify-center rounded-lg border bg-slate-50 p-4 text-center dark:bg-slate-800'>
              {isPending ? (
                <div className='flex items-center text-blue-600 dark:text-blue-400'>
                  <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                  <span className='font-medium'>
                    Processing attendance, please wait...
                  </span>
                </div>
              ) : result ? (
                <div
                  className={`text-lg font-bold ${
                    result.success
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {result.message}
                </div>
              ) : (
                <p className='text-gray-500 dark:text-gray-400'>
                  System is ready.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
