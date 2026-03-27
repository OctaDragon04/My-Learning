require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Course = require('./models/course');
const User = require('./models/user');

const mongoUrl = process.env.MONGO_URI;
const app = express();
const PORT =process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(mongoUrl)
.then(()=>{ console.log('Connected to MongoDB');})
.catch((err)=>{ console.error('Error connecting to MongoDB:', err);});

app.get('/',(req,res)=>{
    res.send('My Learning LMS Server is Running!');
});

//post and get routes for courses
app.post('/api/courses', async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get all courses and also populate instructor name
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Delete a course by ID
app.delete('/api/courses/:id', async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Put route to update a course by ID
app.put('/api/courses/:id', async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // returns the updated doc, not the old one
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});