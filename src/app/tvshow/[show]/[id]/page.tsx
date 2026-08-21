"use client"
import { Container, Box, Typography, Chip, Stack, CircularProgress, Rating, Button, FormControl, FormControlLabel, Select, MenuItem, Switch, IconButton, Slider } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward10Icon from '@mui/icons-material/Forward10';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import util from 'api/tvshows'
import FrameworkSection from 'components/landingpage/FrameworkSection'
import usePlayerFullscreen from 'hooks/usePlayerFullscreen'

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
  const [autoNextEnabled, setAutoNextEnabled] = useState(true)
  const [progressReady, setProgressReady] = useState(false)
  const [resumeAt, setResumeAt] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [nativeFullscreen, setNativeFullscreen] = useState(false)
  const [playerEpoch, setPlayerEpoch] = useState(0)
  const { containerRef, cssFullscreen, enterFullscreen, exitFullscreen } = usePlayerFullscreen()
  const playerRef = useRef<HTMLIFrameElement>(null)
  const restoredShowId = useRef<string | null>(null)
  const ignoreEndedUntil = useRef(0)
  const lastHandledEpisode = useRef('')
  const autoNextRef = useRef(true)
  const seekingRef = useRef(false)
  const playbackRef = useRef({ season: 1, episode: 1, seasons: [] as Season[], episodes: [] as Episode[] })
  const mediaRef = useRef({ currentTime: 0, duration: 0, volume: 1, playing: false })

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
    const max = mediaRef.current.duration
    const nextTime = Math.max(0, Math.floor(max > 0 ? Math.min(time, max) : time))
    mediaRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
    setResumeAt(nextTime)
    if (options.play !== undefined) {
      mediaRef.current.playing = options.play
      setPlaying(options.play)
      setAutoPlay(options.play)
    }
    setPlayerEpoch((value) => value + 1)
  }

  const handlePlay = () => {
    sendPlayerCommand('play')
    sendPlayerCommand('volume', { level: 1 })
    mediaRef.current.playing = true
    mediaRef.current.volume = 1
    setVolume(1)
    setPlaying(true)
    setAutoPlay(true)
    setResumeAt(Math.floor(mediaRef.current.currentTime))
  }

  const handlePause = () => {
    sendPlayerCommand('pause')
    mediaRef.current.playing = false
    setPlaying(false)
  }

  const handleSeek = (time: number) => {
    sendPlayerCommand('seek', { time })
    reloadPlayerAt(time, { play: mediaRef.current.playing })
  }

  const handleSkip = (delta: number) => {
    handleSeek(mediaRef.current.currentTime + delta)
  }

  const handleVolumeChange = (_event: Event, value: number | number[]) => {
    const nextVolume = (Array.isArray(value) ? value[0] : value) / 100
    setVolume(nextVolume)
    sendPlayerCommand('volume', { level: nextVolume })
  }

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
    restoredShowId.current = null
    setProgressReady(false)
    setAutoPlay(false)
    setSeason(1)
    setEpisode(1)
    setResumeAt(0)
    setPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setPlayerEpoch(0)
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
    mediaRef.current = {
      currentTime,
      duration: duration > 0 ? duration : (episodes.find((ep) => ep.episode_number === episode)?.runtime || show?.episode_run_time?.[0] || 0) * 60,
      volume,
      playing
    }
  }, [currentTime, duration, volume, playing, episode, episodes, show?.episode_run_time])

  useEffect(() => {
    if (!playing) return
    let last = Date.now()
    const id = window.setInterval(() => {
      if (seekingRef.current) return
      const now = Date.now()
      const delta = (now - last) / 1000
      last = now
      const max = mediaRef.current.duration
      const next = mediaRef.current.currentTime + delta
      const clamped = max > 0 ? Math.min(next, max) : next
      mediaRef.current.currentTime = clamped
      setCurrentTime(clamped)
    }, 250)
    return () => window.clearInterval(id)
  }, [playing])

  useEffect(() => {
    autoNextRef.current = autoNextEnabled
  }, [autoNextEnabled])

  useEffect(() => {
    if (!progressReady || !params.id || restoredShowId.current !== params.id) return
    writeWatchProgress(params.id, { season, episode })
  }, [progressReady, params.id, season, episode])

  const playEpisode = useCallback((nextSeason: number, nextEpisode: number, shouldAutoPlay = true) => {
    setSeason(nextSeason)
    setEpisode(nextEpisode)
    setAutoPlay(shouldAutoPlay)
    setPlaying(shouldAutoPlay)
    setResumeAt(0)
    setCurrentTime(0)
    setDuration(0)
    setPlayerEpoch(0)
    mediaRef.current.currentTime = 0
    mediaRef.current.playing = shouldAutoPlay
  }, [])

  const goToNextEpisode = useCallback((fromUser = false) => {
    if (!fromUser && Date.now() < ignoreEndedUntil.current) return

    const current = playbackRef.current
    const episodeKey = `${current.season}-${current.episode}`
    if (!fromUser && lastHandledEpisode.current === episodeKey) return

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

  const goToPreviousEpisode = useCallback(() => {
    const current = playbackRef.current
    lastHandledEpisode.current = ''
    ignoreEndedUntil.current = 0

    if (current.episode > 1) {
      playEpisode(current.season, current.episode - 1)
      return
    }

    const previousSeasons = current.seasons.filter((s) => s.season_number < current.season)
    const previousSeason = previousSeasons[previousSeasons.length - 1]
    if (previousSeason) playEpisode(previousSeason.season_number, previousSeason.episode_count || 1)
  }, [playEpisode])

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
        payload?.type === 'PLAYER_NEXT_EPISODE' ||
        payload?.data?.event ||
        payload?.data?.progress ||
        payload?.progress
      if (!fromVidfast && !looksLikePlayer) return

      const data = payload.data || payload
      const entry = data?.[`t${params.id}`] || data?.[params.id] || data
      const eventName = entry?.event || data?.event || payload?.event || payload?.type
      const progress = entry?.progress || data?.progress
      const eventTime = Number(progress?.watched ?? entry?.currentTime ?? data?.currentTime ?? data?.timestamp ?? payload?.currentTime)
      const eventDuration = Number(progress?.duration ?? entry?.duration ?? data?.duration ?? payload?.duration)
      const nearlyEnded = eventDuration > 30 && eventTime / eventDuration >= 0.995
      const isEnded =
        eventName === 'ended' ||
        eventName === 'complete' ||
        payload?.type === 'PLAYER_NEXT_EPISODE' ||
        payload?.type === 'ended' ||
        nearlyEnded

      if (!seekingRef.current && Number.isFinite(eventTime) && eventTime >= 0) {
        mediaRef.current.currentTime = eventTime
        setCurrentTime(eventTime)
      }
      if (Number.isFinite(eventDuration) && eventDuration > 0) {
        mediaRef.current.duration = eventDuration
        setDuration(eventDuration)
      }

      if (eventName === 'play' || eventName === 'playing') {
        mediaRef.current.playing = true
        setPlaying(true)
      }
      if (eventName === 'pause') {
        mediaRef.current.playing = false
        setPlaying(false)
      }

      if (isEnded && autoNextRef.current) goToNextEpisode()
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [goToNextEpisode, params.id])

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

  const handleSeasonChange = (seasonNumber: number) => {
    lastHandledEpisode.current = ''
    playEpisode(seasonNumber, 1)
  }

  const fallbackTitle =
    params.show &&
    params.show.split('%20').join(' ').split('%3A').join(':').split('%3').join(': ').split('%26').join('&')

  const runtime = show?.episode_run_time?.[0]
  const playerQuery = [
    autoPlay ? 'autoPlay=true' : '',
    resumeAt > 0 ? `startAt=${resumeAt}` : '',
    'nextButton=false',
    'autoNext=false',
    'fullscreenButton=false'
  ]
    .filter(Boolean)
    .join('&')

  const firstSeason = seasons[0]?.season_number || 1
  const lastSeasonNumber = seasons[seasons.length - 1]?.season_number
  const lastEpisodeInSeason =
    episodes[episodes.length - 1]?.episode_number ||
    seasons.find((s) => s.season_number === season)?.episode_count ||
    episode
  const isFirstEpisode = season <= firstSeason && episode <= 1
  const isLastEpisode = (lastSeasonNumber == null || season >= lastSeasonNumber) && episode >= lastEpisodeInSeason
  const currentEpisode = episodes.find((ep) => ep.episode_number === episode)
  const isFullscreen = cssFullscreen || nativeFullscreen
  const mediaDuration = duration > 0 ? duration : (currentEpisode?.runtime || runtime || 0) * 60

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
            // Download
            key={`${params.id}-${season}-${episode}-${playerEpoch}`}
            ref={playerRef}
            src={`https://vidfast.vc/tv/${params.id}/${season}/${episode}?${playerQuery}`}
            title={(show?.name || fallbackTitle || '') + ''}
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
          <Button
            variant="outlined"
            size="small"
            startIcon={<SkipPreviousIcon />}
            disabled={loading || isFirstEpisode}
            onClick={goToPreviousEpisode}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="small"
            endIcon={<SkipNextIcon />}
            disabled={loading || isLastEpisode}
            onClick={() => goToNextEpisode(true)}
          >
            Next
          </Button>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={autoNextEnabled}
                onChange={(event) => setAutoNextEnabled(event.target.checked)}
              />
            }
            label="Auto Next"
          />
          <Slider
            size="small"
            aria-label="Volume"
            value={Math.round(volume * 100)}
            onChange={handleVolumeChange}
            sx={{ width: 88, mx: 0.5 }}
          />
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
          {currentEpisode && (
            <Typography variant="body2" color="text.secondary">
              S{season}:E{episode} {currentEpisode.name}
            </Typography>
          )}
        </Stack>
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
