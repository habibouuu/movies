"use client"
import { Container, Box, Typography, Chip, Stack, CircularProgress, Rating, Button, FormControl, Select, MenuItem } from '@mui/material';
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import util from 'api/tvshows'
import FrameworkSection from 'components/landingpage/FrameworkSection'

type WatchProgress = {
  season: number
  episode: number
}

const progressStorageKey = (showId: string) => `tv-watch-progress-${showId}`

function readWatchProgress(showId: string): WatchProgress | null {
  try {
    const raw = localStorage.getItem(progressStorageKey(showId))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const season = Number(parsed?.season)
    const episode = Number(parsed?.episode)
    if (!Number.isFinite(season) || !Number.isFinite(episode) || season < 1 || episode < 1) return null
    return { season, episode }
  } catch {
    return null
  }
}

function writeWatchProgress(showId: string, progress: WatchProgress) {
  localStorage.setItem(progressStorageKey(showId), JSON.stringify(progress))
}

type Season = {
  air_date: string
  episode_count: number
  id: number
  name: string
  overview: string
  poster_path: string
  season_number: number
  vote_average: number
}

type Episode = {
  air_date: string
  episode_number: number
  id: number
  name: string
  overview: string
  runtime: number
  season_number: number
  still_path: string
  vote_average: number
}

type ShowDetails = {
  id: number
  name: string
  overview: string
  poster_path: string
  backdrop_path: string
  first_air_date: string
  last_air_date: string
  number_of_seasons: number
  number_of_episodes: number
  episode_run_time: number[]
  vote_average: number
  vote_count: number
  genres: { id: number; name: string }[]
  tagline: string
  status: string
  original_language: string
  seasons: Season[]
}

