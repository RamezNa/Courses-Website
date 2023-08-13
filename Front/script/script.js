// author by ramez nassar

const addCourse ='<div class="containerPopup"><div class="header"><h1>Page Create Course</h1><img src="img/close.png" alt="cancel" class="btnClose"></div><form id="formAddCourse"><label for="Cid">Course id</label><br><input type="text" id="Cid" name="course_id" autocomplete="off" required><br><label for="Cname">Course Name</label><br><input type="text" id="Cname" name="name" autocomplete="off" required><br><label for="Lname">lecturer Name</label><br><input type="text" id="Lname" name="lecturer" autocomplete="off" required><br><label for="Sdate">Start Date</label><br><input type="date" id="Sdate" name="start_date" required><br><label for="Edate">End Date</label><br><input type="date" id="Edate" name="end_date" autocomplete="off" required><br><label for="PRC">Pre Requisite Course</label><br><h6>Put "," Between The Argument If You Want To Add More Than One.</h6><input type="text" id="PRC" name="prerequisite_course" autocomplete="off" required><br><label for="urlImg">Url Of Picture</label><br><input type="url" id="urlImg" name="picture" autocomplete="off" placeholder="https://example.com" pattern="https://.*" ><br><input type="submit"  id="submit" class="btnSubmit" ></form></div>'
const addStudentToStudents = '<div class="containerPopup"><div class="header"><h1>Page Add Student To The Student DataBase</h1><img src="img/close.png" alt="cancel" class="btnClose"></div><form id="formAddStudent"><label for="Sid">Student id</label><br><input type="number" id="Sid" name="student_id" required><br><label for="Fname">First Name</label><br><input type="text" id="Fname" name="firstname" autocomplete="off" required><br><label for="Lname">Last Name</label><br><input type="text" id="Lname" name="surname" autocomplete="off" required><br><label for="urlImg">Url Of Picture</label><br><input type="url" id="urlImg" name="picture" autocomplete="off" placeholder="https://example.com" pattern="https://.*" required><br><input type="submit"  id="submit" class="btnSubmit" ></form></div>'

