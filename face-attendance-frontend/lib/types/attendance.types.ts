import { Student } from './student.types'

export type Attendance = {
  id: number
  student_id: string
  check_in_time: string
  students: Student
}
