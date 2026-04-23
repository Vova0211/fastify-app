import { API } from "./api.js";
import { LS } from "./localStorage.js";

const state = {

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
        tasksList: document.querySelector('.tasksList')
    },
    main: document.querySelector('main'),
    errorBox: document.querySelector('.errors'),
    answerBox: document.querySelector('.answer'),
}

function render(state, elements) {

}

async function signInHendler(e) {
    const { auth: { authForm }, errorBox } = elements

    const formData = new FormData(authForm)
    const login = formData.get('login')
    const password = formData.get('password')
    if (!login || !password) {
        errorBox.textContent = "Insert login and password"
        return
    }
    const answer = await API.login(login, password)
    if (!answer.ok) {
        errorBox.textContent = "Incorrect login or password"
        return
    }
    const { token } = await answer.json()
    LS.setToken(token)
    console.log(token)
}

async function signUpHendler(e) {
    const { auth: { authForm }, errorBox, answerBox } = elements
    
    const formData = new FormData(authForm)
    const login = formData.get('login')
    const password = formData.get('password')
    if (!login || !password) {
        errorBox.textContent = "Insert login and password"
        return
    }
    const answer = await API.register(login, password)
    const { message } = await answer.json()
    if (!answer.ok) {
        errorBox.textContent = message
        return
    }
    answerBox.textContent = "Register success"
    // location.reload()
}

async function logOutHandler(e) {
    LS.clearToken()
}

elements.auth.signInBtn.addEventListener('click', signInHendler)
elements.auth.signUpBtn.addEventListener('click', signUpHendler)
elements.auth.logOutBtn.addEventListener('click', logOutHandler)
