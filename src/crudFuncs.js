import bcrypt from 'bcrypt'

import { updateTask, getData, updateData } from "./funcs.js"
import { settings } from 'node:cluster';


function registrationGet(request, reply) {
    const { user } = getData()
    reply.status(200).render('register.pug', { user });
}

async function registerPost(request, reply) {
    const { login, password } = request.body

    const saltRounds = 8
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const data = getData()
    data.user = {
        login,
        password: passwordHash
    }
    updateData(data)

    reply.redirect('/registration/')
}

function mainGet(request, reply) {
    const { tasks } = getData()
    reply.status(200).render('index.pug', { tasks });
}

function addTaskPost(request, reply) {
    const { title } = request.body
    const { tasks } = getData()
    if (request.validationError) reply.status(400).send(request.validationError)

    const task = { id: uuidv4(), title, completed: false }
    tasks.push(task)
    updateData(tasks)
    reply.status(201).send(task)
}

const addTaskPost_settings = {
  attachValidation: true,
  schema: {
    body: object({
      title: string().min(2)
    })
  },
  validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
    try {
      const parsedData = JSON.parse(data)
      const result = schema.validateSync(parsedData)
      return { value: result }
    }
    catch (e) {
      return { error: e }
    }
  }
}

const routes = [
    {
        path: '/',
        method: 'get',
        cb: mainGet
    },
    {
        path: '/registration',
        method: 'get',
        cb: registrationGet
    },
    {
        path: '/register',
        method: 'post',
        cb: registerPost
    },
    {
        path: '/add',
        method: 'post',
        cb: addTaskPost,
        settings: addTaskPost_settings
    }
]

export default routes