import { dirname, join } from 'path'
import fastifyStatic from '@fastify/static'
import fastifyJwt from 'fastify-jwt'
import auth from './models/auth.js'
import tasks from './models/tasks.js'

export default function (fastify, filename) {
  const __dirname = dirname(filename);
  const registrations = [
    {
      lib: fastifyJwt,
      settings: { secret: process.env.JWT_SECRET }
    },
    {
      lib: fastifyStatic,
      settings: {
        root: join(__dirname, 'public'),
        prefix: '/',
      }
    },
    {
      lib: auth,
      settings: { prefix: '/auth' }
    },
    {
      lib: tasks,
      settings: { prefix: '/api' }
    }
  ]

  registrations.forEach(registration => {
    const { lib, settings } = registration
    fastify.register(lib, settings)
  })
}