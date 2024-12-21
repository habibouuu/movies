"use client"

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import util from 'api/userFunctions';
import { openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';
// third party
import { motion } from 'framer-motion';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import React from 'react';


import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import useAuth from 'hooks/useAuth';
// assets
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';



// assets
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function rand() {
            return Math.round(Math.random() * 20) - 10;
          }
function getModalStyle() {
            const top = 50 + rand();
            const left = 50 + rand();
          
            return {
              top: `${top}%`,
              left: `${left}%`,
              transform: `translate(-${top}%, -${left}%)`
            };
          }
const HeaderSection = ({headMovie}:{headMovie:any}) => {

  const [modalStyle] = React.useState(getModalStyle);
  const router = useRouter()
    const {isLoggedIn} = useAuth();
  const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    
    const Body = React.forwardRef(({ modalStyle,  open, setOpen, handleClose, handleOpen }: any, ref: React.Ref<HTMLDivElement>) => (
      <div ref={ref} tabIndex={-1}>
        {/**
         * sx={...modalStyle}
         * Property 'style' does not exist on type 'IntrinsicAttributes & MainCardProps & RefAttributes<HTMLDivElement>
         */}
        <MainCard
         sx={{ position: 'absolute', width: { xs: '95%', md:'85%', lg: '70%' }, backgroundSize:'cover', minHeight:'400px', height: { xs: '40%', md:'40%', lg: '45%' }, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundImage: `url(${'https://image.tmdb.org/t/p/w600_and_h900_bestv2'+headMovie.backdrop_path})` }}
          title={headMovie.title?headMovie.title:headMovie.name}
          content={false}
          secondary={
            <IconButton onClick={handleClose} size="large" aria-label="close modal">
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <CardContent sx={{width:{ xs: '75%', md:'50%', lg: '50%' }}}>
            <Typography variant="body1" sx={{ mt: 2, fontSize: { xs: '18px', md:'22px', lg: '26px'}, backgroundColor:'rgba(0, 0, 0, 0.55)', borderRadius:'6px',py:1 }}>
              {headMovie.overview.length>130?headMovie.overview.slice(0,130)+'...':headMovie.overview}
            </Typography>
          </CardContent>
          <Divider />
          <CardActions>
            <SimpleModal  item={headMovie} open={open} setOpen={setOpen} handleClose={handleClose} handleOpen={handleOpen}/>
          </CardActions>
        </MainCard>
      </div>
    ));
    
    function SimpleModal({item, open, setOpen, handleClose, handleOpen}:any) {
      // getModalStyle is not a pure function, we roll the style only on the first render
      const [modalStyle] = React.useState(getModalStyle);
    

      const handleWatchLater = (elem:any) => {
        (async ()=>{
          await util.addwatchlater(elem)
          
        })();
        
        dispatch(
            openSnackbar({
              open: true,
              message: 'Added to Watch Later',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
          setTimeout(()=>{
            handleClose();
          },800)
      };
      const handleFavorites = (elem:any) => {
        (async ()=>{
          await util.addFavorites(elem)
        })();

        dispatch(
          openSnackbar({
            open: true,
            message: 'Added to Favorites',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
        setTimeout(()=>{
          handleClose();
        },800)
      };
      return (
        <Grid container justifyContent="flex-start">
          {isLoggedIn?<>
            <Button variant="contained" type="button" color='success' onClick={()=>(router.push(`/movie/${item.name?item.name:item.title}/${item.id}`))}>
            Watch
          </Button>
            <Box sx={{px:1}}/>
          <Button variant="contained" type="button" color='secondary' onClick={()=>handleWatchLater(item)}>
            Watch Later
          </Button>
          <Box sx={{px:1}}/>
          <Button variant="contained" type="button" color='warning' onClick={()=>handleFavorites(item)}>
            Add to Favorites
          </Button>
          </>:<Button variant="contained" type="button" color='secondary' onClick={()=>router.push('/login')}>
            Login to save
          </Button>}
          <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            <Body item={item} modalStyle={modalStyle} handleClose={handleClose} />
          </Modal>
        </Grid>
      );
    }
  const headerSX = { fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem', lg: '3.5rem' } };
  

  return (
    <Container sx={{ height: '60vh', width:'100%',display: 'flex', justifyContent: 'center',backgroundSize:'cover', backgroundImage: headMovie? `url('https://image.tmdb.org/t/p/w600_and_h900_bestv2${headMovie.backdrop_path}')`:'none' , alignItems: 'center' }}>
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
               
                        onClick={handleOpen}
                        // target="_blank"
                        size="large"
                        variant="contained"
                        color="error"
                        startIcon={<PlayArrowIcon />}
                      >
                        View
                      </Button>
                    </AnimateButton>
                  </Grid>
                  
                </Grid>
              </motion.div>
            </Grid>
            <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
        <Body modalStyle={modalStyle} handleClose={handleClose} />
      </Modal>
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
