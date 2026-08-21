'use client'

import UserLibraryPage from 'components/app/UserLibraryPage'

export default function Page() {
  return (
    <UserLibraryPage
      list="watchlater"
      title="Watch Later"
      emptyText="Your Watch Later list is empty."
    />
  )
}
