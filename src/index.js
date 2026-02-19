document.querySelector('form').addEventListener('submit', async e => {
    e.preventDefault()
    const data = e.target.task.value
    await fetch('/add', {method: 'POST', body: JSON.stringify({data})})
    location.reload()
})
document.querySelector('a').addEventListener('click', async e => {
    const li = e.target.parentNode()
    await fetch('/add', {method: 'DELETE', body: JSON.stringify({data})})
    location.reload()
})