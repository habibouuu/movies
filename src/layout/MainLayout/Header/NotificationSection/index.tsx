import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';


import SearchIcon from '@mui/icons-material/Search';

// types
import { ThemeMode } from 'types/config';



// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef<any>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };


  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);



  return (
    <>
      <Link

      href='/search'
       
      >
        <Avatar
          variant="rounded"
          sx={{padding:2,
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            transition: 'all .2s ease-in-out',
            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'secondary.light',
            color: theme.palette.mode === ThemeMode.DARK ? 'warning.dark' : 'secondary.dark',
            '&[aria-controls="menu-list-grow"],&:hover': {
              bgcolor: theme.palette.mode === ThemeMode.DARK ? 'warning.dark' : 'secondary.dark',
              color: theme.palette.mode === ThemeMode.DARK ? 'grey.800' : 'secondary.light'
            }
          }}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          color="inherit"
        >
          <SearchIcon component='svg' />
        </Avatar>
      </Link>
    </>
  );
};

export default NotificationSection;
