"use client"
import { Container, Box, Typography, Chip, Stack, CircularProgress, Rating, Button, Slider, IconButton } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward10Icon from '@mui/icons-material/Forward10';
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import util from 'api/movies'
import FrameworkSection from 'components/landingpage/FrameworkSection'
import UserSaveActions from 'components/app/UserSaveActions'
import usePlayerFullscreen from 'hooks/usePlayerFullscreen'
import userLists from 'api/userFunctions'

const SEEK_STEP = 10

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

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
  const [autoPlay, setAutoPlay] = useState(false)
  const [resumeAt, setResumeAt] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [nativeFullscreen, setNativeFullscreen] = useState(false)
  const [playerEpoch, setPlayerEpoch] = useState(0)
  const playerRef = useRef<HTMLIFrameElement>(null)
  const playerReadyRef = useRef(false)
  const seekingRef = useRef(false)
  const playbackRef = useRef({ currentTime: 0, duration: 0, volume: 1, playing: false })
  const { containerRef, cssFullscreen, enterFullscreen, exitFullscreen } = usePlayerFullscreen()

  const sendPlayerCommand = useCallback((command: string, extra: Record<string, unknown> = {}) => {
    const target = playerRef.current?.contentWindow
    if (!target) return

    const time = extra.time
    const level = extra.level
    const args = typeof time === 'number' ? [time] : typeof level === 'number' ? [level] : []

    const messages: unknown[] = [
      { command, ...extra },
      JSON.stringify({ command, ...extra }),
      { type: command, ...extra },
      { method: command, ...extra },
      { action: command, ...extra },
      { type: 'PLAYER_COMMAND', command, ...extra },
      JSON.stringify({ event: 'command', func: command, args })
    ]

    if (command === 'seek' && typeof time === 'number') {
      messages.push(
        { command: 'seekTo', time, seconds: time, currentTime: time },
        JSON.stringify({ command: 'seekTo', time }),
        JSON.stringify({ event: 'command', func: 'seekTo', args: [time, true] })
      )
    }

    if (command === 'volume' && typeof level === 'number') {
      messages.push(
        { command: 'setVolume', volume: level, level },
        JSON.stringify({ event: 'command', func: 'setVolume', args: [Math.round(level * 100)] })
      )
    }

    messages.forEach((msg) => {
      try {
        target.postMessage(msg, '*')
      } catch {
        // ignore unsupported payload types
      }
    })
  }, [])

  const reloadPlayerAt = (time: number, options: { play?: boolean } = {}) => {
    const max = playbackRef.current.duration
    const nextTime = Math.max(0, Math.floor(max > 0 ? Math.min(time, max) : time))
    playbackRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
    setResumeAt(nextTime)
    if (options.play !== undefined) {
      playbackRef.current.playing = options.play
      setPlaying(options.play)
      setAutoPlay(options.play)
    }
    setPlayerEpoch((value) => value + 1)
  }

  const handlePlay = () => {
    sendPlayerCommand('play')
    sendPlayerCommand('volume', { level: 1 })
    playbackRef.current.playing = true
    playbackRef.current.volume = 1
    setVolume(1)
    setPlaying(true)
    setAutoPlay(true)
    setResumeAt(Math.floor(playbackRef.current.currentTime))
  }

  const handlePause = () => {
    sendPlayerCommand('pause')
    playbackRef.current.playing = false
    setPlaying(false)
  }

  const handleSeek = (time: number) => {
    sendPlayerCommand('seek', { time })
    reloadPlayerAt(time, { play: playbackRef.current.playing })
  }

  const handleSkip = (delta: number) => {
    handleSeek(playbackRef.current.currentTime + delta)
  }

  // const handleVolumeChange = (_event: Event, value: number | number[]) => {
  //   const nextVolume = (Array.isArray(value) ? value[0] : value) / 100
  //   setVolume(nextVolume)
  //   sendPlayerCommand('volume', { level: nextVolume })
  // }

  const handleSeekChange = (_event: Event, value: number | number[]) => {
    const nextTime = Array.isArray(value) ? value[0] : value
    seekingRef.current = true
    setSeeking(true)
    setCurrentTime(nextTime)
  }

  const handleSeekCommit = (_event: Event | React.SyntheticEvent, value: number | number[]) => {
    const nextTime = Array.isArray(value) ? value[0] : value
    seekingRef.current = false
    setSeeking(false)
    handleSeek(nextTime)
  }

  const toggleFullscreen = () => {
    if (cssFullscreen || document.fullscreenElement) exitFullscreen()
    else enterFullscreen()
  }

  useEffect(() => {
    if (!params.id) return
    ;(async () => {
      setLoading(true)
      const [details, similarMovies] = await Promise.all([
        util.getMovieDetails(params.id),
        util.getSimilarMovies(params.id)
      ])
      if (details) {
        setMovie(details)
        userLists.addWatchHistory(details)
      }
      if (similarMovies) setSimilar(similarMovies)
      setAutoPlay(false)
      setResumeAt(0)
      setPlaying(false)
      setCurrentTime(0)
      setDuration(0)
      setPlayerEpoch(0)
      playerReadyRef.current = false
      setLoading(false)
    })()
  }, [params.id])

  useEffect(() => {
    playbackRef.current = {
      currentTime,
      duration: duration > 0 ? duration : (movie?.runtime || 0) * 60,
      volume,
      playing
    }
  }, [currentTime, duration, volume, playing, movie?.runtime])

  useEffect(() => {
    if (!playing) return
    let last = Date.now()
    const id = window.setInterval(() => {
      if (seekingRef.current) return
      const now = Date.now()
      const delta = (now - last) / 1000
      last = now
      const max = playbackRef.current.duration
      const next = playbackRef.current.currentTime + delta
      const clamped = max > 0 ? Math.min(next, max) : next
      playbackRef.current.currentTime = clamped
      setCurrentTime(clamped)
    }, 250)
    return () => window.clearInterval(id)
  }, [playing])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      let payload = event.data
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload)
        } catch {
          return
        }
      }
      if (!payload || typeof payload !== 'object') return

      const fromVidfast = typeof event.origin === 'string' && event.origin.includes('vidfast')
      const looksLikePlayer =
        payload?.type === 'PLAYER_EVENT' ||
        payload?.type === 'MEDIA_DATA' ||
        payload?.data?.event ||
        payload?.data?.progress ||
        payload?.progress
      if (!fromVidfast && !looksLikePlayer) return

      const data = payload.data || payload
      const entry = data?.[`m${params.id}`] || data?.[params.id] || data
      const eventName = entry?.event || data?.event || payload?.event || payload?.type
      const progress = entry?.progress || data?.progress
      const nextTime = Number(progress?.watched ?? entry?.currentTime ?? data?.currentTime ?? data?.timestamp ?? payload?.currentTime)
      const nextDuration = Number(progress?.duration ?? entry?.duration ?? data?.duration ?? payload?.duration)
      const isPlayerEvent =
        payload?.type === 'PLAYER_EVENT' ||
        payload?.type === 'MEDIA_DATA' ||
        ['play', 'playing', 'pause', 'ended', 'complete', 'timeupdate', 'seeked', 'volumechange'].includes(eventName)

      if (isPlayerEvent) playerReadyRef.current = true

      if (!seekingRef.current && Number.isFinite(nextTime) && nextTime >= 0) {
        playbackRef.current.currentTime = nextTime
        setCurrentTime(nextTime)
      }
      if (Number.isFinite(nextDuration) && nextDuration > 0) {
        playbackRef.current.duration = nextDuration
        setDuration(nextDuration)
      }

      if (eventName === 'play' || eventName === 'playing') {
        playbackRef.current.playing = true
        setPlaying(true)
      }
      if (eventName === 'pause' || eventName === 'ended' || eventName === 'complete') {
        playbackRef.current.playing = false
        setPlaying(false)
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [params.id])

  useEffect(() => {
    const onFullscreenChange = () => {
      setNativeFullscreen(Boolean(document.fullscreenElement || (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement))
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
    }
  }, [])

  const fallbackTitle =
    params.movie &&
    params.movie.split('%20').join(' ').split('%3A').join(':').split('%3').join(': ').split('%26').join('&')

  const playerQuery = [
    autoPlay ? 'autoPlay=true' : '',
    resumeAt > 0 ? `startAt=${resumeAt}` : '',
    'nextButton=false',
    'autoNext=false',
    'fullscreenButton=false'
  ]
    .filter(Boolean)
    .join('&')

  const isFullscreen = cssFullscreen || nativeFullscreen
  const mediaDuration = duration > 0 ? duration : (movie?.runtime || 0) * 60

  return (
    <Container sx={{ mt: 2, display: 'flex', flexDirection: 'column', pb: 4 }}>
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          '&:fullscreen, &:-webkit-full-screen': {
            width: '100%',
            height: '100%',
            bgcolor: '#000',
            '& > :first-of-type': {
              flex: 1,
              height: 'auto'
            }
          },
          ...(cssFullscreen && {
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            width: '100%',
            height: '100%',
            bgcolor: '#000',
            borderRadius: 0
          })
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: { xs: '400px', md: '500px', lg: '630px' },
            width: '100%',
            bgcolor: '#000',
            flex: isFullscreen ? 1 : undefined
          }}
        >
          <iframe
            // sandbox="allow-scripts allow-same-origin"
            key={`${params.id}-${playerEpoch}`}
            ref={playerRef}
            src={`https://vidfast.vc/movie/${params.id}?${playerQuery}`}
            title={(movie?.title || fallbackTitle || '') + ''}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            referrerPolicy=""
            allowFullScreen
            onLoad={() => sendPlayerCommand('volume', { level: 1 })}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 0,
              pointerEvents: 'none'
            }}
          ></iframe>
          <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: 1 }} />
          {isFullscreen && (
            <IconButton
              aria-label="Exit fullscreen"
              onClick={exitFullscreen}
              sx={{
                position: 'absolute',
                top: { xs: 'max(12px, env(safe-area-inset-top))', sm: 8 },
                right: 8,
                zIndex: 2,
                color: '#fff',
                bgcolor: 'rgba(0,0,0,0.55)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' }
              }}
            >
              <FullscreenExitIcon />
            </IconButton>
          )}
        </Box>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          sx={{
            pt: 2,
            pb: 1,
            px: isFullscreen ? 2 : 0,
            bgcolor: isFullscreen ? '#000' : 'transparent'
          }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={playing ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={playing ? handlePause : handlePlay}
          >
            {playing ? 'Pause' : 'Play'}
          </Button>
          <Button variant="outlined" size="small" startIcon={<Replay10Icon />} onClick={() => handleSkip(-SEEK_STEP)}>
            -10s
          </Button>
          <Button variant="outlined" size="small" startIcon={<Forward10Icon />} onClick={() => handleSkip(SEEK_STEP)}>
            +10s
          </Button>
          {/* <Slider
            size="small"
            aria-label="Volume"
            value={Math.round(volume * 100)}
            onChange={handleVolumeChange}
            sx={{ width: 88, mx: 0.5 }}
          /> */}
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 84, textAlign: 'center' }}>
            {formatTime(currentTime)} / {formatTime(mediaDuration)}
          </Typography>
          <Slider
            size="small"
            aria-label="Seek"
            min={0}
            max={mediaDuration > 0 ? mediaDuration : 1}
            step={1}
            value={mediaDuration > 0 ? Math.min(currentTime, mediaDuration) : 0}
            disabled={mediaDuration <= 0 && !seeking}
            onChange={handleSeekChange}
            onChangeCommitted={handleSeekCommit}
            sx={{ flex: 1, minWidth: 140 }}
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </Button>
        </Stack>
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
              {movie && <UserSaveActions item={movie} mediaType="movie" />}
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
