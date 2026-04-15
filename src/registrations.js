import path from 'path'
import fastifyView from '@fastify/view'
import fastifyStatic from '@fastify/static'
import fastifyFormbody from '@fastify/formbody';
import fastifyJwt from 'fastify-jwt';
import pug from 'pug'

export default function (fastify, filename) {
  const __dirname = path.dirname(filename);
  const registrations = [
    {
      lib: fastifyJwt,
      settings: {
        secret: 'supersecretkey',
        sign: {
          expiresIn: '1h'
        }
      }
    },
    {
      lib: fastifyStatic,
      settings: {
        root: path.join(__dirname, 'scripts'),
        prefix: '/scripts/',
      }
    },
    {
      lib: fastifyView,
      settings: {
        engine: {
          pug: pug,
        },
        root: path.join(__dirname, 'templates'),
        propertyName: 'render'
      }
    },
    {
      lib: fastifyFormbody,
      settings: {}
    },
  ]

  registrations.forEach(registration => {
    const { lib, settings } = registration
    fastify.register(lib, settings)
  })
}