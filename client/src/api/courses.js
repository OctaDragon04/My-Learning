import axios from 'axios'

export const getCourses    = ()         => axios.get('/api/courses')
export const addCourse     = (data)     => axios.post('/api/courses', data)
export const updateCourse  = (id, data) => axios.put(`/api/courses/${id}`, data)
export const deleteCourse  = (id)       => axios.delete(`/api/courses/${id}`)