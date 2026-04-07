const form = document.getElementById('registerForm')

form.addEventListener('submit', async e => {
    
    e.preventDefault()
    const login = e.target.login.value
    const password = e.target.password.value
    const user = { login: login, password: password}
    const res = await fetch('/register', {method: 'POST', body: JSON.stringify(user)})
    const data = await res.json()
    console.log(data);
    // debugger
    location.reload()
})
document.addEventListener('DOMContentLoaded', )