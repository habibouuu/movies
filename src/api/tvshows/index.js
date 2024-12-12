
import axios from 'axios'

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


export default {
    getComedyShow,
    getDramaShow,
    getActionShow
}