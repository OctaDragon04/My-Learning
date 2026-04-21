import axios from 'axios'

export const getCourses   = ()          => axios.get('/api/courses')
export const addCourse    = (data)      => axios.post('/api/courses', data)
export const updateCourse = (id, data)  => axios.put(`/api/courses/${id}`, data)
export const deleteCourse = (id)        => axios.delete(`/api/courses/${id}`)
export const enrollCourse     = (userId, courseId) => axios.post('/api/enroll', { userId, courseId })
export const getEnrolledCourses = (userId)         => axios.get(`/api/enroll/${userId}`)