//when the webPage read get the data from the server
function getTheDataFromTheServer(){

    //ajax call to the server
    $.ajax({
        url: "http://localhost:3001/course",
        type:"GET",
        dataType: "json",
        success: function(jsonData) {//success data recived

            if(Object.keys(jsonData).length !== 0){//check if the jsonData is empty 
                
                for (let iterator in jsonData) {

                    //varaible
                    let listOfItem = '<div class="container"><div class="header headerhiden"><h2 class="course_name">Course Name: <b>'
                    //add the name of course
                    listOfItem += jsonData[iterator]["name"] + '</b></h2><h2 class="course_id">Course Id: <b>'
                    //add the course id
                    listOfItem += jsonData[iterator]["course_id"] + '</b></h2><img src="img/remove.png" class="removeImg"><img src="img/edit.png" class="editeImg"><img src="img/arrow-down-sign-to-navigate.png" class="expandImg" data-is-active="false"></div><div class="expandContantHiden"><h3 class="lecturer">lecturer: <b>'
                    //name of lecturer
                    listOfItem += jsonData[iterator]["lecturer"] + '</b></h3><div class="containerOfStudent"><h3>students <b class="addStudent">+</b> <img src="img/arrow-down-sign-to-navigate.png" class="showStudent"> </h3>'

                    //add the students
                    for(let student in jsonData[iterator]["students"]){
                        //varible list of students to add to the main list
                        let listStudents = '<div class="students"><h3 class="student_id">Student Id: <b>'
                        //add id of student
                        listStudents += jsonData[iterator]["students"][student]["student_id"] + '</b></h3><h3 class="grade">grade: <b>'
                        //add grade of the student
                        listStudents += jsonData[iterator]["students"][student]["grade"] + '</b></h3><img src="img/remove.png" class="removeStudent"></div>'

                        //add the student to list main
                        listOfItem += listStudents
                    }

                    listOfItem += '</div><div class="container_Of_prerequisite_courses"><h3>prerequisite Course</h3> <div class="prerequisite_course">'
                    //add the previous courses
                    jsonData[iterator]["prerequisite_course"].forEach(element => {
                        listOfItem += '<h3 class="course_id">Course Id: <b>' + element + '</b></h3>'
                    })

                    listOfItem += '</div></div><div class="containerDate"><h3 class="start_date">Start Date: <b>'

                    //add the start date
                    listOfItem += jsonData[iterator]['start_date'] + '</b></h3><h3 class="end_date">End Date: <b>'

                    //add the end date
                    listOfItem += jsonData[iterator]['end_date'] + '</b></h3></div></div></div>'
                    
                    //add the list to the screen
                    $(".btn_container-top").after(listOfItem)
                    
                }

                
                let isMake = false

                $(".expandImg").click( function() {//we expand the details 
                    let isExpand = $(this).data('is-active')

                    if(isExpand === 'false' || isExpand === false){

                        $(this).parent().removeClass("headerhiden")
                        $(this).parent().parent().children(".expandContantHiden").addClass("expandContant").removeClass("expandContantHiden")
                        $(this).css({
                            'transform': 'rotate(-180deg)'
                        })

                        if(isMake === false){

                            isMake = true

                            //active the add student to the page
                            $(".addStudent").click( function(){
                                let addStudent = '<div class="containerPopup"><div class="header"><h1>Page Add Student To The Course</h1><img src="img/close.png" alt="cancel" class="btnClose"></div><form id="formAddStudent"><div class="dropdown"><select id="options">'

                                //get the id of the parent
                                let id_course = $(this).parent().parent().parent().parent().children(".header").children('.course_id').children('b').text()


                                //make the list of the dropdown menu
                                $.ajax({
                                    url: `http://localhost:3001/students`,
                                    type:"GET",
                                    dataType: "json", 
                                    success: function(data) {

                                        if( data['data'].length === 0 ){
                                            alert("plz add student in the main page befor you add to the course")
                                        }else{

                                            //get the value from the select
                                            let student_id = data['data'][0]['student_id']
                                            let firstname = data['data'][0]['firstname']
                                            let surname = data['data'][0]['surname']
                                            let picture = data['data'][0]['picture']
                                            

                                            data['data'].forEach( async (element , index) => { addStudent += ' <option value="' + index + '">First Name: ' + element['firstname'] + '  , Last Name: ' + element['surname'] + '  , Student Id: ' + element['student_id'] + ' </option>' } )

                                            addStudent += '</select></div><br><label for="grade">Grade</label><br><input type="number" id="grade" name="grade" required><br><input type="submit"  id="submit" class="btnSubmit" ></form></div>'


                                            //add to the body the form to add the student
                                            $("body").prepend(addStudent)

                                            //add event
                                            $('#options').on('change', function() {
                                                // Get the selected option value
                                                var selectedOption = $(this).val();
                                                student_id = data['data'][selectedOption]['student_id']
                                                firstname = data['data'][selectedOption]['firstname']
                                                surname = data['data'][selectedOption]['surname']
                                                picture = data['data'][selectedOption]['picture']
                                            });

                                            // $(".expandImg ,.editeImg ,.removeImg ,#btnPlusTop ,#btnPlusBottom").prop("disabled", false); // enable the button

                                            //cancel the page edite 
                                            $(".btnClose").click( function() {
                                                $(".containerPopup").remove()
                                            } )

                                            //add submit and send json
                                            $("#formAddStudent").submit( function(event) {

                                                event.preventDefault();
                                                //get the value from the form
                                                let  grade = $("#grade").val()
                                                let isValid = true

                                                //build json data to update
                                                let jsonUpdateDate = {}

                                                //check if there is an input on all the filed
                                                if (student_id !== ''){
                                                    jsonUpdateDate['student_id'] = student_id
                                                }

                                                if(firstname !== ''){
                                                    jsonUpdateDate['firstname'] = firstname
                                                }

                                                if(surname !== ''){
                                                    jsonUpdateDate['surname'] = surname
                                                }

                                                if(picture !== ''){
                                                    jsonUpdateDate['picture'] = `${picture}`
                                                }

                                                if(grade !== ''){
                                                    jsonUpdateDate['grade'] = grade
                                                    if(grade < 0 || grade > 100){
                                                        isValid = false
                                                        alert("The Grade Is Not Valide")
                                                    }
                                                }

                                                if (isValid){

                                                    //send to the server the data to update
                                                    $.ajax({
                                                        url: `http://localhost:3001/addStudent/:${id_course}`,
                                                        type:"POST",
                                                        dataType: "json",
                                                        data: JSON.stringify(jsonUpdateDate),
                                                        processData: false,
                                                        encode: true, 
                                                        success: function(data) {
                                                            $(".containerPopup").remove()
                                                            location.reload();
                                                        },
                                                        error: function(jqXHR, textStatus, errorThrown) {
                                                            alert('The student id is exist in the data')
                                                        }
                                                    })

                                                }

                                            })

                                        } 

                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        alert('The student id is exist in the data')
                                    }
                                })
                                
                            } )

                            //remove the student
                            $(".removeStudent").click(function(){
                                //get the id of the course and the id of the student to remoce
                                let id_course = $(this).parent().parent().parent().parent().children(".header").children(".course_id").children('b').text()
                                let student_id =$(this).parent().children(".student_id").children('b').text()
                                let removeFrome = $(this).parent()
                                //send the order to remove the student to the server to remove frome the data
                                $.ajax({
                                    url: `http://localhost:3001/course/:${id_course}/student/:${student_id}`,
                                    type:"DELETE",
                                    dataType: "json",
                                    success: function(data) {
                                        removeFrome.remove()
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                    console.log("Error: " + errorThrown);
                                    }
                                })
                            })

                            
                            //show all the student
                            $('.showStudent').click( function(){

                                let id_course = $(this).parent().parent().parent().parent().children(".header").children(".course_id").children('b').text()
                                
                                let showStudents = '<div class="studentsListPopup"><div class="header"><h1>Page Show Students Of Course ' + id_course + '</h1><img src="img/close.png" alt="cancel" class="btnClose"><div><div class="listOfStudents">'
                                
                                //get the data on the students from the server 
                                $.ajax({
                                    url: `http://localhost:3001/course/:${id_course}`,
                                    type:"GET",
                                    dataType: "json",
                                    success: function(data) {

                                        for (student in data['students']){
                                            showStudents += `<p>Student Id: ${data['students'][student]['student_id']}, First Name: ${data['students'][student]['firstname']}, Last Name: ${data['students'][student]['surname']}, Grade: ${data['students'][student]['grade']}, Picture: <img class="imgStudent" src="${data['students'][student]['picture']}" </p>`
                                        }

                                        showStudents += '</div><div>'

                                        $("body").prepend(showStudents)
                                
                                        //cancel the page edite 
                                         $(".btnClose").click( function() {
                                            $(".studentsListPopup").remove()
                                            
                                        } )
                                        
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                    console.log("Error: " + errorThrown);
                                    }
                                })

                            } )

                        }

                        

                        $(this).data('is-active', 'true');

                    }else{//return the list to the default 
                        $(this).data('is-active', 'false');
                        $(this).parent().addClass("headerhiden")
                        $(this).parent().parent().children(".expandContant").addClass("expandContantHiden").removeClass("expandContant")

                        $(this).css({
                            'transform': 'rotate(0deg)'
                        })

                        

                    }

                    

                    //return the icon to the degree 0

                    // $("#myButton").prop("disabled", true); // Disable the button
                    // $("#myButton").off("click"); // Remove the click event handler
                    // $("#myButton").css("cursor", "not-allowed"); // Change the cursor style to "not-allowed"
                } )

                //edite icon clicked
                $(".editeImg").click( function() {//we expand the details 
                    let editeCourse = '<div class="containerPopup"><div class="header"><h1>Page edite Course</h1><h2>Put Value Only On The Relevant Input For You</h2><img src="img/close.png" alt="cancel" class="btnClose"></div><form id="formEditeCourse"><label for="Cname">Course Name</label><br><input type="text" id="Cname" name="name" autocomplete="off"><br><label for="Lname">lecturer Name</label><br><input type="text" id="Lname" name="lecturer" autocomplete="off"><br><label for="Sdate">Start Date</label><br><input type="date" id="Sdate" name="start_date"><br><label for="Edate">End Date</label><br><input type="date" id="Edate" name="end_date"><br><label >Pre Requisite Course</label><br><div class="prevCourse">'

                    let id_course = $(this).parent().children(".course_id").children('b').text()
                    let InformationAboutCourse

                    if($(this).parent().parent().children('.expandContant').length != 0){
                        InformationAboutCourse = $(this).parent().parent().children('.expandContant').children('.container_Of_prerequisite_courses').children('.prerequisite_course').children()
                    }else{
                        InformationAboutCourse = $(this).parent().parent().children('.expandContantHiden').children('.container_Of_prerequisite_courses').children('.prerequisite_course').children()
                    }
                    
                    InformationAboutCourse.each( function(index ,element){
                        let idData = $(element).children('b').text()
                        editeCourse += '<label for="' + idData + '">' + idData + '</label><br><input type="text" id="'+ idData + '" name="prerequisite_course" autocomplete="off"><br>'
                    } )

                    editeCourse += '</div><input type="submit" id="submit" class="btnSubmit"  ></form></div>'
                    
                    $("body").prepend(editeCourse)  

                    //check validate form

                    //cancel the page edite 
                    $(".btnClose").click( function() {
                        $(".containerPopup").remove()
                        // $("#myButton").prop("disabled", false); // Disable the button
                    } )

                    //add submit and send json
                    $("#formEditeCourse").submit( function(event) {

                        event.preventDefault();
                        //get the value from the form
                        let name = $("#Cname").val()
                        let lecturer = $("#Lname").val()
                        let start_date = $("#Sdate").val()
                        let end_date = $("#Edate").val()
                        let prerequisite_course = {}
                        //build json data to update
                        let jsonUpdateDate = {}

                        $(this).children('.prevCourse').children('input').each(function(index , element){
                            if( $(element).val() !== ''){
                                prerequisite_course[$(element).attr('id')] = $(element).val()
                            }
                            
                        })

                        //check if there is an input on all the filed
                        if (name !== ''){
                            jsonUpdateDate['name'] = name
                        }

                        if(lecturer !== ''){
                            jsonUpdateDate['lecturer'] = lecturer
                        }

                        if(start_date !== ''){
                            let parts = start_date.split('-');
                            let formatDate = parts[2] + '-' + parts[1] + '-' + parts[0];
                            jsonUpdateDate['start_date'] = formatDate
                        }

                        if(end_date !== ''){
                            let parts = end_date.split('-');
                            let formatDate = parts[2] + '-' + parts[1] + '-' + parts[0];
                            jsonUpdateDate['end_date'] = formatDate
                        }


                        if(prerequisite_course.length != 0){
                            jsonUpdateDate['prerequisite_course'] = prerequisite_course
                        }

                        //send to the server the data to update
                        $.ajax({
                            url: `http://localhost:3001/courses/:${id_course}`,
                            type:"PUT",
                            dataType: "json",
                            data: JSON.stringify(jsonUpdateDate),
                            processData: false,
                            encode: true, 
                            success: function(data) {
                                $(".containerPopup").remove()
                                location.reload();
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                              console.log("Error: " + errorThrown);
                            }
                        });

                    })
                } )

                //remove the course
                $(".removeImg").click(function(){
                    //get the id of the course
                    let id_course = $(this).parent().children(".course_id").children('b').text()
                    let removeFrome = $(this).parent().parent()
                    
                    $.ajax({
                        url: `http://localhost:3001/course/:${id_course}`,
                        type:"DELETE",
                        dataType: "json",
                        success: function(data) {
                            removeFrome.remove()
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                          console.log("Error: " + errorThrown);
                        }
                    });
   
                })

            }
          
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log("Error: " + errorThrown);
        }
    })

}

