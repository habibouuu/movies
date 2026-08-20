"use client"
import { Container, Box, Typography, Chip, Stack, CircularProgress, Rating } from '@mui/material';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import util from 'api/movies'
import FrameworkSection from 'components/landingpage/FrameworkSection'

type MovieDetails = {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  runtime: number
  vote_average: number
  vote_count: number
  genres: { id: number; name: string }[]
  tagline: string
  status: string
  original_language: string
}

type SimilarMovie = {
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
}

export default function Page() {
  const params: { id: string; movie: string } = useParams()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [similar, setSimilar] = useState<SimilarMovie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params.id) return
    ;(async () => {
      setLoading(true)
      const [details, similarMovies] = await Promise.all([
        util.getMovieDetails(params.id),
        util.getSimilarMovies(params.id)
      ])
      if (details) setMovie(details)
      if (similarMovies) setSimilar(similarMovies)
      setLoading(false)
    })()
  }, [params.id])

  const fallbackTitle =
    params.movie &&
    params.movie.split('%20').join(' ').split('%3A').join(':').split('%3').join(': ').split('%26').join('&')

  return (
    <Container sx={{ mt: 2, display: 'flex', flexDirection: 'column', pb: 4 }}>
      <Box sx={{ height: { xs: '400px', md: '500px', lg: '630px' }, width: '100%' }}>
        <iframe
          // sandbox="allow-scripts allow-same-origin"
          width="100%"
          height="100%"
          src={`https://vidfast.vc/movie/${params.id}`}
          title={(movie?.title || fallbackTitle || '') + ''}
          frameBorder="0"
          allow=""
          referrerPolicy=""
          allowFullScreen
        ></iframe>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ py: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {movie?.poster_path && (
              <Box
                component="img"
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                sx={{
                  width: { xs: 140, md: 180 },
                  borderRadius: 2,
                  alignSelf: { xs: 'center', md: 'flex-start' },
                  flexShrink: 0
                }}
              />
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h2" sx={{ mb: 1 }}>
                {movie?.title || fallbackTitle}
              </Typography>
              {movie?.tagline && (
                <Typography variant="subtitle1" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                  {movie.tagline}
                </Typography>
              )}
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                {movie?.release_date && (
                  <Typography variant="body2" color="text.secondary">
                    {new Date(movie.release_date).getFullYear()}
                  </Typography>
                )}
                {movie?.runtime ? (
                  <Typography variant="body2" color="text.secondary">
                    · {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </Typography>
                ) : null}
                {movie?.status && (
                  <Typography variant="body2" color="text.secondary">
                    · {movie.status}
                  </Typography>
                )}
              </Stack>
              {movie && (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Rating value={movie.vote_average / 2} precision={0.1} readOnly size="small" />
                  <Typography variant="body2">
                    {movie.vote_average.toFixed(1)} / 10 ({movie.vote_count.toLocaleString()} votes)
                  </Typography>
                </Stack>
              )}
              {movie && movie.genres && movie.genres.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                  {movie.genres.map((genre) => (
                    <Chip key={genre.id} label={genre.name} size="small" />
                  ))}
                </Stack>
              )}
              <Typography variant="h4" sx={{ mb: 1 }}>
                Overview
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {movie?.overview || 'No overview available.'}
              </Typography>
            </Box>
          </Box>

          {similar.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <FrameworkSection title="Similar Movies" typ="movies" movies={similar} />
            </Box>
          )}
        </>
      )}
    </Container>
  )
}
