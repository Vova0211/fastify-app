function updateTask(tasks, id, data) {
  const index = tasks.findIndex(e => e.id == id)
  const task = tasks[index]
  const updated = tasks.with(index, { ...task, ...data })
  tasks.splice(0, tasks.length, ...updated)
}

export { updateTask }