//main function
$(document).ready(function() {

    //add the list oof courses from the server
    getTheDataFromTheServer()
    
    //add course to the list
    $('#btnPlusTop, #btnPlusBottom').click(function(){
        //add to the body the form
        $("body").prepend(addCourse)

        //cancel the page edite 
        $(".btnClose").click( function() {
            $(".containerPopup").remove()
            // $("#myButton").prop("disabled", false); // Disable the button
        } )

        //add submit and send json
        $("#formAddCourse").submit( async function(event) {

            event.preventDefault();
            //get the value from the form
            let course_id = $("#Cid").val()
            let name = $("#Cname").val()
            let logo_picture = $("#urlImg").val()
            let  lecturer = $("#Lname").val()
            let start_date = $("#Sdate").val()
            let end_date = $("#Edate").val()
            let prerequisite_course = $("#PRC").val()

            //build json data to update
            let jsonUpdateDate = {}

            //check if there is an input on all the filed
            if (course_id !== ''){
                jsonUpdateDate['course_id'] = course_id
            }

            if(name !== ''){
                jsonUpdateDate['name'] = name
            }

            if(logo_picture !== ''){
                jsonUpdateDate['logo_picture'] = logo_picture
            }

            if(lecturer !== ''){
                jsonUpdateDate['lecturer'] = lecturer
            }

            if(start_date !== ''){
                let parts = start_date.split('-');
                let formatDate = parts[2] + '-' + parts[1] + '-' + parts[0];
                jsonUpdateDate['start_date'] = formatDate
            }

            if(end_date !== ''){
                let parts = end_date.split('-');
                let formatDate = parts[2] + '-' + parts[1] + '-' + parts[0];
                jsonUpdateDate['end_date'] = formatDate
            }

            if(prerequisite_course !== ''){
                jsonUpdateDate['prerequisite_course'] = prerequisite_course
            }
            
            //send to the server the data to update
            $.ajax({
                url: `http://localhost:3001/createCourse`,
                type:"POST",
                dataType: "json",
                data: JSON.stringify(jsonUpdateDate),
                processData: false,
                encode: true, 
                success: function(data) {
                    $(".containerPopup").remove()
                    location.reload();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert("The id course is exist in the data")
                }
            });

        })

    })


    //add course to the list
    $('#btnStudentPlusTop, #btnStudentPlusBottom').click(async function(){
        
        //add to the body the form to add the student
        $("body").prepend(addStudentToStudents)

        // $(".expandImg ,.editeImg ,.removeImg ,#btnPlusTop ,#btnPlusBottom").prop("disabled", false); // enable the button

        //cancel the page edite 
        $(".btnClose").click( function() {
            $(".containerPopup").remove()
        } )

        //add submit and send json
        $("#formAddStudent").submit( function(event) {

            event.preventDefault();
            //get the value from the form
            let student_id = $("#Sid").val()
            let firstname = $("#Fname").val()
            let surname = $("#Lname").val()
            let picture = $("#urlImg").val()

            //build json data to update
            let jsonUpdateDate = {}

            //check if there is an input on all the filed
            if (student_id !== ''){
                jsonUpdateDate['student_id'] = student_id
            }

            if(firstname !== ''){
                jsonUpdateDate['firstname'] = firstname
            }

            if(surname !== ''){
                jsonUpdateDate['surname'] = surname
            }

            if(picture !== ''){
                jsonUpdateDate['picture'] = `${picture}`
            }

            //send to the server the data to update
            $.ajax({
                url: 'http://localhost:3001/studentAdds',
                type:"POST",
                dataType: "json",
                data: JSON.stringify(jsonUpdateDate),
                processData: false,
                encode: true, 
                success: function(data) {
                    $(".containerPopup").remove()
                    location.reload();
                },error: function(jqXHR, textStatus, errorThrown) {
                    alert('The student id is exist in the data')
                }
            })      

        })

    })



 
});  
