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
      const result = schema.validateSync(data)
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
      completed: boolean().required()
    }),
    params: object({
      id: string().required().length(36)
    })
  },
  validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
    try {
      const result = schema.validateSync(data)
      return { value: result }
    } catch(e) {
      return { error: e }
    }
  }
  }

  function message(messageText) {
    return { message: messageText }
  }
  
  fastify.get('/items', async (request, reply) => {
    const { user_id } = await request.jwtVerify()
    const { tasks, error } = await getTasks(user_id)
    if (error) return reply.status(400).send(message(error))
    return reply.status(200).send({tasks})
  })

  fastify.post('/items', addTaskSchema, async (request, reply) => {
    if (request.validationError) return reply.status(400).send(request.validationError)
    const { user_id } = await request.jwtVerify()
    const { title } = request.body

    const task = { id: uuidv4(), title, completed: false, user_id }
    const { error } = await postTask(task)
    if (error) return reply.status(500).send(message(error)) 
    return reply.status(201).send(task)
  })

  fastify.put('/items/:id', updateTaskSchema, async (request, reply) => {
    if (request.validationError) reply.status(400).send(request.validationError)
    const { user_id } = await request.jwtVerify()
    
    const id = request.params.id
    const { completed } = request.body
    const task = { id, user_id, completed }

    const { error } = await updateTask(task)
    if (error) return reply.status(500).send(message(error)) 
    return reply.status(200).send(message('OK'))
  })

  fastify.delete('/items/:id', async (request, reply) => {
    const { user_id } = await request.jwtVerify()
    const id = request.params.id

    const { error } = await deleteTask(id, user_id)
    if (error) return reply.status(500).send(message(error)) 
    return reply.status(200).send(message('OK'))
  })
}