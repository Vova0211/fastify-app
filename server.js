import Fastify from 'fastify';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url'
import 'dotenv/config'

import registerFastify from './src/registrations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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