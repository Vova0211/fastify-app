import bcrypt from 'bcrypt'

import { fastify } from "../../server.js";
import { getUser } from "../funcsDB.js"

async function loginGet(request, reply) {
  return reply.status(200).render('login.pug', {});
}

async function loginPost(request, reply) {
  const body = JSON.parse(request.body)
  const { username, password } = body;

  const user = await getUser(username)
  if (!user) return reply.status(401).send({ error: 'Неверные данные' });

  if (username === user.login && await bcrypt.compare(password, user.password)) {
    const token = fastify.jwt.sign({ username, role: 'admin' });
    return reply.status(200).send({ token });
  }

  return reply.status(401).send({ error: 'Неверные данные' });
}

export { loginGet, loginPost }