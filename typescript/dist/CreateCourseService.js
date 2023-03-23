"use strict";
/*
name  - string
duration - number
educator - string
*/
Object.defineProperty(exports, "__esModule", { value: true });
class CreateCourseService {
    execute({ name, course, educator }) {
        console.log(name, course, educator);
    }
}
exports.default = new CreateCourseService();
