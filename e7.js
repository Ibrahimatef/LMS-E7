const Joi = require('joi');               
const express = require('express');     
const app = express();
var bodyParser = require('body-parser')


app.use(bodyParser.urlencoded( {extended : true }))
app.use(express.json())
app.use(express.static('public'))


/////////////////////////////////////////////////// Courses ////////////////////////////////////////////////
// Function to Validate Input Course Name
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(5).required(),
        code : Joi.string().required().length(6).regex(/^[a-zA-Z]{3}[0-9]{3}$/),
        description : Joi.string().max(200).allow(null,'')
    }
    return Joi.validate(course, schema);
}




const courses = [
    { id : 1 , name : 'Pattern Recognition & Image Processing' , code : 'CSE464' , description : 'Image Enhancement in the Spatial Domain'},
    { id : 2 , name : 'Artificial Intelligence' , code : 'CSE481 ' , description : ''},
    { id : 3 , name : 'MultiMedia' , code : 'CSE412 ' , description : ''},
    { id : 4 , name : 'Electrical Testing (3)' , code : 'CSE451 ' , description : ''}
];

// get list of courses you have
app.get('/api/courses/',(req,res) => {
    res.send(courses);
});

//to get specfic course
app.get('/api/courses/:id',(req,res) => {
    // we can use let instead of const if we want to reset course later
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course With Given ID Was Not Found');
    res.send(course)
});

//to add course
app.post('/api/courses/create',(req,res) => {
    
    console.log(req.body)
    // validate 
    // If not valid, return 400 bad request
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const course = {
        id : courses.length+1,
        name : req.body.name,
        code : req.body.code,
        description : req.body.description

    };
    courses.push(course);
    //by convention when course is created we send it to respnse
    res.send(course);
});

// update course
app.put('/api/courses/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('The course with the given id was not found.');
        return;
    }

    // validate 
    // If not valid, return 400 bad request
    // instead of get result then check (result.error) , we get {error} directly from return of validateCourse
    const { error } = validateCourse(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update the course 
    // Return the updated course
    course.name = req.body.name;
    course.code = req.body.code;
    course.description = req.body.description;
    res.send(course);
});


// Deleting a course
app.delete('/api/courses/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// Students ///////////////////////////////////////////////////////////////
// Function to Validate Input Course Name
function validateStudent(student) {
    const schema = {
        name: Joi.string().required().regex(/(?=\S*['-])([a-zA-Z'-]+)/),
        code : Joi.string().required().length(7)
    }
    return Joi.validate(student, schema);
}




const students = [
    { id : 1 , name : 'Ibrahim-Atef' , code : '1600012' },
    { id : 2 , name : 'Ahmed-Atef' , code : '1611112'}
];

// get list of students you have
app.get('/api/students/',(req,res) => {
    res.send(students);
});

//to get specfic student
app.get('/api/students/:id',(req,res) => {
    // we can use let instead of const if we want to reset student later
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('student With Given ID Was Not Found');
    res.send(student)
});

//to add student
app.post('/api/students/create',(req,res) => {
    
   
    // validate 
    // If not valid, return 400 bad request
    const { error } = validateStudent(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    
    const student = {
        id : students.length+1,
        name : req.body.name,
        code : req.body.code

    };
    students.push(student);
    //by convention when student is created we send it to respnse
    res.send(student);
});

// update student
app.put('/api/students/:id', (req, res) => {
    // Look up the student 
    // If not existing, return 404
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('The student with the given id was not found.');
        return;
    }

    // validate 
    // If not valid, return 400 bad request
    // instead of get result then check (result.error) , we get {error} directly from return of validatestudent
    const { error } = validateStudent(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update the student 
    // Return the updated student
    student.name = req.body.name;
    student.code = req.body.code;
    res.send(student);
});


// Deleting a student
app.delete('/api/students/:id', (req, res) => {
    // Look up the student 
    // If not existing, return 404
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }

    // Delete
    const index = students.indexOf(student);
    students.splice(index, 1);

    // Return the same student
    res.send(student);
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// Web Routes////////////////////////////////////////////////////
app.get('/web/courses/create',(req,res) =>{
    res.sendFile(__dirname+"/lms_Course.html")
})

app.get('/web/students/create',(req,res) =>{
    res.sendFile(__dirname+"/lms_Student.html")
})

app.get('/',(req,res) =>{
    res.sendFile(__dirname+"/lms_Start.html")
})


const port = process.env.PORT || 3000
app.listen(port,()=> console.log(`listening to prot ${port}...`));




