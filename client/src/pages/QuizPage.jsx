import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Card, Button, Alert, ProgressBar } from 'react-bootstrap'
import { getQuizzes } from '../api/courses'
import { useAuth } from '../context/AuthContext'

export default function QuizPage() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    getQuizzes(courseId)
      .then(res => setQuizzes(res.data))
      .finally(() => setLoading(false))
  }, [courseId])

  const handleAnswer = (index) => {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    if (index === quizzes[current].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (current + 1 >= quizzes.length) {
      setFinished(true)
    } else {
      setCurrent(current + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  if (loading) return <div className='p-4'>Loading quiz...</div>

  if (quizzes.length === 0) return (
    <Container className='py-4'>
      <Alert variant='info'>No quiz available for this course yet.</Alert>
      <Button variant='dark' onClick={() => navigate('/')}>Back to Gallery</Button>
    </Container>
  )

  if (finished) return (
    <Container className='py-4 text-center' style={{ maxWidth: 600 }}>
      <Card className='p-4 shadow'>
        <div style={{ fontSize: 60 }}>🎉</div>
        <h3 className='mt-3'>Quiz Completed!</h3>
        <h4 className='text-success mt-2'>{score} / {quizzes.length} Correct</h4>
        <ProgressBar
          now={(score / quizzes.length) * 100}
          variant={score / quizzes.length >= 0.7 ? 'success' : 'warning'}
          className='mt-3 mb-3'
        />
        <p className='text-muted'>
          {score / quizzes.length >= 0.7
            ? '✅ Great job! You passed!'
            : '📚 Keep studying and try again!'}
        </p>
        <Button variant='dark' onClick={() => navigate('/')}>Back to Gallery</Button>
      </Card>
    </Container>
  )

  const q = quizzes[current]

  return (
    <Container className='py-4' style={{ maxWidth: 600 }}>
      <div className='d-flex justify-content-between mb-3'>
        <span className='text-muted'>Question {current + 1} of {quizzes.length}</span>
        <span className='text-muted'>Score: {score}</span>
      </div>
      <ProgressBar now={((current) / quizzes.length) * 100} className='mb-4' />

      <Card className='p-4 shadow'>
        <h5 className='mb-4'>{q.question}</h5>
        <div className='d-flex flex-column gap-2'>
          {q.options.map((opt, i) => (
            <Button
              key={i}
              variant={
                !answered ? 'outline-dark' :
                i === q.correctAnswer ? 'success' :
                i === selected ? 'danger' : 'outline-dark'
              }
              className='text-start'
              onClick={() => handleAnswer(i)}
            >
              {opt}
            </Button>
          ))}
        </div>
        {answered && (
          <div className='mt-3'>
            <Alert variant={selected === q.correctAnswer ? 'success' : 'danger'}>
              {selected === q.correctAnswer ? '✅ Correct!' : `❌ Wrong! Correct answer: ${q.options[q.correctAnswer]}`}
            </Alert>
            <Button variant='dark' className='w-100' onClick={handleNext}>
              {current + 1 >= quizzes.length ? 'Finish Quiz' : 'Next Question →'}
            </Button>
          </div>
        )}
      </Card>
    </Container>
  )
}