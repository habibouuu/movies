import React from 'react';
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from 'types/config';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import useAuth from 'hooks/useAuth';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import util from 'api/userFunctions';
import { openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';
// assets
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SubCard from 'ui-component/cards/SubCard';
import { useRouter } from 'next/navigation';
// import Modal from 'views/forms/plugins/frm-modal';
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
export default function MovieBox({ item, typ }: { item: movi, typ: string }) {
  const theme = useTheme();
   const [modalStyle] = React.useState(getModalStyle);
   const router = useRouter();
   const { isLoggedIn } = useAuth();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    const Body = React.forwardRef(({ modalStyle, item, open, setOpen, handleClose, handleOpen }: any, ref: React.Ref<HTMLDivElement>) => (
      <div ref={ref} tabIndex={-1}>
        {/**
         * sx={...modalStyle}
         * Property 'style' does not exist on type 'IntrinsicAttributes & MainCardProps & RefAttributes<HTMLDivElement>
         */}
        <MainCard
          sx={{ position: 'absolute', width: { xs: '95%', md:'85%', lg: '70%' }, backgroundSize:'cover', minHeight:'400px', height: { xs: '40%', md:'40%', lg: '45%' }, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundImage: `url(${'https://image.tmdb.org/t/p/w600_and_h900_bestv2'+item.backdrop_path})` }}
          title={item.title?item.title:item.name}
          content={false}
          secondary={
            <IconButton onClick={handleClose} size="large" aria-label="close modal">
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <CardContent sx={{width:{ xs: '75%', md:'50%', lg: '50%' }}}>
            <Typography variant="body1" sx={{ mt: 2, fontSize: { xs: '18px', md:'22px', lg: '26px'}, backgroundColor:'rgba(0, 0, 0, 0.55)', borderRadius:'6px',py:1 }}>
              {item.overview.length>130?item.overview.slice(0,130)+'...':item.overview}
            </Typography>
          </CardContent>
          <Divider />
          <CardActions>
            <SimpleModal  item={item} open={open} setOpen={setOpen} handleClose={handleClose} handleOpen={handleOpen}/>
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
            <Button variant="contained" type="button" color='success' onClick={()=>(typ=='movies'?router.push(`/movie/${item.name?item.name:item.title}/${item.id}`):router.push(`/tvshow/${item.name?item.name:item.title}/${item.id}`))}>
            Watch
          </Button>
          <Box sx={{px:1}}/>
          <Button variant="contained" type="button" color='secondary' onClick={()=>handleWatchLater(item)}>
            Watch Later
          </Button>
          <Box sx={{px:1}}/>
          <Button variant="contained" type="button" color='warning' onClick={()=>handleFavorites(item)}>
            Add to Favorites
          </Button></>:<Button variant="contained" type="button" color='secondary' onClick={()=>router.push('/login')}>
            Login to save
          </Button>}
          <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            <Body item={item} modalStyle={modalStyle} handleClose={handleClose} />
          </Modal>
        </Grid>
      );
    }
    console.log(typ)
  return (
    <Box
      sx={{
        overflow: 'hidden',
        div: {
          textAlign: 'center'
        },
        '.slick-track': {
          display: { xs: 'flex', xl: 'inherit' }
        },
        '& .slick-dots': {
          position: 'initial',
          '& li button:before': {
            fontSize: '0.75rem'
          },
          '& li.slick-active button:before': {
            opacity: 1,
            color: 'primary.main'
          }
        }
      }}
    >
      {/* <Typography variant="h2" sx={{ ml: 2 }}>
        {item.title}
      </Typography> */}
      <SubCard
        content={false}
        sx={{
          width: '180px !important',
          height: 250,
          border: 'none',
          display: 'inline-flex !important',
          alignItems: 'center',
          justifyContent: 'center',
          // my: 1,
          borderRadius: 2,
          cursor: 'pointer',
          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.800' : 'grey.100',
          '&:hover': {
            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'primary.main' : 'primary.light'
          }
        }}
      >
        <Button
          
          onClick={handleOpen}
          sx={{
            display: 'flex',
            flex: 1,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Stack sx={{ width: '100%', height: 'auto' }} alignItems="center" justifyContent="center">
              <CardMedia sx={{ width: '100%', height: 270 }} alt={item.title?item.title:item.name} src={'https://image.tmdb.org/t/p/w600_and_h900_bestv2'+item.poster_path} component="img" />
            </Stack>
            <Typography variant="h4" sx={{ width: 'max-content' }}>
              {item.title?item.title:item.name}
            </Typography>
          </Stack>
        </Button>
      </SubCard>
      <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
        <Body item={item} modalStyle={modalStyle} handleClose={handleClose} open={open} setOpen={setOpen} handleOpen={handleOpen} />
      </Modal>
    </Box>
  );
}





