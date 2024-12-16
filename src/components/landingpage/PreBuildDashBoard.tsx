
'use client'
import React from 'react';

import CardMedia from '@mui/material/CardMedia';
// import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { CardProps } from '@mui/material/Card';
import Modal from '@mui/material/Modal';
// project imports
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SubCard from 'ui-component/cards/SubCard';
// assets
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
// material-ui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import MainCard from 'ui-component/cards/MainCard';
import util from 'api/userFunctions';
import { openSnackbar } from 'store/slices/snackbar';
import { dispatch } from 'store';
import { useRouter } from 'next/navigation';
import useAuth from 'hooks/useAuth';

// third-party
import { Carousel } from 'react-responsive-carousel';

// assets
import { IconChevronRight, IconChevronLeft, IconLink } from '@tabler/icons-react';

const Images = styled('img')({
  width: '100%',
  height: 'auto',
  marginBottom: 32,
  backgroundSize: 'cover',
  objectFit: 'cover'
});

function SampleNextArrow(props: any) {
  const theme = useTheme();
  const { onClickHandler } = props;

  return (
    <IconButton
      onClick={onClickHandler}
      sx={{
        position: 'absolute',
        zIndex: 2,
        top: 'calc(50% - 70px)',
        cursor: 'pointer',
        bgcolor: `${theme.palette.background.paper} !important`,
        width: { xs: '40px !important', xl: '65px !important' },
        height: { xs: '40px !important', xl: '65px !important' },
        boxShadow: '0px 24px 38px rgba(9, 15, 37, 0.07)',
        '&:after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          transform: 'scale(9)'
        },
        svg: {
          height: { md: 20, lg: 40, xl: '40px' },
          width: { md: 20, lg: 40, xl: '40px' }
        },
        right: { xs: '50px', md: '80px', lg: '120px', xl: '220px' }
      }}
      aria-label="button"
    >
      <IconChevronRight fontSize={25} color={theme.palette.grey[900]} />
    </IconButton>
  );
}

function SamplePrevArrow(props: any) {
  const theme = useTheme();
  const { onClickHandler } = props;

  return (
    <IconButton
      onClick={onClickHandler}
      sx={{
        position: 'absolute',
        zIndex: 2,
        top: 'calc(50% - 70px)',
        cursor: 'pointer',
        bgcolor: `${theme.palette.background.paper} !important`,
        width: { xs: '40px !important', xl: '65px !important' },
        height: { xs: '40px !important', xl: '65px !important' },
        boxShadow: '0px 24px 38px rgba(9, 15, 37, 0.07)',
        '&:after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          transform: 'scale(9)'
        },
        svg: {
          height: { md: 20, lg: 40, xl: '40px' },
          width: { md: 20, lg: 40, xl: '40px' }
        },
        left: { xs: '50px', md: '80px', lg: '120px', xl: '220px' }
      }}
      aria-label="button"
    >
      <IconChevronLeft fontSize={25} color={theme.palette.grey[900]} />
    </IconButton>
  );
}




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
            "title"?: string,
            "video": boolean
          };
  interface ItemProps {
  title?: string;
  caption?: string;
  image: string;
  name?:string;
  elem?:movi;
}
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
const PreBuildDashBoard = ({movies, title}:{movies:movi[],title:string}) => {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const [item,setItem] = React.useState<movi|undefined>();
  const [modalStyle] = React.useState(getModalStyle);
  const {isLoggedIn} = useAuth();
  const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setItem(undefined);
      setOpen(false);
    };
    interface BodyProps extends CardProps {
      modalStyle: React.CSSProperties;
      handleClose: () => void;
    }
    const Items = ({elem, title, caption, image}: ItemProps) => {
      return (
        <>
        <Button
        onClick={()=>{handleOpen();setItem(elem)}}
        >
          <Images
            src={image}
            
            alt="dashboard"
            sx={{
              // width: { xs: '100px', xl: 743 },
              objectFit: 'contain',
              direction: 'initial',
              height:'100%',
              borderRadius: '7%'
            }}
          />
          </Button>
          <Stack spacing={1} sx={{ pt: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
              component={Button}            
              onClick={()=>{handleOpen();setItem(elem)}}
              // href={link}
              // target="_blank"
              sx={{ textDecoration: 'none' }}
            >
              <Typography variant="h3" sx={{ fontWeight: 500 }}>
                {title}
              </Typography>
            </Stack>
            <Typography variant="subtitle2" color="text.primary" sx={{ fontSize: { xs: '1rem', xl: '1.125rem' } }}>
              {caption}
            </Typography>
          </Stack>
        </>
      );
    };
    const Body = React.forwardRef(({ modalStyle, item, open, setOpen, handleClose, handleOpen }: any, ref: React.Ref<HTMLDivElement>) => (
      <div ref={ref} tabIndex={-1}>
        {/**
         * sx={...modalStyle}
         * Property 'style' does not exist on type 'IntrinsicAttributes & MainCardProps & RefAttributes<HTMLDivElement>
         */}
        <MainCard
          sx={{ position: 'absolute', width: { xs: '95%', md:'85%', lg: '70%' }, backgroundSize:'cover', height: { xs: '35%', md:'45%', lg: '50%' }, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundImage: `url(${'https://image.tmdb.org/t/p/w600_and_h900_bestv2'+item.backdrop_path})` }}
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
          {isLoggedIn?<><Button variant="contained" type="button" color='secondary' onClick={()=>handleWatchLater(item)}>
            Watch Later
          </Button>
          <Box sx={{px:1}}/>
          <Button variant="contained" type="button" color='warning' onClick={()=>handleFavorites(item)}>
            Add to Favorites
          </Button> </>:<Button variant="contained" type="button" color='secondary' onClick={()=>router.push('/login')}>
            Login to save
          </Button>}
          <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            <Body item={item} modalStyle={modalStyle} handleClose={handleClose} />
          </Modal>
        </Grid>
      );
    }
  return (
    <>
      <Grid container spacing={7.5} justifyContent="center" sx={{ px: 1.25 }}>
        <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                {title}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box
            className="preBuildDashBoard-slider"
            sx={{
              direction: 'initial',
              '.slider': { height: { xs: 'auto' }, '& .slide:not(.selected)': { transformOrigin: 'center !important' } }
            }}
          >
            <Carousel
              showArrows={true}
              showThumbs={false}
              showIndicators={false}
              centerMode={downMD ? false : true}
              centerSlidePercentage={25}
              infiniteLoop={true}
              autoFocus={true}
              emulateTouch={true}
              swipeable={true}
              autoPlay={true}
              interval={2000}
              renderArrowPrev={(onClickHandler, hasPrev, label) =>
                hasPrev && <SamplePrevArrow onClickHandler={onClickHandler} hasPrev={hasPrev} label={label} />
              }
              renderArrowNext={(onClickHandler, hasNext, label) =>
                hasNext && <SampleNextArrow onClickHandler={onClickHandler} hasNext={hasNext} label={label} />
              }
            >
              {movies && movies.map((elem,index)=>{
                return <Items 
                elem={elem}
                title={elem.title?elem.title:elem.name}
                image={'https://image.tmdb.org/t/p/w600_and_h900_bestv2'+elem.poster_path}
              
              />
              })}
              
              
            </Carousel>
          </Box>
          <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
        <Body item={item} modalStyle={modalStyle} handleClose={handleClose} open={open} setOpen={setOpen} handleOpen={handleOpen} />
      </Modal>
        </Grid>
      </Grid>
    </>
  );
};

export default PreBuildDashBoard;
