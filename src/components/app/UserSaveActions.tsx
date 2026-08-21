'use client'

import { useEffect, useState } from 'react'
import { Button, Stack } from '@mui/material'
import util from 'api/userFunctions'
import { dispatch } from 'store'
import { openSnackbar } from 'store/slices/snackbar'

type SaveItem = {
  id: number
  title?: string
  name?: string
  overview?: string
  poster_path?: string
  backdrop_path?: string
  vote_average?: number
  vote_count?: number
  release_date?: string
  first_air_date?: string
}

export default function UserSaveActions({ item, mediaType }: { item: SaveItem; mediaType?: 'movie' | 'tv' }) {
  const [favorite, setFavorite] = useState(false)
  const [watchLater, setWatchLater] = useState(false)

  useEffect(() => {
    if (!item?.id) return
    setFavorite(util.isFavorite(item.id))
    setWatchLater(util.isWatchLater(item.id))
  }, [item?.id])

  const notify = (message: string) => {
    dispatch(
      openSnackbar({
        open: true,
        message,
        variant: 'alert',
        alert: { color: 'success' },
        close: false
      })
    )
  }

  const handleWatchLater = async () => {
    if (watchLater) {
      await util.deletewatchlater(item)
      setWatchLater(false)
      notify('Removed from Watch Later')
      return
    }
    await util.addwatchlater({ ...item, mediaType })
    setWatchLater(true)
    notify('Added to Watch Later')
  }

  const handleFavorites = async () => {
    if (favorite) {
      await util.deletefavorite(item)
      setFavorite(false)
      notify('Removed from Favorites')
      return
    }
    await util.addFavorites({ ...item, mediaType })
    setFavorite(true)
    notify('Added to Favorites')
  }

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
      <Button variant={watchLater ? 'contained' : 'outlined'} color="secondary" onClick={handleWatchLater}>
        {watchLater ? 'In Watch Later' : 'Watch Later'}
      </Button>
      <Button variant={favorite ? 'contained' : 'outlined'} color="warning" onClick={handleFavorites}>
        {favorite ? 'In Favorites' : 'Add to Favorites'}
      </Button>
    </Stack>
  )
}
