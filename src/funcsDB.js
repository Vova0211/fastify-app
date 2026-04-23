import { supabase } from "./config/db.js";

async function getTasks(userId) {
  try {
    const result = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    // .query('SELECT * FROM tasks WHERE user_id = $1;', [ userId ])
    return { tasks: result.data }
  } catch(error) {
    return { error }
  }
}

async function postTask(task) {
  const { id, title, completed, user_id } = task
  try {
    await supabase
      .from('tasks')
      .insert({
        id, title, completed, user_id
      })
    // await pool.query(`
    //   INSERT INTO tasks(id, title, completed, user_id)
    //   VALUES ($1, $2, $3, $4)`,
    //   [ id, title, completed, user_id ]
    // )
    return true
  } catch(error) {
    return { error }
  }
}

async function updateTask(task) {
  const { id, title, completed, user_id } = task
  try {
    await supabase
      .from('tasks')
      .update({
        title, completed
      })
      .eq('id', id)
      .eq('user_id', user_id)
    // pool.query(`
    //   UPDATE tasks
    //   SET title = $2, completed = $3
    //   WHERE id = $1 AND user_id = $4`,
    //   [ id, title, completed, user_id ]
    // )
    return true
  } catch(error) {
    return { error }
  }
}

async function deleteTask(taskId, userId) {
  try {
    await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', userId)
    // .query(`
    //   DELETE FROM tasks
    //   WHERE id = $1 AND user_id = $2`,
    //   [ taskId, userId ]
    // )
    return true
  } catch(error) {
    return { error }
  }
}

async function getUser(login) {
  try {
    const result = await supabase
      .from('users')
      .select('*')
      .eq('login', login)
      .single() 
    // pool.query(
    //   'SELECT * FROM users WHERE login = $1;',
    //   [ login ]
    // )
    return { user: result.data }
  } catch(error) {
    return { error }
  }
}

async function postUser(user) {
  const { id, login, password } = user
  try {
    await supabase
      .from('users')
      .insert({
        id, login, password
      })
    // pool.query(`
    //   INSERT INTO users(id, login, password, ) 
    //   VALUES ($1, $2, $3)`,
    //   [ id, login, password ]
    // )
    return { succes: true }
  } catch(error) {
    return { error }
  }
}


export { updateTask, getTasks, postTask, deleteTask, getUser, postUser }
