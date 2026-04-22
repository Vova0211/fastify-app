document.querySelector('form').addEventListener('submit', async e => {
    e.preventDefault()
    const title = e.target.task.value
    const resp = await fetch('/add', {method: 'POST', body: JSON.stringify({title}) })
    if (resp.status == 201) location.reload()
})
document.querySelectorAll('.btn_delete').forEach(btn => {
    btn.addEventListener('click', async e => {
        e.preventDefault()
        const id = e.target.parentNode.id
        const response = await fetch(`/delete/${id}`, { method: 'DELETE' })
        location.reload()
    })
})
document.querySelectorAll('.btn_update').forEach(btn => {
    btn.addEventListener('click', async e => {
        e.preventDefault()
        const titleInp = e.target.parentNode.querySelector('.title').value.trim()
        const titleEl = e.target.parentNode.firstChild.textContent
        const id = e.target.parentNode.id

        const title = titleInp !== '' ? titleInp : titleEl  
        const completed = e.target.parentNode.querySelector('.completed').checked
        
        const response = await fetch(`/update/${id}`, { method: 'PUT', body: JSON.stringify({ title, completed }) })
        location.reload()
    })
})
