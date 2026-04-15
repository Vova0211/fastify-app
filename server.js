import Fastify from 'fastify';
import { fileURLToPath } from 'url'

import routesList from './src/crudFuncs.js';
import setRoutes from './src/routes.js';
import registerFastify from './src/registrations.js';

const __filename = fileURLToPath(import.meta.url);

const fastify = Fastify({
  logger: true
});

export { fastify }

fastify.decorate("authenticate", async function(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

registerFastify(fastify, __filename)
setRoutes(fastify, routesList)

const start = async () => {
  try {
    const settings = { port: 3000 }
    await fastify.listen(settings);
    console.log(`\nServer listening on http://localhost:${settings.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();