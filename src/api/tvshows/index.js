
import axios from 'axios'

async function getTrendingShow(){
    let data
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/tv/popular?language=en-US&page=1`,
        headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVmOWQzZjFlODc0ZmJlYTYwNzg0OTRhNTExYTZkNCIsIm5iZiI6MTY4NzgxNzY1Mi41MjE5OTk4LCJzdWIiOiI2NDlhMGRiNGZlZDU5NzAxMmNlYjVlYzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ly6wetUFMFN2skJcdXUgYJNs4I_Y4CJr8GSAD_ZifeU'
  }
      };
      
     await axios
        .request(options)
        .then(res => {
            console.log(res.data)
            data = res.data.results
        })
        .catch(err => console.error(err));
       
        return data
        


}
async function getTopratedShow(){
    let data
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1`,
        headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVmOWQzZjFlODc0ZmJlYTYwNzg0OTRhNTExYTZkNCIsIm5iZiI6MTY4NzgxNzY1Mi41MjE5OTk4LCJzdWIiOiI2NDlhMGRiNGZlZDU5NzAxMmNlYjVlYzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ly6wetUFMFN2skJcdXUgYJNs4I_Y4CJr8GSAD_ZifeU'
  }
      };
      
     await axios
        .request(options)
        .then(res => {
            console.log(res.data)
            data = res.data.results
        })
        .catch(err => console.error(err));
       
        return data
        


}
async function getNowplayingShow(){
    let data
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1`,
        headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVmOWQzZjFlODc0ZmJlYTYwNzg0OTRhNTExYTZkNCIsIm5iZiI6MTY4NzgxNzY1Mi41MjE5OTk4LCJzdWIiOiI2NDlhMGRiNGZlZDU5NzAxMmNlYjVlYzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ly6wetUFMFN2skJcdXUgYJNs4I_Y4CJr8GSAD_ZifeU'
  }
      };
      
     await axios
        .request(options)
        .then(res => {
            console.log(res.data)
            data = res.data.results
        })
        .catch(err => console.error(err));
       
        return data
        


}

async function getComedyShow(page){
    let data
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=35`,
        headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVmOWQzZjFlODc0ZmJlYTYwNzg0OTRhNTExYTZkNCIsIm5iZiI6MTY4NzgxNzY1Mi41MjE5OTk4LCJzdWIiOiI2NDlhMGRiNGZlZDU5NzAxMmNlYjVlYzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ly6wetUFMFN2skJcdXUgYJNs4I_Y4CJr8GSAD_ZifeU'
  }
      };
      
      await axios
        .request(options)
        .then(res => {
            // console.log(res.data)
            data= res.data
        })
        .catch(err => console.error(err));
        return data
        
}
async function getDramaShow(page){
    let data
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=18`,
        headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVmOWQzZjFlODc0ZmJlYTYwNzg0OTRhNTExYTZkNCIsIm5iZiI6MTY4NzgxNzY1Mi41MjE5OTk4LCJzdWIiOiI2NDlhMGRiNGZlZDU5NzAxMmNlYjVlYzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ly6wetUFMFN2skJcdXUgYJNs4I_Y4CJr8GSAD_ZifeU'
  }
      };
      
      await axios
        .request(options)
        .then(res => {
            // console.log(res.data)
            data= res.data
        })
        .catch(err => console.error(err));
        return data
        
}
async function getActionShow(page){
    let data
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=10759`,
        headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVmOWQzZjFlODc0ZmJlYTYwNzg0OTRhNTExYTZkNCIsIm5iZiI6MTY4NzgxNzY1Mi41MjE5OTk4LCJzdWIiOiI2NDlhMGRiNGZlZDU5NzAxMmNlYjVlYzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ly6wetUFMFN2skJcdXUgYJNs4I_Y4CJr8GSAD_ZifeU'
  }
      };
      
      await axios
        .request(options)
        .then(res => {
            // console.log(res.data)
            data= res.data
        })
        .catch(err => console.error(err));
        return data
        
}


async function getShowDetails(id){
    let data
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVmOWQzZjFlODc0ZmJlYTYwNzg0OTRhNTExYTZkNCIsIm5iZiI6MTY4NzgxNzY1Mi41MjE5OTk4LCJzdWIiOiI2NDlhMGRiNGZlZDU5NzAxMmNlYjVlYzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ly6wetUFMFN2skJcdXUgYJNs4I_Y4CJr8GSAD_ZifeU'
        }
      };
      
     await axios
        .request(options)
        .then(res => {
            data = res.data
        })
        .catch(err => console.error(err));
       
        return data
}

function sortByNewestRelease(items = []) {
    return items.slice().sort((a, b) => {
        const dateA = Date.parse(a.release_date || a.first_air_date || '')
        const dateB = Date.parse(b.release_date || b.first_air_date || '')
        const hasDateA = Number.isFinite(dateA)
        const hasDateB = Number.isFinite(dateB)

        if (hasDateA && hasDateB) return dateB - dateA
        if (hasDateA !== hasDateB) return hasDateA ? -1 : 1
        return 0
    })
}

async function getSimilarShows(id){
    let data
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`,
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVmOWQzZjFlODc0ZmJlYTYwNzg0OTRhNTExYTZkNCIsIm5iZiI6MTY4NzgxNzY1Mi41MjE5OTk4LCJzdWIiOiI2NDlhMGRiNGZlZDU5NzAxMmNlYjVlYzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ly6wetUFMFN2skJcdXUgYJNs4I_Y4CJr8GSAD_ZifeU'
        }
      };
      
     await axios
        .request(options)
        .then(res => {
            data = sortByNewestRelease(res.data.results)
        })
        .catch(err => console.error(err));
       
        return data
}

async function getSeasonDetails(id, seasonNumber){
    let data
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?language=en-US`,
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVmOWQzZjFlODc0ZmJlYTYwNzg0OTRhNTExYTZkNCIsIm5iZiI6MTY4NzgxNzY1Mi41MjE5OTk4LCJzdWIiOiI2NDlhMGRiNGZlZDU5NzAxMmNlYjVlYzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ly6wetUFMFN2skJcdXUgYJNs4I_Y4CJr8GSAD_ZifeU'
        }
      };
      
     await axios
        .request(options)
        .then(res => {
            data = res.data
        })
        .catch(err => console.error(err));
       
        return data
}

export default {
    getTrendingShow,
    getTopratedShow,
    getNowplayingShow,
    getComedyShow,
    getDramaShow,
    getActionShow,
    getShowDetails,
    getSimilarShows,
    getSeasonDetails
}