import { object, string, boolean } from 'yup'
import { v4 as uuidv4 } from 'uuid';

import { updateTask, getTasks, postTask, deleteTask } from "../funcsDB.js"

const errorMessage = { error: 'Server error'}

async function tasksGet(request, reply) {
    const tasks = await getTasks()
    if (!tasks) return reply.status(500).send(errorMessage)
    return reply.status(200).render('index.pug', { tasks });
}

async function addTaskPost(request, reply) {
    const { title } = request.body
    if (request.validationError) reply.status(400).send(request.validationError)

    const task = { id: uuidv4(), title, completed: false }
    const res = await postTask(task)
    if (!res) return reply.status(500).send(errorMessage) 
    return reply.status(201).send(task)
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

async function updateTaskPut(request, reply) {
    const id = request.params.id
    const taskData = JSON.parse(request.body)
    const task = { id, ...taskData }

    const res = await updateTask(task)
    if (!res) return reply.status(500).send(errorMessage) 
    return reply.status(200).send({ message: 'OK' })
}

const updateTaskPut_settings = {
  attachValidation: true,
  schema: {
    body: object({
      title: string().min(2),
      completed: boolean().required()
    }),
    params: object({
      id: string().required().length(36)
    })
  },
  validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
    try {
      const parsedData = JSON.parse(data)

      console.log('\n', data, '\n')
      const result = schema.validateSync(parsedData)
      return { value: result }
    } catch(e) {
      return { error: e }
    }
  }
}

async function deleteTaskDelete(request, reply) {
  const taskId = request.params.id

  const res = await deleteTask(taskId)
  if (!res) return reply.status(500).send(errorMessage) 
  reply.status(200).send({ message: 'OK' })
}

export { tasksGet, deleteTaskDelete, addTaskPost, addTaskPost_settings, updateTaskPut, updateTaskPut_settings }