'use client'

import React from 'react'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

type CarouselArrowProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  onClickHandler?: () => void
}

function useArrowSx(side: 'left' | 'right') {
  const theme = useTheme()

  return {
    position: 'absolute',
    zIndex: 3,
    top: '50%',
    transform: 'translateY(-50%)',
    [side]: { xs: 4, md: 8 },
    bgcolor: `${theme.palette.background.paper} !important`,
    color: theme.palette.text.primary,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: '0px 8px 24px rgba(9, 15, 37, 0.16)',
    width: { xs: 36, md: 48 },
    height: { xs: 36, md: 48 },
    '&:hover': {
      bgcolor: `${theme.palette.primary.main} !important`,
      color: theme.palette.primary.contrastText
    }
  } as const
}

export function CarouselNextArrow({ onClick, onClickHandler }: CarouselArrowProps) {
  return (
    <IconButton onClick={onClick || onClickHandler} sx={useArrowSx('right')} aria-label="Next">
      <IconChevronRight size={28} />
    </IconButton>
  )
}

export function CarouselPrevArrow({ onClick, onClickHandler }: CarouselArrowProps) {
  return (
    <IconButton onClick={onClick || onClickHandler} sx={useArrowSx('left')} aria-label="Previous">
      <IconChevronLeft size={28} />
    </IconButton>
  )
}
