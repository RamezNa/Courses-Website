# Courses-Website
In this exercise you will have to use the Courses service of which includes information about courses and the grades of students participating in them.
You must plan to build a REST service called CoursesService that stores in the 'cloud' course lists, the list of students studying in the course accompanied by the grade set for the student in this course.
The service allows the system administrator to see the list of courses and also to see the list of students with the grades for a particular course.

The managed information:
     • The following details are saved for each course: course ID (can contain letters A-Z and numbers), course name, lecturer's name, list of students participating in the course accompanied by the grade each student received, course start date, course end date

     • The following details are kept for each student: student thesis (student ID), first and last name, profile picture, and of course his grade in the course

Each storage service allows the group of CRUD operations consisting of Create, Read, Update, Delete to be performed on the stored object.
This service will allow the user the CRUD operations detailed below

Execute the following functions on the NodeJS server side, using express. For each function there is a suitable routing with a suitable http method that refers to the function:
     1. CreateCourse (CourseDetails)
This function receives the course details: course ID (can contain letters A-Z and numbers), course name, lecturer's name, course start date, course end date.
All fields are mandatory. The function will return an appropriate status in case of success or failure.

     2. updateCourse (string Course_id, CourseDetails)
This function will update the fields for which new information is sent for Course_id. The function will return a message if Course_id does not exist.
All fields can be updated except for the unique course ID and the list of students.

     3. AddStudentToCourse (string Course_id, StudentDetails)
The student details are a student ID (as saved in Mongo objectId) and of course his grade in the course. This function checks if the student already exists in the list, and if not, adds him.
The function will return a message if Course_id does not exist or in other cases where the input does not match.


     4. getCourses()
This function displays the list of courses.

     5. deleteStudentFromCourse (string Course_id, string Student_id)
This function will delete the student from the student list of the given course, the function will return a message if Course_id does not exist or in other cases where the input does not match

     6. deleteCourse(string Course_id)
This function will delete all information for Course_id. The function will return a message if Course_id does not exist.

     7. addStudent(StudentDetails)-
The PO receives the student's details: student ID, first and last name, profile picture. All fields are mandatory. The function will return an appropriate status in case of success or failure.
There cannot be two students with the same 17th grade.

     8. getStudents() – this is a new function in exercise 4 that is required to be exercised only for those who choose to exercise the advanced option with the bonus
This function returns the list of lecturers.


Client side manipulation using jquery + ajax
The /list page that displays the list of courses in a list or table.
For each course in the list, its details are shown:
Course identifier (can contain letters A-Z and numbers), course name, lecturer's name, list of students participating in the course accompanied by the grade each student received, course start date, course end date.

Next to each course there are buttons for the following actions:
     1. Deleting the course
     2. Edit the course details that can be edited
     3. Adding a student to the list of students in this course. * (see note below)
     4. To view the list of students. In it, next to each student there is a button to delete. (The list will open in a panel or extension of the list and close it)

Above and below the list, there are buttons that open an "Add Course" and "Add Student" form.
The forms can open as a panel above the list or lead to a separate routing that will display the form. At the end of a normal add/update operation, the user will be redirected back to the list of courses and will see it as up-to-date.
