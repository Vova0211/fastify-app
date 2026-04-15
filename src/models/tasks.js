import { object, string, boolean } from 'yup'
import { v4 as uuidv4 } from 'uuid';

import { updateTask, getData, updateData } from "../funcs.js"

async function tasksGet(request, reply) {
    const { tasks } = getData()
    return reply.status(200).render('index.pug', { tasks });
}

async function addTaskPost(request, reply) {
    const { title } = request.body
    const data = getData()
    if (request.validationError) reply.status(400).send(request.validationError)

    const task = { id: uuidv4(), title, completed: false }
    data.tasks.push(task)
    updateData(data)
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

async function updateTaskPut(request, reply) {
    const data = getData()
    const taskId = request.params.id
    const taskData = JSON.parse(request.body)

    updateTask(data.tasks, taskId, taskData)
    updateData(data)
    reply.status(200).send({ message: 'OK' })
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
  const data = getData()
  const { tasks } = data
  const taskId = request.params.id
  const updatedTasks = tasks.filter(e => e.id != taskId)

  if (updatedTasks.length == tasks.length) reply.status(404).send({ message: 'Item not found' })
  
  tasks.splice(0, tasks.length, ...updatedTasks)

  updateData(data)
  reply.status(200).send({ message: 'OK' })
}

export { tasksGet, deleteTaskDelete, addTaskPost, addTaskPost_settings, updateTaskPut, updateTaskPut_settings }