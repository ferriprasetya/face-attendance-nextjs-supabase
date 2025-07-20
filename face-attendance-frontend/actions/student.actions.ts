'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionResult } from '@/lib/types/general.types'
import { Student } from '@/lib/types/student.types'
import { revalidatePath } from 'next/cache'

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

export async function getStudents(): Promise<Student[]> {
  const supabase = await createClient()

  try {
    const { data: students, error } = await supabase
      .from('students')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return students
  } catch (error) {
    throw error
  }
}

export async function deleteStudent(
  id: string,
  name: string,
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
      .select()

    if (error) {
      throw new Error(
        `Failed to delete student with name ${name}: ${error.message}`,
      )
    }

    revalidatePath('/students')

    return {
      success: true,
      message: `Student with name ${name} deleted successfully.`,
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to delete student with name ${name}: ${error.message}`,
    }
  }
}
