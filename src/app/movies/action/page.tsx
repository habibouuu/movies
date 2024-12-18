"use client"
import { Box, Pagination} from '@mui/material'
import React, {useEffect, useState} from 'react'
import util from 'api/movies'
import MovieBox from 'components/app/MovieBox';

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
    useEffect(()=>{
        (async()=>{
            const a:any= await util.getActionMov(page);
            console.log(a)
            if(a) {
                setMovies(a.results);
                setTotal(Math.ceil(500));

            }
        })();
    },[page])
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
      };
  return (
    <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column', gap:'30px' , justifyContent:'center',alignItems:'center'}}>
      <Box sx={{width:'100%', display:'flex', justifyContent:'center',alignItems:'center', gap:{xs:1, md: 3}, flexWrap: 'wrap'}}>

        {Movies.map((elem:any,index:number)=><MovieBox item ={elem}/>)}
        
      </Box>
      <Pagination count={totalPages} page={page} onChange={handleChange}></Pagination>
    </div>
  )
}
