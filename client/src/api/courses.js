import axios from 'axios'

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

export const getCourses           = ()                => axios.get('/api/courses')
export const addCourse            = (data)            => axios.post('/api/courses', data, authHeader())
export const updateCourse         = (id, data)        => axios.put(`/api/courses/${id}`, data, authHeader())
export const deleteCourse         = (id)              => axios.delete(`/api/courses/${id}`, authHeader())
export const enrollCourse         = (userId, courseId)=> axios.post('/api/enroll', { courseId }, authHeader())
export const getEnrolledCourses   = (userId)          => axios.get(`/api/enroll/${userId}`)
export const getQuizzes           = (courseId)        => axios.get(`/api/quiz/${courseId}`)
export const addQuiz              = (data)            => axios.post('/api/quiz', data, authHeader())
export const deleteQuiz           = (id)              => axios.delete(`/api/quiz/${id}`, authHeader())
export const saveProgress         = (data)            => axios.post('/api/progress', data, authHeader())
export const getProgress          = (userId)          => axios.get(`/api/progress/${userId}`, authHeader())
export const generateSummary      = (data)            => axios.post('/api/summary', data, authHeader())
export const getRecommendations   = (data)            => axios.post('/api/recommendations', data, authHeader())