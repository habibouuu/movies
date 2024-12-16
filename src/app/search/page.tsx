"use client"
import { Box, Pagination} from '@mui/material'
import React, {useEffect, useState} from 'react'
import util from 'api/movies'
import MovieBox from 'components/app/MovieBox';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
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
    const [page,setPage] = useState<number>(1);
    const [query,setQuery] = useState<string>('');
    useEffect(()=>{
        (async()=>{
            const a:any= await util.searchMovies(page,query);
            console.log(a)
            if(a) {
                setMovies(a.results);
                setTotal(a.total_pages);

            }
        })();
    },[page, query])
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
      };
  return (
    <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column', gap:'30px' , justifyContent:'center',alignItems:'center'}}>
        <Box>
        <OutlinedInput
          id="input-search-header"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          startAdornment={
            <InputAdornment position="start">
              {/* <IconSearch stroke={1.5} size="16px" color={theme.palette.grey[500]} /> */}
            </InputAdornment>
          }
        //   endAdornment={
        //     <InputAdornment position="end">
        //       <HeaderAvatar variant="rounded">
        //         <IconAdjustmentsHorizontal stroke={1.5} size="20px" />
        //       </HeaderAvatar>
        //     </InputAdornment>
        //   }
          aria-describedby="search-helper-text"
          inputProps={{ 'aria-label': 'weight', sx: { bgcolor: 'transparent', pl: 0.5 } }}
          sx={{ width: { md: 250, lg: 434 }, ml: 2, px: 2 }}
        />
      </Box>
      <Box sx={{width:'100%', display:'flex', justifyContent:'center',alignItems:'center', gap:3, flexWrap: 'wrap'}}>

        {Movies.map((elem:any,index:number)=><MovieBox item ={elem}/>)}
        
      </Box>
      <Pagination count={totalPages} page={page} onChange={handleChange}></Pagination>
    </div>
  )
}
