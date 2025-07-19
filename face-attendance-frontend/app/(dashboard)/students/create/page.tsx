'use client'

import React, { useMemo, useState, useTransition } from 'react'
import FaceDetector from '@/components/FaceDetector' // Adjust path to your FaceDetector component
import { createStudent } from '@/actions/student.actions'

// Import your Shadcn UI Components
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * A page component for creating a new student record,
 * featuring a form with name input and face capture functionality.
 */
export default function CreateStudentPage() {
  // --- STATE MANAGEMENT ---

  // Form input state
  const [name, setName] = useState('')
  const [embedding, setEmbedding] = useState<Float32Array | null>(null)

  // UI flow and feedback state
  const [isFaceSaved, setIsFaceSaved] = useState(false)
  const [formMessage, setFormMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // useTransition hook for managing pending states from server actions
  const [isPending, startTransition] = useTransition()

  // --- CALLBACKS & HANDLERS ---

  /**
   * Callback passed to the FaceDetector component.
   * It receives the embedding in real-time but only updates state if detection is active.
   */
  const handleFaceDetected = (detectedEmbedding: Float32Array | null) => {
    if (!isFaceSaved) {
      setEmbedding(detectedEmbedding)
    }
  }

  /**
   * Toggles the state between saving a detected face and resuming detection.
   * This controls the FaceDetector's `isPaused` prop.
   */
  const handleToggleSaveFace = () => {
    if (isFaceSaved) {
      // "Detect Face Again" was clicked: resume detection
      setIsFaceSaved(false)
      setEmbedding(null) // Clear the saved embedding
      setFormMessage(null)
    } else {
      // "Save Image" was clicked: pause detection and save the current embedding
      if (embedding) {
        setIsFaceSaved(true)
        setFormMessage({
          type: 'success',
          text: 'Face data captured successfully.',
        })
      } else {
        setFormMessage({
          type: 'error',
          text: 'No face detected. Please position your face in the camera.',
        })
      }
    }
  }

  /**
   * Handles the final form submission by calling the server action.
   */
  const handleSubmit = () => {
    // Client-side validation before calling the server
    if (!name || !embedding || !isFaceSaved) {
      setFormMessage({
        type: 'error',
        text: 'Please provide a name and save the face data before submitting.',
      })
      return
    }

    setFormMessage(null) // Clear previous messages

    startTransition(async () => {
      const result = await createStudent(name, embedding)
      if (result.success) {
        setFormMessage({ type: 'success', text: result.message })
        // Reset form on success
        setName('')
        setEmbedding(null)
        setIsFaceSaved(false)
      } else {
        setFormMessage({ type: 'error', text: result.message })
      }
    })
  }

  // --- DERIVED STATE ---

  // The final submit button is enabled only when all conditions are met.
  const isSubmitDisabled = useMemo(
    () => !name || !isFaceSaved || isPending,
    [name, isFaceSaved, isPending],
  )

  // --- RENDER ---

  return (
    <div className='flex min-h-screen justify-center bg-gray-50 p-4 dark:bg-gray-900'>
      <Card className='w-full max-w-xl'>
        <CardHeader>
          <CardTitle>Create New Student</CardTitle>
          <CardDescription>
            Enter the student's name and capture their face data for
            registration.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Student Name</Label>
            <Input
              id='name'
              placeholder='e.g., Jane Doe'
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className='space-y-4'>
            <div>
              <Label>Face Data</Label>
              <CardDescription>Put your face on camera</CardDescription>
            </div>
            <FaceDetector
              onFaceDetected={handleFaceDetected}
              isPaused={isFaceSaved || isPending} // Also pause during submission
            />
            {formMessage && (
              <div
                className={`rounded-lg p-3 text-center text-sm ${formMessage.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-wrap text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}
              >
                {formMessage.text}
              </div>
            )}
            <Button
              onClick={handleToggleSaveFace}
              variant={isFaceSaved ? 'secondary' : 'default'}
              className='w-full'
              disabled={isPending || (!embedding && !isFaceSaved)}
            >
              {isFaceSaved ? 'Recapture Face' : 'Save Face Data'}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className='w-full'
          >
            {isPending ? 'Submitting...' : 'Create Student Record'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
