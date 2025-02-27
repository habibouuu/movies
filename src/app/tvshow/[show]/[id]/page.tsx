"use client"
import { Container, Box, Typography } from '@mui/material';
import { useParams } from 'next/navigation'

import React from 'react'
// import Video from 'next-video';
export default function page() {
    const params:{id:string,show?:string} = useParams();
  return (
    <Container sx={{height:{xs:'400px', md:'500px', lg:'630px', mt:2}, display:'flex', flexDirection:'column'}}>
        <iframe sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation" width="100%" height="100%" src={`https://vidsrc.to/embed/tv/${params.id}`} title={params.show+''} frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      <Box sx={{p:3}}/>
      <Typography variant='h1'>{params.show && params.show.split('%20').join(' ').split('%3').join(': ')}</Typography>
    </Container>
  )
}
