'use server'

import { createClient } from '@/lib/supabase/server'
import { Attendance } from '@/lib/types/attendance.types'
import { ActionResult } from '@/lib/types/general.types'

export async function validateAttendance(
  embedding: Float32Array,
): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    const response = await supabase.functions.invoke('process-attendance', {
      body: { embedding: Array.from(embedding) },
    })

    if (response.error) {
      return {
        success: false,
        message: response.error.message,
      }
    }

    const data = response.data
    if (!data || !data.studentName) {
      return {
        success: false,
        message: 'Invalid response from Edge Function.',
      }
    }

    return {
      success: true,
      message: `Welcome, ${data.studentName}!`,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'An unexpected error occurred.',
    }
  }
}

export async function getAttendances(): Promise<Attendance[]> {
  const supabase = await createClient()

  try {
    const { data: attendances, error } = await supabase
      .from('attendance_records')
      .select('*,students(id,name)')
      .order('check_in_time', { ascending: false })

    if (error) {
      throw error
    }

    console.log({ attendances })
    return attendances
  } catch (error) {
    throw error
  }
}
