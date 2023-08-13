// author by ramez nassar

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  course_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  lecturer: {
    type: String,
    required: true
  },
  start_date: {
    type: String,
    required: true
  },
  end_date: {
    type: String,
    required: true
  },
  prerequisite_course: [{
    type: String
  }],
  students: [{
    student_id: {
      type: String,
      required: true
    },
    firstname: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    picture: {
      type: String,
      required: true
    },
    grade: {
      type: String,
      required: true
    }
  }]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;

