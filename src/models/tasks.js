import { object, string, boolean } from 'yup'
import { v4 as uuidv4 } from 'uuid';

import { updateTask, getTasks, postTask, deleteTask } from "../funcsDB.js"

export default async function (fastify) {
  const addTaskSchema = {
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

  const updateTaskSchema = {
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
  
  fastify.get('/tasks', async (request, reply) => {
    const { user_id } = await request.jwtVerify()
    const { tasks, error } = await getTasks(user_id)
    if (error) return reply.status(400).send(error)
    return reply.status(200).send(tasks)
  })

  fastify.post('/tasks', addTaskSchema, async (request, reply) => {
    if (request.validationError) reply.status(400).send(request.validationError)
    const { user_id } = await request.jwtVerify()
    const { title } = request.body

    const task = { id: uuidv4(), title, completed: false, user_id }
    const res = await postTask(task)
    if (!res) return reply.status(500).send(errorMessage) 
    return reply.status(201).send(task)
  })

  fastify.put('/tasks/:id', updateTaskSchema, async (request, reply) => {
    if (request.validationError) reply.status(400).send(request.validationError)
    const { user_id } = await request.jwtVerify()
    
    const id = request.params.id
    const taskData = JSON.parse(request.body)
    const task = { id, user_id, ...taskData }

    const res = await updateTask(task)
    if (!res) return reply.status(500).send(errorMessage) 
    return reply.status(200).send({ message: 'OK' })
  })

  fastify.delete('/tasks/:id', async (request, reply) => {
    const { user_id } = await request.jwtVerify()
    const id = request.params.id

    const res = await deleteTask(id, user_id)
    if (!res) return reply.status(500).send(errorMessage) 
    return reply.status(200).send({ message: 'OK' })
  })
}