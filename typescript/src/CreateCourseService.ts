/*
name  - string
duration - number
educator - string
*/

interface Course{
    name: string, 
    course: number, 
    educator: string
}

class CreateCourseService {
    execute({name, course, educator} : Course){
        console.log(name, course, educator )
    }
    
}

export default new CreateCourseService();