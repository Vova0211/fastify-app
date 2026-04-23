import { hash, compare } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import { object, string } from 'yup';

import { getUser, postUser } from "../funcsDB.js"

export default async function (fastify) {
  function message(messageText) {
    return { message: messageText }
  }

  const registerSchema = {
    schema: {
      body: object({
        login: string().min(3).required(),
        password: string().min(8).required()
      })
    },
    validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
      try {
        const result = schema.validateSync(data)
        return { value: result }
      } catch (e) {
        return { error: e }
      }
    }
  }

  fastify.post('/register', registerSchema, async (request, reply) => {
    const { login, password } = request.body

    const saltRounds = 8
    const passwordHash = await hash(password, saltRounds)
    const user = {
      id: uuidv4(),
      login,
      password: passwordHash
    }
    const { error } = await postUser(user)
    if (error) return reply.status(400).send(message(error));
    return reply.status(201).send(user)
  })

  fastify.post('/login', async (request, reply) => {
    const { login, password } = request.body
    console.log('\n', password, '\n');
    
    const { user, error } = getUser(login)
    console.log('\n', user, '\n');

    if (!user || error) return reply.status(401).send(message('Invalid username or password'))
    if (!compare(password, user.password)) {
      return reply.status(401).send(message('Invalid username or password'))
    }
    const token = fastify.jwt.sign({ user_id: user.id });
    return reply.status(200).send({ token });
  })
}