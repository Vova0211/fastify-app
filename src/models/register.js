import bcrypt from 'bcrypt'

import { getData, updateData } from "../funcs.js"

async function registerGet(request, reply) {
    const { user } = getData()
    return reply.status(200).render('register.pug', { user });
}

async function registerPost(request, reply) {
    const body = JSON.parse(request.body)
    const { login, password } = body

    const saltRounds = 8
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const data = getData()
    data.user = {
        login,
        password: passwordHash
    }
    updateData(data)
    reply.status(201).send(data.user)
}

export { registerGet, registerPost }