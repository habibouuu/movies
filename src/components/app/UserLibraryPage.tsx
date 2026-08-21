'use client'

import { Box, Pagination, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import util from 'api/userFunctions'
import UserMovieBox from 'components/app/UserMovieBox'

type LibraryList = 'favorites' | 'watchlater' | 'history'

type MediaItem = {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string
  first_air_date: Date
  name: string
  vote_average: number
  vote_count: number
  original_title: string
  release_date: Date
  title: string
  video: boolean
  mediaType?: 'movie' | 'tv'
}

export default function UserLibraryPage({
  list,
  title,
  emptyText
}: {
  list: LibraryList
  title: string
  emptyText: string
}) {
  const [movies, setMovies] = useState<MediaItem[]>([])
  const [totalPages, setTotal] = useState(1)
  const [page, setPage] = useState(1)
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    ;(async () => {
      const data = await util.getUserMovies(page)
      if (!data) return
      setMovies(data[list].movies || [])
      setTotal(Math.max(1, Math.ceil((data[list].total || 0) / 20)))
    })()
    setRefresh(false)
  }, [page, refresh, list])

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* <Typography variant="h2" sx={{ alignSelf: 'flex-start', px: { xs: 1, md: 2 } }}>
        {title}
      </Typography> */}
      {movies.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {emptyText}
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 1, md: 3 },
              flexWrap: 'wrap'
            }}
          >
            {movies.map((elem, index) => (
              <UserMovieBox
                key={elem.id ?? index}
                typee={elem.mediaType === 'tv' ? 'shows' : elem.mediaType === 'movie' ? 'movies' : elem.title ? 'movies' : 'shows'}
                item={elem}
                setDD={setRefresh}
                typ={list === 'watchlater' ? 'watchlater' : list === 'favorites' ? 'favorites' : 'history'}
              />
            ))}
          </Box>
          {totalPages > 1 && <Pagination count={totalPages} page={page} onChange={handleChange} />}
        </>
      )}
    </div>
  )
}
