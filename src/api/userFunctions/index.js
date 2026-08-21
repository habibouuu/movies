const KEYS = {
  favorites: 'user-favorites',
  watchlater: 'user-watchlater',
  history: 'user-watch-history'
}

const PAGE_SIZE = 20
const HISTORY_LIMIT = 100

function readList(key) {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeList(key, items) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(items))
}

function sameItem(a, b) {
  return Number(a?.id) === Number(b?.id)
}

function toStoredItem(item, extra = {}) {
  if (!item) return null
  return {
    id: item.id,
    title: item.title,
    name: item.name,
    original_title: item.original_title,
    original_name: item.original_name,
    overview: item.overview,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    vote_average: item.vote_average,
    vote_count: item.vote_count,
    release_date: item.release_date,
    first_air_date: item.first_air_date,
    genre_ids: item.genre_ids,
    adult: item.adult,
    popularity: item.popularity,
    video: item.video,
    origin_country: item.origin_country,
    original_language: item.original_language,
    mediaType: extra.mediaType || item.mediaType || (item.title ? 'movie' : 'tv'),
    season: extra.season ?? item.season,
    episode: extra.episode ?? item.episode,
    watchedAt: extra.watchedAt ?? item.watchedAt
  }
}

function paginate(items, page) {
  const p = Math.max(1, Number(page) || 1)
  const start = (p - 1) * PAGE_SIZE
  return {
    total: items.length,
    movies: items.slice(start, start + PAGE_SIZE)
  }
}

function addToList(key, movie) {
  const stored = toStoredItem(movie)
  if (!stored?.id) return false
  const items = readList(key)
  if (items.some((item) => sameItem(item, stored))) return false
  writeList(key, [stored, ...items])
  return true
}

function removeFromList(key, movie) {
  const items = readList(key)
  const next = items.filter((item) => !sameItem(item, movie))
  writeList(key, next)
  return next.length !== items.length
}

async function insertUser() {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(KEYS.favorites) == null) writeList(KEYS.favorites, [])
  if (localStorage.getItem(KEYS.watchlater) == null) writeList(KEYS.watchlater, [])
  if (localStorage.getItem(KEYS.history) == null) writeList(KEYS.history, [])
}

async function getUserMovies(page) {
  return {
    watchlater: paginate(readList(KEYS.watchlater), page),
    favorites: paginate(readList(KEYS.favorites), page),
    history: paginate(readList(KEYS.history), page)
  }
}

async function getUserMov() {
  return getUserMovies(1)
}

async function addFavorites(movie) {
  return addToList(KEYS.favorites, movie)
}

async function addwatchlater(movie) {
  return addToList(KEYS.watchlater, movie)
}

async function deletefavorite(movie) {
  return removeFromList(KEYS.favorites, movie)
}

async function deletewatchlater(movie) {
  return removeFromList(KEYS.watchlater, movie)
}

async function addWatchHistory(movie, extra = {}) {
  const stored = toStoredItem(movie, { ...extra, watchedAt: Date.now() })
  if (!stored?.id) return false
  const items = readList(KEYS.history).filter((item) => !sameItem(item, stored))
  writeList(KEYS.history, [stored, ...items].slice(0, HISTORY_LIMIT))
  return true
}

async function deleteWatchHistory(movie) {
  return removeFromList(KEYS.history, movie)
}

function isFavorite(id) {
  return readList(KEYS.favorites).some((item) => Number(item.id) === Number(id))
}

function isWatchLater(id) {
  return readList(KEYS.watchlater).some((item) => Number(item.id) === Number(id))
}

export default {
  insertUser,
  getUserMovies,
  getUserMov,
  addFavorites,
  addwatchlater,
  deletefavorite,
  deletewatchlater,
  addWatchHistory,
  deleteWatchHistory,
  isFavorite,
  isWatchLater
}
