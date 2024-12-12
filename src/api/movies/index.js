
import axios from 'axios';

async function getComedyMov(page){
    let data
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=35`,
        headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVmOWQzZjFlODc0ZmJlYTYwNzg0OTRhNTExYTZkNCIsIm5iZiI6MTY4NzgxNzY1Mi41MjE5OTk4LCJzdWIiOiI2NDlhMGRiNGZlZDU5NzAxMmNlYjVlYzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ly6wetUFMFN2skJcdXUgYJNs4I_Y4CJr8GSAD_ZifeU'
  }
      };
      
      await axios
        .request(options)
        .then(res => {
            // console.log(res.data)
            data=res.data
        })
        .catch(err => console.error(err));
        console.log(data)
        return data
}
async function getDramaMov(page){
    let data
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=18`,
        headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVmOWQzZjFlODc0ZmJlYTYwNzg0OTRhNTExYTZkNCIsIm5iZiI6MTY4NzgxNzY1Mi41MjE5OTk4LCJzdWIiOiI2NDlhMGRiNGZlZDU5NzAxMmNlYjVlYzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ly6wetUFMFN2skJcdXUgYJNs4I_Y4CJr8GSAD_ZifeU'
  }
      };
      
     await axios
        .request(options)
        .then(res => {
            console.log(res.data)
            data = res.data
        })
        .catch(err => console.error(err));

        
        return data
}
async function getActionMov(page){
    let data
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=28`,
        headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVmOWQzZjFlODc0ZmJlYTYwNzg0OTRhNTExYTZkNCIsIm5iZiI6MTY4NzgxNzY1Mi41MjE5OTk4LCJzdWIiOiI2NDlhMGRiNGZlZDU5NzAxMmNlYjVlYzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ly6wetUFMFN2skJcdXUgYJNs4I_Y4CJr8GSAD_ZifeU'
  }
      };
      
     await axios
        .request(options)
        .then(res => {
            console.log(res.data)
            data = res.data
        })
        .catch(err => console.error(err));
        return data
}
async function getUpcomingMov(page){
    let data
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}`,
        headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVmOWQzZjFlODc0ZmJlYTYwNzg0OTRhNTExYTZkNCIsIm5iZiI6MTY4NzgxNzY1Mi41MjE5OTk4LCJzdWIiOiI2NDlhMGRiNGZlZDU5NzAxMmNlYjVlYzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ly6wetUFMFN2skJcdXUgYJNs4I_Y4CJr8GSAD_ZifeU'
  }
      };
      
     await axios
        .request(options)
        .then(res => {
            console.log(res.data)
            data = res.data
        })
        .catch(err => console.error(err));
        return data
}
async function searchMovies(page,query){
    let data
    const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTVmOWQzZjFlODc0ZmJlYTYwNzg0OTRhNTExYTZkNCIsIm5iZiI6MTY4NzgxNzY1Mi41MjE5OTk4LCJzdWIiOiI2NDlhMGRiNGZlZDU5NzAxMmNlYjVlYzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ly6wetUFMFN2skJcdXUgYJNs4I_Y4CJr8GSAD_ZifeU'
        }
      };
      
      await axios
        .request(options)
        .then(res =>{
            console.log(res.data)
            data=res.data
        })
        .catch(err => console.error(err));
        return data
}


export default {
    getComedyMov,
    getDramaMov,
    getActionMov,
    getUpcomingMov,
    searchMovies
}