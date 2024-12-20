// material-ui
"use client"
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import useConfig from 'hooks/useConfig';
import LogoSection from '../LogoSection';

import ProfileSection from './ProfileSection';

import NotificationSection from './NotificationSection';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import { IconMenu2 } from '@tabler/icons-react';
import util from 'api/user'
// types
import { MenuOrientation, ThemeMode } from 'types/config';
import {UserProfile} from 'types/user-profile';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import useAuth from 'hooks/useAuth';
// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useRouter();
  const { menuOrientation } = useConfig();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const { isLoggedIn } = useAuth();

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;
  const [user, setUser] = useState<UserProfile>();
  useEffect(()=>{
    (async () =>{
      const person : any = await util.getUser();
      if(person) setUser(person);
    })()
  },[])
  return (
    <>
      {/* logo & toggler button */}
      <Box sx={{ width: downMD ? 'auto' : 230, display: 'flex', justifyContent:'center', alignItems:'center' }}>
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        {!isHorizontal && (
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              overflow: 'hidden',
              transition: 'all .2s ease-in-out',
              bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'secondary.light',
              color: theme.palette.mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
              '&:hover': {
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
                color: theme.palette.mode === ThemeMode.DARK ? 'secondary.light' : 'secondary.light'
              }
            }}
            onClick={() => handlerDrawerOpen(!drawerOpen)}
            color="inherit"
          >
        
            <IconMenu2 stroke={1.5} size="20px" />
          </Avatar>
        )}
      </Box>

      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 20 }} />
   
      

      {/* mega-menu */}
      {/* <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <MegaMenuSection />
      </Box> */}

      {/* live customization & localization */}
      {/* <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <LocalizationSection />
      </Box> */}

      {/* notification */}
      

      {/* full sceen toggler */}
      <Box>
        <NotificationSection />
      </Box>
<Box sx={{ flexGrow: 1 }} />
      {/* profile */}
      {isLoggedIn?<ProfileSection user={user?user:''}/>:<Button onClick={()=>navigate.push('/login')} variant='contained' color='error'>LOGIN</Button>}

      {/* mobile header */}
      {/* <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <MobileSection />
      // </Box> */}
    </>
  );
};

export default Header;
