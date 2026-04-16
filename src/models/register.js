import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';

import { postUser } from "../funcsDB.js"

async function registerGet(request, reply) {
    return reply.status(200).render('register.pug', {});
}

async function registerPost(request, reply) {
    const body = JSON.parse(request.body)
    const { login, password } = body

    const saltRounds = 8
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = {
        id: uuidv4(),
        login,
        password: passwordHash
    }
    postUser(user)
    return reply.status(201).send(user)
}

export { registerGet, registerPost }