'use client'

import FaceDetector from '@/components/FaceDetector'
import React, { useState } from 'react'

export default function Home() {
  const [faceEmbedding, setFaceEmbedding] = useState<Float32Array | null>(null)

  /**
   * This callback function is passed as a prop to the FaceDetector component.
   * It receives the result from the detector and updates the parent's state.
   * @param {Float32Array | null} embedding - The detected face descriptor or null.
   */
  const handleFaceDetected = (embedding: Float32Array | null) => {
    console.log('Parent component received embedding:', embedding)
    setFaceEmbedding(embedding)
  }

  return (
    <div className='flex h-svh flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900'>
      <div className='h-full w-full max-w-xl flex-1'>
        <h1 className='mb-2 text-center text-2xl font-bold text-gray-800 dark:text-white'>
          Face Authentication
        </h1>
        <p className='mb-6 text-center text-gray-500 dark:text-gray-400'>
          Position your face in the frame to attending.
        </p>

        {/* Here is the usage of the FaceDetector component.
          We pass the `handleFaceDetected` function to its `onFaceDetected` prop.
        */}
        <FaceDetector onFaceDetected={handleFaceDetected} />

        {/* This section demonstrates that the parent has received the data.
          In a real application, you would use this `faceEmbedding` state
          to perform an action, like sending it to your backend for verification.
        */}
        <div className='mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800'>
          <h2 className='mb-2 text-lg font-semibold text-gray-700 dark:text-white'>
            Detection Result
          </h2>
          {faceEmbedding ? (
            <div>
              <p className='font-medium text-green-600 dark:text-green-400'>
                ✅ Embedding received successfully!
              </p>
              <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                (Showing first 5 values of the 128-dimension vector)
              </p>
              <pre className='mt-1 overflow-x-auto rounded bg-gray-100 p-2 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300'>
                [{Array.from(faceEmbedding).slice(0, 5).join(', ')}, ...]
              </pre>
            </div>
          ) : (
            <p className='text-gray-500 dark:text-gray-400'>
              Awaiting face detection... The result will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
