"use client"
import { Box, Pagination} from '@mui/material';
import React, {useEffect, useState} from 'react';
import util from 'api/userFunctions';
import UserMovieBox from 'components/app/UserMovieBox';

export default function page() {
    type movi = 
          {
            "adult": boolean,
            "backdrop_path": string,
            "genre_ids": number[],
            "id": number,
            "origin_country": string[],
            "original_language": string,
            "original_name": string,
            "overview": string,
            "popularity": number,
            "poster_path":string,
            "first_air_date": Date,
            "name": string,
            "vote_average": number,
            "vote_count": number,
            "original_title": string,
            "release_date": Date,
            "title": string,
            "video": boolean
          };
    const [Movies, setMovies] = useState<movi[]>([]);
    const [totalPages, setTotal] = useState<number>(1);
    const [page,setPage] = useState<number>(1)
    const [dd,setDD] = useState(false)
    useEffect(()=>{
        (async()=>{
            const a:any= await util.getUserMovies(page);
                        console.log(a)
                        if(a) {
                            setMovies(a.favorites.movies);
                            setTotal(Math.ceil(a.favorites.total/20));
            
                        }
        })();
        setDD(false)
    },[page,dd])
    console.log(dd)
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
      };
  return (
    <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column', gap:'30px' , justifyContent:'center',alignItems:'center'}}>
      <Box sx={{width:'100%', display:'flex', justifyContent:'center',alignItems:'center', gap:{xs:1, md: 3}, flexWrap: 'wrap'}}>

        {Movies.map((elem:any,index:number)=><UserMovieBox item ={elem} setDD={setDD} typ='favorites'/>)}
        
      </Box>
      <Pagination count={totalPages} page={page} onChange={handleChange}></Pagination>
    </div>
  )
}
