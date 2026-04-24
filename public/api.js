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
    return fetch('/auth/login', {
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
  },
  async editTask(token, task) {
    const { authBearer, bodyParser, contentType } = settings
    const { id, completed } = task
    return fetch(`/api/items/${id}`, {
      method: "PUT",
      headers: { ...authBearer(token), ...contentType()},
      body: bodyParser({ completed })
    })
  },
  async deleteTask(token, taskId) {
    const { authBearer } = settings
    return fetch(`/api/items/${taskId}`, {
      method: "DELETE",
      headers: authBearer(token)
    })
  },
}

export { API }