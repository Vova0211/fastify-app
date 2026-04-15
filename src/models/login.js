import { getData } from "../funcs.js"
import bcrypt from 'bcrypt'

import { fastify } from "../../server.js";

async function loginGet(request, reply) {
  return reply.status(200).render('login.pug', {});
}

async function loginPost(request, reply) {
  const body = JSON.parse(request.body)
  const { username, password } = body;
  const { user } = getData()
  const uPassword = user.password
  
  if (username === user.login && await bcrypt.compare(password, uPassword)) {
    const token = fastify.jwt.sign({ username, role: 'admin' });
    return reply.status(200).send({ token });
  }

  return reply.status(401).send({ error: 'Неверные данные' });
}

export { loginGet, loginPost }