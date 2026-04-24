import { API } from "./api.js";
import { LS } from "./localStorage.js";

const state = {
    auth: {
        error: '',
        success: false,
        isAuth: true,
    }
}

const elements = {
    auth: {
        authForm: document.querySelector('.authForm'),
        signInBtn: document.querySelector('.signIn'),
        signUpBtn: document.querySelector('.signUp'),
        logOutBtn: document.querySelector('.logOut')
    },
    tasks: {
        taskForm: document.querySelector('.taskForm'),
        tasksBox: document.querySelector('.tasksBox'),
        tasksList: document.querySelector('.tasksList')
    },
    main: document.querySelector('main'),
    errorBox: document.querySelector('.errors'),
    successBox: document.querySelector('.answer'),
}

const handlers = {
    async signIn(e) {
        const { auth: { authForm, signInBtn } } = elements

        const formData = new FormData(authForm)
        const login = formData.get('login')
        const password = formData.get('password')
        
        const answer = await API.login(login, password)
        const { token, message } = await answer.json()

        if (answer.ok) {
            state.auth = {
                error: null,
                success: true,
                isAuth: true,
            }
            LS.setToken(token)
        } else {
            state.auth = {
                error: message,
                success: false
            }
        }

        authForm.reset()
        render(state)
    },
    async signUp(e) {
        const { auth: { authForm } } = elements
        
        const formData = new FormData(authForm)
        const login = formData.get('login')
        const password = formData.get('password')

        const answer = await API.register(login, password)
        const { message } = await answer.json()
        if (answer.ok) {
            state.auth = {
                error: null,
                success: true
            }
        } else {
            state.auth = {
                error: message,
                success: false
            }
        }
        authForm.reset()
        render(state)
    },
    async logOut(e) {
        LS.clearToken()
        state.auth = {
            error: null,
            success: false,
            isAuth: false
        }
        render(state)
    },
    async createTask(e) {
        e.preventDefault()
        const token = LS.getToken()
        const title = e.target.title.value.trim()
        const answer = await API.postTask(token, title)
        const { error } = await answer.json()
        e.target.reset()
        render(state)
    },
    async editTask(e) {
        const parentDiv = e.target.parentNode
        const id = parentDiv.dataset.id
        const completed = parentDiv.parentNode.querySelector('.completed').textContent == 'Completed'
        const token = LS.getToken()
        const task = {
            id,
            completed: !completed
        }
        const { message } = await API.editTask(token, task)
        render(state)
    },
    async deleteTask(e) {
        const id = e.target.parentNode.dataset.id
        const token = LS.getToken()

        const { message } = await API.deleteTask(token, id)
        render(state)
    }
}

async function getTasks(token) {
    const answer = await API.getTasks(token)
    return await answer.json() 
}

function createTaskEl(task) {
    const { id, title, completed } = task
    const el = document.createElement('li')
    el.className = 'task'
    el.innerHTML = `
    <h3 class="title">${title}</h3>
    <p class="completed">${completed ? "Completed" : "In progress"}</p>
    <div class="taskEdit" data-id="${id}">
      <button class="changeTask">Change</button>
      <button class="deleteTask">Delete</button>
    </div>`
  return el
}

async function render(state) {
    const { auth } = state
    const { errorBox, successBox, main, tasks: { tasksList, taskTemplate, tasksBox }, auth: { signInBtn} } = elements
    errorBox.textContent = auth.error ? auth.error : ''
    successBox.textContent = auth.success ? "Success" : ''
    main.classList.add('d-none')
    tasksBox.classList.add('d-none')
    tasksList.innerHTML = ''
    document.createElement('button').disabled
    signInBtn.disabled = auth.isAuth

    const token = LS.getToken()
    if (token) {
        main.classList.remove('d-none')
        const { tasks, message } = await getTasks(token)
        if (!tasks || tasks.length == 0) {
            errorBox.textContent = message
            return
        }
        tasksBox.classList.remove('d-none')
        tasks.forEach(task => {
            const taskEl = createTaskEl(task)
            taskEl.querySelector('.changeTask').addEventListener('click', handlers.editTask)
            taskEl.querySelector('.deleteTask').addEventListener('click', handlers.deleteTask)
            tasksList.append(taskEl)
        })
    }
}

elements.auth.signInBtn.addEventListener('click', handlers.signIn)
elements.auth.signUpBtn.addEventListener('click', handlers.signUp)
elements.auth.logOutBtn.addEventListener('click', handlers.logOut)
elements.tasks.taskForm.addEventListener('submit', handlers.createTask)
render(state)