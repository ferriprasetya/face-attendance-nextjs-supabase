'use client'

import React, { useState, useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import * as faceapi from 'face-api.js'
import Image from 'next/image'

/**
 * @interface FaceDetectorProps
 * @property {(embedding: Float32Array | null) => void} onFaceDetected - Callback that receives the embedding or null.
 * @property {boolean} [isPaused=false] - When true, pauses the real-time face detection.
 */
interface FaceDetectorProps {
  onFaceDetected: (embedding: Float32Array | null) => void
  isPaused?: boolean
}

/**
 * A self-contained Next.js component for real-time face detection from a webcam stream.
 * It handles model loading, camera access, a pausable detection loop, and draws a correct bounding box.
 * When paused, the webcam feed is frozen to the last frame for clear visual feedback.
 *
 * @param {FaceDetectorProps} props - The component's props.
 * @returns {React.ReactElement} The rendered FaceDetector component.
 */
const FaceDetector: React.FC<FaceDetectorProps> = ({
  onFaceDetected,
  isPaused = false,
}) => {
  const [isLoadingModels, setIsLoadingModels] = useState(true)
  const [feedbackMessage, setFeedbackMessage] = useState('Initializing...')
  // State to hold the data URL of the frozen webcam frame.
  const [frozenImageSrc, setFrozenImageSrc] = useState<string | null>(null)

  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastEmbeddingRef = useRef<Float32Array | null>(null)

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'
      setFeedbackMessage('Loading detection models...')
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ])
        setFeedbackMessage('Models loaded. Starting detection...')
      } catch (error) {
        console.error('Model loading failed:', error)
        setFeedbackMessage('Could not load models. Please refresh.')
      } finally {
        setIsLoadingModels(false)
      }
    }
    loadModels()
  }, [])

  // Effect to handle freezing/unfreezing the webcam feed
  useEffect(() => {
    if (isPaused) {
      // If we are pausing, take a screenshot.
      if (webcamRef.current) {
        const screenshot = webcamRef.current.getScreenshot()
        setFrozenImageSrc(screenshot)
        setFeedbackMessage('Detection paused.')
      }
    } else {
      // If we are unpausing, clear the frozen image.
      setFrozenImageSrc(null)
    }
  }, [isPaused])

  // Type-corrected drawDetection function
  const drawDetection = (
    detectionResult:
      | faceapi.WithFaceDescriptor<
          faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }>
        >
      | undefined,
  ) => {
    const video = webcamRef.current?.video
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const displaySize = { width: video.clientWidth, height: video.clientHeight }
    faceapi.matchDimensions(canvas, displaySize)

    const context = canvas.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, canvas.width, canvas.height)

    if (detectionResult) {
      const resizedResult = faceapi.resizeResults(detectionResult, displaySize)
      // FIX: Access the 'box' property directly from the resized result.
      const { x, y, width, height } = resizedResult.detection.box

      const mirroredX = canvas.width - x - width

      context.strokeStyle = '#00a63e'
      context.lineWidth = 2
      context.strokeRect(mirroredX, y, width, height)
    }
  }

  // Effect to handle the detection interval
  useEffect(() => {
    if (isLoadingModels) {
      // When loading, ensure the canvas is clear.
      const canvas = canvasRef.current
      if (canvas) {
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
      }
      return
    }

    if (isPaused) {
      return
    }

    setFeedbackMessage('Scanning for face...')

    const handleDetection = async () => {
      if (webcamRef.current && webcamRef.current.video) {
        const video = webcamRef.current.video
        if (video.readyState < 3) return

        const detectionResult = await faceapi
          .detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }),
          )
          .withFaceLandmarks()
          .withFaceDescriptor()

        drawDetection(detectionResult)

        if (detectionResult) {
          setFeedbackMessage('✅ Face Detected!')
          if (lastEmbeddingRef.current !== detectionResult.descriptor) {
            lastEmbeddingRef.current = detectionResult.descriptor
            onFaceDetected(detectionResult.descriptor)
          }
        } else {
          setFeedbackMessage('Scanning for face...')
          if (lastEmbeddingRef.current !== null) {
            lastEmbeddingRef.current = null
            onFaceDetected(null)
          }
        }
      }
    }

    const detectionInterval = setInterval(handleDetection, 500)

    return () => clearInterval(detectionInterval)
  }, [isLoadingModels, onFaceDetected, isPaused])

  return (
    <div className='mx-auto flex h-full w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800'>
      <div className='relative mb-4 h-full w-full overflow-hidden rounded-lg shadow-inner'>
        {/* The Webcam component is hidden when paused, replaced by the frozen image */}
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat='image/jpeg'
          className={`h-full w-full object-cover ${frozenImageSrc ? 'invisible' : ''}`}
          mirrored={true}
        />
        {/* Display the frozen image when paused */}
        {frozenImageSrc && (
          <Image
            src={frozenImageSrc}
            alt='Paused webcam feed'
            className='absolute top-0 left-0 h-full w-full object-cover'
          />
        )}
        {/* The canvas for drawing overlays */}
        <canvas
          ref={canvasRef}
          className='pointer-events-none absolute top-0 left-0 h-full w-full'
        />
        {/* Loading indicator */}
        {isLoadingModels && (
          <div className='bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black'>
            <div className='text-center text-white'>
              <svg
                className='mx-auto mb-2 h-8 w-8 animate-spin text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              <p>Loading Models...</p>
            </div>
          </div>
        )}
      </div>

      <p className='mt-4 h-5 text-center text-sm text-gray-600 dark:text-gray-300'>
        {feedbackMessage}
      </p>
    </div>
  )
}

export default FaceDetector
