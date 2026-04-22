import pool from "./config/db.js";

async function getTasks(userId) {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1;', [ userId ])
    return { tasks: result.rows }
  } catch(error) {
    return { error }
  }
}

async function postTask(task) {
  const { id, title, completed, user_id } = task
  try {
    await pool.query(`
      INSERT INTO tasks(id, title, completed, user_id)
      VALUES ($1, $2, $3, $4)`,
      [ id, title, completed, user_id ]
    )
    return true
  } catch(error) {
    return { error }
  }
}

async function updateTask(task) {
  const { id, title, completed, user_id } = task
  try {
    await pool.query(`
      UPDATE tasks
      SET title = $2, completed = $3
      WHERE id = $1 AND user_id = $4`,
      [ id, title, completed, user_id ]
    )
    return true
  } catch(error) {
    return { error }
  }
}

async function deleteTask(taskId, userId) {
  try {
    await pool.query(`
      DELETE FROM tasks
      WHERE id = $1 AND user_id = $2`,
      [ taskId, userId ]
    )
    return true
  } catch(error) {
    return { error }
  }
}

async function getUser(login) {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE login = $1;',
      [ login ]
    )
    return { user: result.rows[0] }
  } catch(error) {
    return { error }
  }
}

async function postUser(user) {
  const { id, login, password } = user
  try {
    await pool.query(`
      INSERT INTO users(id, login, password, isadmin) 
      VALUES ($1, $2, $3, $4)`,
      [ id, login, password, isadmin ?? false ]
    )
    return { succes: true }
  } catch(error) {
    return { error }
  }
}


export { updateTask, getTasks, postTask, deleteTask, getUser, postUser }
