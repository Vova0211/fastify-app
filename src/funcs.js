import { readFileSync, writeFileSync} from 'node:fs'
import path from 'node:path'

function updateTask(tasks, id, data) {
  const index = tasks.findIndex(e => e.id == id)
  const task = tasks[index]
  const updated = tasks.with(index, { ...task, ...data })
  tasks.splice(0, tasks.length, ...updated)
}

const dbPath = path.join('', 'db.json')

function getData() {
  const json = readFileSync(dbPath)
  return JSON.parse(json)
}

function updateData(data) {
  const jsonData = JSON.stringify(data)
  writeFileSync(dbPath, jsonData)
}

export { updateTask, getData, updateData }
