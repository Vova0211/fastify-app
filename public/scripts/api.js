const settings = {
  contentType() {
    return { 'Content-Type': 'application/json' }
  },
  authBearer(token) {
    return { 'Authorization': `Bearer ${token}` }
  },
  bodyParser(data) {
    return JSON.stringify(data)
  },
}

const API = {
  async register(login, password) {
    const { contentType, bodyParser } = settings;
    return fetch('/auth/register', {
      method: "POST",
      headers: contentType(),
      body: bodyParser({ login, password })
    })
  },
  async login(login, password) {
    const { contentType, bodyParser } = settings;
    return fetch('/auth/register', {
      method: "POST",
      headers: contentType(),
      body: bodyParser({ login, password })
    })
  },
  async getTasks(token) {
    const { authBearer } = settings;
    return fetch('/api/items', {
      headers: authBearer(token)
    })
  },
  async postTask(token, title) {
    const { authBearer, bodyParser, contentType } = settings
    return fetch('/api/items', {
      method: "POST",
      headers: { ...authBearer(token), ...contentType()},
      body: bodyParser({ title })
    })
  }
}

export { API }