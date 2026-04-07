const form = document.getElementById('loginForm')

form.addEventListener('submit', async e => {
    e.preventDefault()
    const login = e.target.login.value
    const password = e.target.password.value
    const user = { username: login, password: password}
    const res = await fetch('/login', {method: 'POST', body: JSON.stringify(user)})
    const data = await res.json()
    document.cookie = `token=${data.token}; max-age=${3600 * 1000}`
    location.reload()
})