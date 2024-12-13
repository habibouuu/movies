"use client"
import { useMemo } from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import { motion } from 'framer-motion';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

import { DASHBOARD_PATH } from 'config';
import useConfig from 'hooks/useConfig';

// assets
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
const TechLight = '/assets/images/landing/tech-light.svg';
const TechDark = '/assets/images/landing/tech-dark.svg';
const dashboard = '/assets/images/landing/hero-dashboard.png';
const widget1 = '/assets/images/landing/hero-widget-1.png';
const widget2 = '/assets/images/landing/hero-widget-2.png';
const BgDark = '/assets/images/landing/bg-hero-block-dark.png';
const BgLight = '/assets/images/landing/bg-hero-block-light.png';

// types
import { ThemeDirection, ThemeMode } from 'types/config';

// styles
// const HeaderImage = styled('img')(({ theme }) => ({
//   maxWidth: '100%',
//   borderRadius: 20,
//   transform: 'scale(1.7)',
//   transformOrigin: theme.direction === 'rtl' ? '100% 50%' : '0 50%',
//   [theme.breakpoints.down('xl')]: {
//     transform: 'scale(1.5)'
//   },
//   [theme.breakpoints.down('lg')]: {
//     transform: 'scale(1.2)'
//   }
// }));

// const HeaderAnimationImage = styled('img')({
//   maxWidth: '100%',
//   filter: 'drop-shadow(0px 0px 50px rgb(33 150 243 / 30%))'
// });

// ==============================|| LANDING - HEADER PAGE ||============================== //
type movi = 
          {
            "adult": boolean,
            "backdrop_path": string,
            "genre_ids": number[],
            "id": number,
            "origin_country": string[],
            "original_language": string,
            "original_name": string,
            "overview": string,
            "popularity": number,
            "poster_path":string,
            "first_air_date": Date,
            "name": string,
            "vote_average": number,
            "vote_count": number,
            "original_title": string,
            "release_date": Date,
            "title": string,
            "video": boolean
          };
const HeaderSection = ({headMovie}:{headMovie:movi|undefined}) => {
  // const { mode, themeDirection } = useConfig();

  const headerSX = { fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem', lg: '3.5rem' } };


  return (
    <Container sx={{ height: '60vh', width:'95vw',display: 'flex', justifyContent: 'center',backgroundSize:'cover', backgroundImage: headMovie? `url('https://image.tmdb.org/t/p/w600_and_h900_bestv2${headMovie.backdrop_path}')`:'none' , alignItems: 'center' }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: { xs: 10, sm: 6, md: 18.75 }, mb: { xs: 2.5, md: 10 } }}>
        <Grid item xs={12} md={5} sx={{background:'rgba(0, 0, 0, 0.55)', p:4, borderRadius:'10px'}}>
          <Grid container spacing={6} >
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30 }}
              >
                
                
                  <Typography textAlign={{ xs: 'center', md: 'left' }} variant="h1" color="primary" sx={headerSX}>
                   {headMovie? headMovie.title : "Title"}
                  </Typography>
                  {/* <Stack spacing={1}>
                </Stack> */}
              </motion.div>
            </Grid>
            <Grid item xs={12} sx={{ mt: -2.5, textAlign: { xs: 'center', md: 'left' } }}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.2 }}
              >
                <Typography
                  textAlign={{ xs: 'center', md: 'left' }}
                  color="text.primary"
                  variant="body1"
                  sx={{ fontSize: { xs: '18px', md:'22px', lg: '26px'}, }}
                >
                 {headMovie? headMovie.overview.slice(0,80)+'...' : "Description"}
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.4 }}
              >
                <Grid container spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Grid item>
                    <AnimateButton>
                      <Button
                        component={Link}
                        href={DASHBOARD_PATH}
                        target="_blank"
                        size="large"
                        variant="contained"
                        color="error"
                        startIcon={<PlayArrowIcon />}
                      >
                        View
                      </Button>
                    </AnimateButton>
                  </Grid>
                  <Grid item>
                    <Button component={Link} href="https://links.codedthemes.com/hsqll" variant="contained" target="_blank" color='secondary' size="large">
                      Add to list
                    </Button>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
            {/* <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.6 }}
              >
                <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <CardMedia
                    component="img"
                    image={mode === ThemeMode.DARK ? TechDark : TechLight}
                    alt="Berry Tech"
                    sx={{ width: { xs: '75%', sm: '50%', md: '75%' } }}
                  />
                </Stack>
              </motion.div>
            </Grid> */}
          </Grid>
        </Grid>
        {/* <Grid item xs={12} md={7} sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Box sx={{ position: 'relative', mt: 8.75, zIndex: 9 }}>
            <HeaderImage src={dashboard} alt="Berry" />
            <Box
              sx={{
                position: 'absolute',
                top: { md: -35, lg: -110 },
                right: themeDirection === ThemeDirection.RTL ? 170 : { md: -50, lg: -140, xl: -220 },
                width: { md: 220, lg: 290 },
                animation: '10s slideY linear infinite'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.2 }}
              >
                <HeaderAnimationImage src={widget1} alt="Berry" />
              </motion.div>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: { md: -20, lg: -90 },
                left: { md: 100, lg: 300 },
                width: { md: 220, lg: 280 },
                animation: '10s slideY linear infinite',
                animationDelay: '2s'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.4 }}
              >
                <HeaderAnimationImage src={widget2} alt="Berry" />
              </motion.div>
            </Box>
          </Box>
          {HeaderAnimationImagememo}
        </Grid> */}
      </Grid>
    </Container>
  );
};

export default HeaderSection;
