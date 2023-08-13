// author by ramez nassar

const  express  = require('express')
const bodyParser = require('body-parser')
const Path = require('path')
const mongoose = require('mongoose')
// const cors = require('cors')
const fs = require('fs')
const app = express()

// const students = require("./Back/StudentsDb")
const courses = require("./Back/CourseDb")
const Student = require('./Back/StudentsDb')
const Course = require('./Back/CourseDb')

mongoose.connect( 'mongodb://localhost:27017/course-api', {useNewUrlParser: true , useUnifiedTopology: true} )
const db = mongoose.connection
db.on('error' , (error) =>  console.log(error) )
db.once('open' , () =>  console.log('Databased Conected') )

// Enable CORS for all routes
// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json())

const path = 'Back/Data.json'


//delete the course 7
async function deleteCourse(courseId) {
    try {
      const deletedCourse = await courses.findOneAndDelete({ course_id: courseId });
  
      if (!deletedCourse) {
        // Course not found
        return { success: false, message: 'Course not found' };
      }
  
      // Course deleted successfully
      return { success: true, message: 'Course deleted' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred while deleting the course' };
    }
  }

//add students 7
async function addStudent(studentDetails) {
    try {
      const { student_id, firstname, surname, picture } = studentDetails;
  
      // Check if a student with the same ID already exists
      const existingStudent = await Student.findOne({ student_id });
  
      if (existingStudent) {
        return { success: false, message: 'Student with the same ID already exists' };
      }
  
      const createdStudent = await Student.create({
        student_id,
        firstname,
        surname,
        picture
      });
  
      // Student created successfully
      return { success: true, message: 'Student added', student: createdStudent };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred while adding the student' };
    }
}

//function to getStudent 
async function getStudents() {
    try {
      const students = await Student.find();
  
      return { success: true, message: 'Students retrieved', students };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred while retrieving students' };
    }
}

//0
app.use('/', express.static(Path.join(__dirname, 'Front/')));

//implement of 1
function CreateCourse(req, res) {
  const CourseDetails = JSON.parse(Object.keys(req.body));

  CourseDetails['prerequisite_course'] = CourseDetails['prerequisite_course'].split(",")
  
  //check that we havent double data
  if(CourseDetails['prerequisite_course'].length !== new Set(CourseDetails['prerequisite_course']).size){
    CourseDetails['prerequisite_course'] = [...new Set(CourseDetails['prerequisite_course'])]
  }
 
  courses.findOne({ course_id: CourseDetails.course_id })
    .then((course) => {
      if (course) {
        // Course with the same course_id already exists
        return Promise.reject('Course already exists');
      }

      // Create a new course document
      const newCourse = new courses(CourseDetails);
      return newCourse.save();
    })
    .then(() => {
      console.log('Successfully saved course');
      res.status(200).json({ status: 'success', message: 'Operation successful' });
    })
    .catch((error) => {
      if (error === 'Course already exists') {
        res.status(400).json({ status: 'failure', message: 'Course already exists' });
      } else {
        console.log('Error creating course:', error);
        res.status(500).json({ status: 'failure', message: 'Failed to create course' });
      }
    });
}

// 1
// create corse
app.post('/createCourse', CreateCourse);
  
app.put('/courses/:Course_id', (req, res) => {
  const course_id = req.params.Course_id.replace(":", "");
  const updatedCourseDetails = JSON.parse(Object.keys(req.body));

  if( Object.keys(updatedCourseDetails.prerequisite_course).length !== 0){
    let preCourse = Object.keys(updatedCourseDetails.prerequisite_course);
    
    const updateOperations = preCourse.map((prerequisite) => {
      return {
        updateOne: {
          filter: { course_id: course_id, 'prerequisite_course':  prerequisite },
          update: { $set: { 'prerequisite_course.$': (updatedCourseDetails.prerequisite_course)[prerequisite] } }
        }
      };
    });

    Course.bulkWrite(updateOperations)
    .then((result) => {
      if (result.modifiedCount > 0) {
        console.log('Prerequisites updated successfully');
      } else {
        console.log('Prerequisites not updated');
      }
    })
    .catch((error) => {
      console.log('Error updating prerequisites:', error);
    });
  }
  delete updatedCourseDetails.prerequisite_course;

  Course.findOneAndUpdate(
    { course_id },
    { $set: updatedCourseDetails },
    { new: true }
  )
    .then((updatedCourse) => {
      if (!updatedCourse) {
        res.status(404).json({ status: 'failed', message: 'Course not found' });
        return;
      }
      res.status(200).json({ status: 'success', message: 'Course updated successfully' });
    })
    .catch((err) => {
      console.error('Error updating course:', err);
      res.status(500).json({ status: 'failed', message: 'Internal server error' });
    });
});

//implement 3
// Add Student to Course Function 3
async function addStudentToCourse(courseId, studentDetails) {
  try {
    const course = await Course.findOne({ course_id: courseId });

    if (!course) {
      throw new Error('Course not found');
    }

    const { student_id, firstname, surname, picture, grade } = studentDetails;

    const isStudentExists = course.students.some((student) => student.student_id.toString() === student_id);

    if (isStudentExists) {

      throw new Error('Student already enrolled in the course');
    }

    const student = await Student.findOne({ student_id });

    if (!student) {

      throw new Error('Student not found');
    }

    const newStudent = {
      student_id: student_id,
      firstname: firstname,
      surname: surname,
      picture: picture,
      grade: grade
    };

    course.students.push(newStudent);
    await course.save();

    return { status: 'success', message: 'Student added to the course' };
  } catch (error) {
    return { status: 'failed', message: error.message };
  }
}



//3
app.post('/addStudent/:courseId', async (req, res) => {
  try {
    const courseId = req.params.courseId.replace(':', '');
    const studentDetails = JSON.parse(Object.keys(req.body));

    const result = await addStudentToCourse(courseId, studentDetails);

    if(result.status === 'failed'){
      res.status(500).json(result);
    }else{
      res.status(200).json(result);
    }


  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


// 4 Get Course Function
async function getCourse(courseId) {
  try {
    const course = await courses
      .findOne({ course_id: courseId })
      .exec();

    if (!course) {
      throw { status: 'failed', message: 'Course is not found' };
    }

    return course;
  } catch (error) {
    throw { status: 'failed', message: 'An error occurred while retrieving the course' };
  }
}


// 4 Get Course Endpoint
app.get('/course/:courseId', (req, res) => {
  const courseId = req.params.courseId.replace(':', '');
  getCourse(courseId)
    .then((students) => {
      res.status(200).json(students);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

//5
app.get('/course' , (req , res) =>{

    Course.find({})
    .exec()
    .then(courses => {
      res.status(200).json(courses)
    })
    .catch(error => {
      console.error('Error retrieving courses:', error);
      res.status(200).json({ status: 'failure', message: 'Failed to retrieve courses.' })
    });

})

//implement 6
async function deleteStudentFromCourse(courseId, studentId) {
  try {
    const updatedCourse = await courses.findOneAndUpdate(
      { course_id: courseId },
      { $pull: { students: { student_id: studentId } } }, // Use 'student_id' instead of 'student'
      { new: true }
    );

    if (!updatedCourse) {
      // Course not found
      return { success: false, message: 'Course not found' };
    }

    // Student removed successfully
    return { success: true, message: 'Student removed from the course' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An error occurred while removing the student from the course' };
  }
}

//6
app.delete('/course/:course_id/student/:student_id', (req, res) => {
  deleteStudentFromCourse(req.params.course_id.replace(':', ''), req.params.student_id.replace(':', ''))
    .then((result) => {
      res.status(200).json({ status: 'success', message: 'Operation successful' });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

//7
app.delete('/course/:course_id' , (req , res) => {
   
    deleteCourse(req.params['course_id'].replace(':' , '') ).then((result) => {
        res.status(200).json({status: 'success',message: 'Operation successful'})
    }).catch((err) => {
        res.sendStatus(500)
    })
})

//implement 8
function addStudentToDb(req, res) {

  const studentDetails = JSON.parse(Object.keys(req.body)); // Assuming the student details are passed in the request body
  // Ensure that all fields are valid and not empty
  if (!studentDetails.student_id || !studentDetails.firstname || !studentDetails.surname || !studentDetails.picture) {

    res.status(400).json({ status: 'failure', message: 'Required student details are missing.' });
    return;
  }

  // Check if a student with the same ID already exists
  Student.findOne({ id: studentDetails.student_id })
    .then((existingStudent) => {
      if (existingStudent) {
        // A student with the same ID already exists
        res.status(400).json({ status: 'failure', message: 'Student with the same ID already exists.' });
        return;
      }

      // Create a new student document
      const newStudent = new Student(studentDetails);
      return newStudent.save();
    })
    .then(() => {
      res.status(200).json({ status: 'success', message: 'Student added successfully.' });
    })
    .catch((error) => {
      console.log('Error adding student:', error);
      res.status(500).json({ status: 'failure', message: 'Failed to add student.' });
    });
}

//8
app.post('/studentAdds', addStudentToDb);

//implement 9
function getStudents(req, res) {
  // Find all students in the database
  Student.find()
    .then((students) => {
      res.status(200).json({ status: 'success', data: students });
    })
    .catch((error) => {
      console.log('Error fetching students:', error);
      res.status(500).json({ status: 'failure', message: 'Failed to fetch students' });
    });
}

//9
app.get('/students', getStudents);


app.listen(3001)
console.log("run http://localhost:3001/")

