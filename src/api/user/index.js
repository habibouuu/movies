import supabase from '../'
import util from '../userFunctions'
async function getUser(){

   
    const { data: { user } } = await supabase.auth.getUser()

    const { data: userInfo, error } = await supabase
    .from('userInfo')
    .select('*')
    .eq('id', user.id)

    if(!userInfo[0]) await util.insertUser(user.id);

    return user
  
}
async function getSession(){

    const { data: { session } } = await supabase.auth.getSession()
    
    return session
  
}

async function login(email, password){

    let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })

   if(data.user) return data
   return null
  
}

async function logout(){

    let { error } = await supabase.auth.signOut()

}

async function signup(email, password, firstname, lastname){
    
let { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
        data:{
            first_name: firstname,
            last_name:lastname
        }
    }
  })
  console.log('here')
  console.log(data)
  if(data.user) return data
  return false
  

}

async function changePassword(email, password){

    
    
const { data, error } = await supabase.auth.updateUser({
    email: email,
    password: password,
    data: { hello: 'world' }
  })
  
      
    
    }






export default {
    login,
    logout,
    signup,
    getUser,
    getSession,
    changePassword
}