'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionResult } from '@/lib/types/general.types'

/**
 * Server Action to create a new student record.
 *
 * @param name - The name of the student.
 * @param embedding - The embedding vector for the student.
 * @returns A promise that resolves to either a success object or a failure object.
 */
export async function createStudent(
  name: string,
  embedding: Float32Array,
): Promise<ActionResult> {
  if (!name || embedding.length !== 128) {
    return {
      success: false,
      message:
        'Invalid input. Name cannot be empty and embedding must be 128 items long.',
    }
  }

  const supabase = await createClient()

  try {
    const embeddingAsArray = Array.from(embedding)

    const { error } = await supabase
      .from('students')
      .insert([{ name, embedding: embeddingAsArray }])
      .select()

    if (error) {
      throw new Error(`Failed to create student: ${error.message}`)
    }

    return {
      success: true,
      message: 'Student created successfully.',
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to create student: ${error.message}`,
    }
  }
}