type SimilarShow = {
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
  const params: { id: string; show?: string } = useParams()
  const [show, setShow] = useState<ShowDetails | null>(null)
  const [similar, setSimilar] = useState<SimilarShow[]>([])
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [season, setSeason] = useState(1)
  const [episode, setEpisode] = useState(1)
  const [autoPlay, setAutoPlay] = useState(false)
  const [progressReady, setProgressReady] = useState(false)
  const restoredShowId = useRef<string | null>(null)
  const ignoreEndedUntil = useRef(0)
  const lastHandledEpisode = useRef('')
  const playbackRef = useRef({ season: 1, episode: 1, seasons: [] as Season[], episodes: [] as Episode[] })

  useEffect(() => {
    if (!params.id) return
    restoredShowId.current = null
    setProgressReady(false)
    setAutoPlay(false)
    setSeason(1)
    setEpisode(1)
    ignoreEndedUntil.current = 0
    lastHandledEpisode.current = ''
    ;(async () => {
      setLoading(true)
      const [details, similarShows] = await Promise.all([
        util.getShowDetails(params.id),
        util.getSimilarShows(params.id)
      ])
      if (details) {
        const showDetails = details as ShowDetails
        setShow(showDetails)
        const availableSeasons = (showDetails.seasons || []).filter(
          (s) => s.season_number > 0 && s.episode_count > 0
        )
        const saved = readWatchProgress(params.id)
        const savedSeason = availableSeasons.find((s) => s.season_number === saved?.season)
        if (saved && savedSeason) {
          const maxEpisode = savedSeason.episode_count || saved.episode
          setSeason(saved.season)
          setEpisode(Math.min(Math.max(saved.episode, 1), maxEpisode))
        } else {
          setSeason(availableSeasons[0]?.season_number || 1)
          setEpisode(1)
        }
      }
      if (similarShows) setSimilar(similarShows as SimilarShow[])
      setLoading(false)
      restoredShowId.current = params.id
      setProgressReady(true)
    })()
  }, [params.id])

  useEffect(() => {
    if (!params.id || !season) return
    ;(async () => {
      const seasonDetails = (await util.getSeasonDetails(params.id, season)) as { episodes?: Episode[] } | undefined
      if (seasonDetails?.episodes) setEpisodes(seasonDetails.episodes)
    })()
  }, [params.id, season])

  const seasons = (show?.seasons || []).filter((s) => s.season_number > 0 && s.episode_count > 0)

  useEffect(() => {
    playbackRef.current = { season, episode, seasons, episodes }
  }, [season, episode, seasons, episodes])

  useEffect(() => {
    if (!progressReady || !params.id || restoredShowId.current !== params.id) return
    writeWatchProgress(params.id, { season, episode })
  }, [progressReady, params.id, season, episode])

  const playEpisode = useCallback((nextSeason: number, nextEpisode: number, shouldAutoPlay = true) => {
    setSeason(nextSeason)
    setEpisode(nextEpisode)
    setAutoPlay(shouldAutoPlay)
  }, [])

  const goToNextEpisode = useCallback(() => {
    if (Date.now() < ignoreEndedUntil.current) return

    const current = playbackRef.current
    const episodeKey = `${current.season}-${current.episode}`
    if (lastHandledEpisode.current === episodeKey) return

    lastHandledEpisode.current = episodeKey
    ignoreEndedUntil.current = Date.now() + 5000

    const seasonEpisodes = current.episodes
    const lastEpisodeInSeason =
      seasonEpisodes[seasonEpisodes.length - 1]?.episode_number ||
      current.seasons.find((s) => s.season_number === current.season)?.episode_count ||
      current.episode

    if (current.episode < lastEpisodeInSeason) {
      playEpisode(current.season, current.episode + 1)
      return
    }

    const nextSeason = current.seasons.find((s) => s.season_number > current.season)
    if (nextSeason) playEpisode(nextSeason.season_number, 1)
  }, [playEpisode])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (typeof event.origin === 'string' && event.origin && !event.origin.includes('vidfast')) return

      let payload = event.data
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload)
        } catch {
          return
        }
      }
      if (!payload) return

      const eventName = payload?.data?.event || payload?.event
      const currentTime = Number(payload?.data?.currentTime)
      const duration = Number(payload?.data?.duration)
      const nearlyEnded = duration > 30 && currentTime / duration >= 0.995
      const isEnded =
        eventName === 'ended' ||
        eventName === 'complete' ||
        payload?.type === 'PLAYER_NEXT_EPISODE' ||
        payload?.type === 'ended' ||
        nearlyEnded

      if (isEnded) goToNextEpisode()
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [goToNextEpisode])

  const handleSeasonChange = (seasonNumber: number) => {
    lastHandledEpisode.current = ''
    playEpisode(seasonNumber, 1)
  }

  const fallbackTitle =
    params.show &&
    params.show.split('%20').join(' ').split('%3A').join(':').split('%3').join(': ').split('%26').join('&')

  const runtime = show?.episode_run_time?.[0]
  const playerQuery = autoPlay
    ? '?autoPlay=true&nextButton=true&autoNext=true'
    : '?nextButton=true&autoNext=true'

  return (
    <Container sx={{ mt: 2, display: 'flex', flexDirection: 'column', pb: 4 }}>
      <Box sx={{ height: { xs: '400px', md: '500px', lg: '630px' }, width: '100%' }}>
        <iframe
          // sandbox="allow-scripts allow-same-origin"
          // Download
          key={`${params.id}-${season}-${episode}`}
          width="100%"
          height="100%"
          src={`https://vidfast.vc/tv/${params.id}/${season}/${episode}${playerQuery}`}
          title={(show?.name || fallbackTitle || '') + ''}
      
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
          <Box sx={{ py: 3 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Episode Guide
            </Typography>
            {/* <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Seasons
            </Typography> */}
            <FormControl size="small" sx={{ mb: 3, minWidth: 220 }}>
              <Select
                value={season}
                onChange={(event) => handleSeasonChange(Number(event.target.value))}
              >
                {seasons.map((s) => (
                  <MenuItem key={s.id} value={s.season_number}>
                    {s.name || `Season ${s.season_number}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Episodes
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {episodes.map((ep) => (
                <Button
                  key={ep.id}
                  variant={episode === ep.episode_number ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => {
                    lastHandledEpisode.current = ''
                    playEpisode(season, ep.episode_number)
                  }}
                >
                  {ep.episode_number}. {ep.name}
                </Button>
              ))}
            </Stack>
          </Box>

          <Box sx={{ py: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {show?.poster_path && (
              <Box
                component="img"
                src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                alt={show.name}
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
                {show?.name || fallbackTitle}
              </Typography>
              {show?.tagline && (
                <Typography variant="subtitle1" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
                  {show.tagline}
                </Typography>
              )}
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                {show?.first_air_date && (
                  <Typography variant="body2" color="text.secondary">
                    {new Date(show.first_air_date).getFullYear()}
                    {show.last_air_date ? ` – ${new Date(show.last_air_date).getFullYear()}` : ''}
                  </Typography>
                )}
                {show?.number_of_seasons ? (
                  <Typography variant="body2" color="text.secondary">
                    · {show.number_of_seasons} season{show.number_of_seasons > 1 ? 's' : ''}
                  </Typography>
                ) : null}
                {show?.number_of_episodes ? (
                  <Typography variant="body2" color="text.secondary">
                    · {show.number_of_episodes} episodes
                  </Typography>
                ) : null}
                {runtime ? (
                  <Typography variant="body2" color="text.secondary">
                    · {runtime}m
                  </Typography>
                ) : null}
                {show?.status && (
                  <Typography variant="body2" color="text.secondary">
                    · {show.status}
                  </Typography>
                )}
              </Stack>
              {show && (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Rating value={show.vote_average / 2} precision={0.1} readOnly size="small" />
                  <Typography variant="body2">
                    {show.vote_average.toFixed(1)} / 10 ({show.vote_count.toLocaleString()} votes)
                  </Typography>
                </Stack>
              )}
              {show && show.genres && show.genres.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                  {show.genres.map((genre) => (
                    <Chip key={genre.id} label={genre.name} size="small" />
                  ))}
                </Stack>
              )}
              <Typography variant="h4" sx={{ mb: 1 }}>
                Overview
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {show?.overview || 'No overview available.'}
              </Typography>
            </Box>
          </Box>

          {similar.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <FrameworkSection title="Similar TV Shows" typ="shows" movies={similar} />
            </Box>
          )}
        </>
      )}
    </Container>
  )
}
