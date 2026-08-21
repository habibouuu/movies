'use client'

import UserLibraryPage from 'components/app/UserLibraryPage'

export default function Page() {
  return (
    <UserLibraryPage
      list="history"
      title="Watch History"
      emptyText="You have not watched anything yet. Movies and TV shows you play will show up here."
    />
  )
}
