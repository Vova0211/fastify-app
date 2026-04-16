import { tasksGet, deleteTaskDelete, updateTaskPut, updateTaskPut_settings, addTaskPost, addTaskPost_settings } from "./models/tasks.js"
import { loginGet, loginPost } from "./models/login.js"
import { registerGet, registerPost } from "./models/register.js"

const routesList = [
    {
        path: '/',
        method: 'get',
        cb: tasksGet
    },
    {
        path: '/add',
        method: 'post',
        cb: addTaskPost,
        settings: addTaskPost_settings
    },
    {
        path: '/update/:id',
        method: 'put',
        cb: updateTaskPut,
        settings: updateTaskPut_settings
    },
        {
        path: '/delete/:id',
        method: 'delete',
        cb: deleteTaskDelete
    },
    {
        path: '/register',
        method: 'get',
        cb: registerGet
    },
    {
        path: '/register',
        method: 'post',
        cb: registerPost
    },
    {
        path: '/login',
        method: 'get',
        cb: loginGet
    },
    {
        path: '/login',
        method: 'post',
        cb: loginPost
    },

]

export default routesList