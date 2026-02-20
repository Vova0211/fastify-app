document.querySelector('form').addEventListener('submit', async e => {
    e.preventDefault()
    const data = e.target.task.value
    await fetch('/add', {method: 'POST', body: JSON.stringify({data})})
    location.reload()
})
document.querySelectorAll('.btn_delete').forEach(btn => {
    btn.addEventListener('click', async e => {
        e.preventDefault()
        const id = e.target.parentNode.id
        await fetch(`/delete/${id}`, { method: 'DELETE' })
        location.reload()
    })
})