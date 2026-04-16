import pool from "./config/db.js";

async function getTasks() {
  try {
    const result = await pool.query('SELECT * FROM tasks;')
    return result.rows
  } catch(e) {
    console.log('\n', e, '\n')
    return null
  }
}

async function postTask(task) {
  const { id, title, completed } = task
  try {
    await pool.query(`
      INSERT INTO tasks(id, title, completed)
      VALUES ($1, $2, $3)`,
      [ id, title, completed ]
    )
    return true
  } catch(e) {
    console.log('\n', e, '\n')
    return false
  }
}

async function updateTask(task) {
  const { id, title, completed } = task
  try {
    await pool.query(`
      UPDATE tasks
      SET title = $2, completed = $3
      WHERE id = $1`,
      [ id, title, completed ]
    )
    return true
  } catch(e) {
    console.log('\n', e, '\n')
    return false
  }
}

async function deleteTask(taskId) {
  try {
    await pool.query(`
      DELETE FROM tasks
      WHERE id = $1`,
      [ taskId ]
    )
    return true
  } catch(e) {
    console.log('\n', e, '\n')
    return false
  }
}

async function getUser(login) {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE login = $1;',
      [ login ]
    )
    return result.rows[0]
  } catch(e) {
    console.log('\n', e, '\n')
    return null
  }
}

async function postUser(user) {
  const { id, login, password, isadmin } = user
  try {
    await pool.query(`
      INSERT INTO users(id, login, password, isadmin) 
      VALUES ($1, $2, $3, $4)`,
      [ id, login, password, isadmin ?? false ]
    )
    return true
  } catch(e) {
    console.log('\n', e, '\n')
    return null
  }
}


export { updateTask, getTasks, postTask, deleteTask, getUser, postUser }
