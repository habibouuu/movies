import supabase from '../'
import util from '../user'


async function insertUser(id){
   
    const { data, error } = await supabase
    .from('userInfo')
    .insert([
    { 'id': id},
    ])
    .select()    
}
async function getUserMovies(page){
    const user = await util.getUser();
    let { data: userInfo, error } = await supabase
        .from('userInfo')
        .select('*')
        .eq('id', user.id)
    if(userInfo[0]){
        console.log('fix')
        return {
        'watchlater':{
            total: userInfo[0].watchlater.length,
            movies: userInfo[0].watchlater.slice((page-1)*20,page*20)
        }, 
        'favorites':{
            total: userInfo[0].favorites.length,
            movies: userInfo[0].favorites.slice((page-1)*20,page*20),
        } 
        
    }
    }
    return {
        'watchlater': {
            total: 0,
            movies: []
        },
        'favorites': {
            total: 0,
            movies: []
        }
    } 
}
async function getUserMov(){
    const user = await util.getUser();
    let { data: userInfo, error } = await supabase
        .from('userInfo')
        .select('*')
        .eq('id', user.id)
    if(userInfo[0]){
        console.log('fix')
        return {
        'watchlater':{
            total: userInfo[0].watchlater.length,
            movies: userInfo[0].watchlater
        }, 
        'favorites':{
            total: userInfo[0].favorites.length,
            movies: userInfo[0].favorites
        } 
        
    }
    }
    return {
        'watchlater': {
            total: 0,
            movies: []
        },
        'favorites': {
            total: 0,
            movies: []
        }
    } 
}

async function addFavorites(movie){
    const user = await util.getUser();
    const movies = await getUserMov();
    let names = movies.favorites.movies.map(elem=> elem.name?elem.name: elem.title);
    if(!names.includes(movie.name) && !names.includes(movie.title)){
        const { data, error } = await supabase
        .from('userInfo')
        .update({ favorites: [...movies.favorites.movies,movie] })
        .eq('id', user.id)
        .select()
    }

        
}
async function addwatchlater(movie){
    const user = await util.getUser();
    const movies = await getUserMov();
    let names = movies.watchlater.movies.map(elem=> elem.name?elem.name: elem.title);
    if(!names.includes(movie.name) && !names.includes(movie.title)){
        const { data, error } = await supabase
    .from('userInfo')
    .update({ watchlater: [...movies.watchlater.movies,movie] })
    .eq('id', user.id)
    .select()
    }
}
async function deletefavorite(movie){
    const user = await util.getUser();
    let movies = await getUserMov();
    let ex = movies.favorites.movies.filter(elem=>(movie.title?elem.title!=movie.title:elem.name!=movie.name))
    const { data, error } = await supabase
    .from('userInfo')
    .update({ favorites: ex })
    .eq('id', user.id)
    .select()
}
async function deletewatchlater(movie){
    const user = await util.getUser();
    let movies = await getUserMov();
    console.log(movie.title)
    console.log(movies.watchlater.movies)
    let ex = movies.watchlater.movies.filter(elem=>(movie.title?elem.title!=movie.title:elem.name!=movie.name))
    console.log(movies.watchlater.movies)
    const { data, error } = await supabase
    .from('userInfo')
    .update({ watchlater: ex })
    .eq('id', user.id)
    .select()
}


export default {
    insertUser,
    getUserMovies,
    addFavorites,
    addwatchlater,
    deletefavorite,
    deletewatchlater
}