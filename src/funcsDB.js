import { supabase } from "./config/db.js";

async function getTasks(userId) {
  const { data, error } = await supabase
  .from('items')
  .select('*')
  .eq('user_id', userId)
  
  return { tasks: data, error }
}

async function postTask(task) {
  const { id, title, completed, user_id } = task
  const { data, error } = await supabase
    .from('items')
    .insert({
      id, title, completed, user_id
    })
    .select()

  return { task: data, error }
}

async function updateTask(task) {
  const { id, completed, user_id } = task
  const { data, error } = await supabase
    .from('items')
    .update({
      completed
    })
    .eq('id', id)
    .eq('user_id', user_id)
    .select()

  return { task: data, error }
}

async function deleteTask(taskId, userId) {
  const { data, error } = await supabase
  .from('items')
  .delete()
  .eq('id', taskId)
  .eq('user_id', userId)
  .select()

  return { task: data, error }
  
}

async function getUser(login) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('login', login)
    .single()
  
  return { user: data, error }
}

async function postUser(user) {
  const { id, login, password } = user
  const { data, error } = await supabase
    .from('users')
    .insert({
      id, login, password
    })
    .select()     

  return { user: data, error }
}


export { updateTask, getTasks, postTask, deleteTask, getUser, postUser }
