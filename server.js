import Fastify from 'fastify';
import { fileURLToPath } from 'url'
import 'dotenv/config'

import registerFastify from './src/registrations.js';

const __filename = fileURLToPath(import.meta.url);

const fastify = Fastify({ logger: true });

registerFastify(fastify, __filename)

const start = async () => {
  try {
    const port = process.env.PORT || 3000
    await fastify.listen({ port });
    console.log(`\nServer listening on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();