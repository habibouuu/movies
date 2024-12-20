// material-ui

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// third-party
import Slider, { Settings } from 'react-slick';



// assets
const Angular = '/assets/images/landing/frameworks/angular.svg';
const Bootstrap = '/assets/images/landing/frameworks/bootstrap.svg';
const Django = '/assets/images/landing/frameworks/django.svg';
const Vue = '/assets/images/landing/frameworks/vue.svg';
const Codeigniter = '/assets/images/landing/frameworks/Codeigniter.svg';
const DotNet = '/assets/images/landing/frameworks/dot-net.svg';
const Shopify = '/assets/images/landing/frameworks/shopify.svg';
const FullStack = '/assets/images/landing/frameworks/full-stack.svg';
const Flask = '/assets/images/landing/frameworks/flask.svg';

import MovieBox from 'components/app/MovieBox';

export const frameworks = [
  {
    title: 'Bootstrap 5',
    logo: Bootstrap,
    link: 'https://links.codedthemes.com/VpESi'
  },
  {
    title: 'Angular',
    logo: Angular,
    link: 'https://links.codedthemes.com/iNpKo'
  },
  {
    title: 'CodeIgniter',
    logo: Codeigniter,
    link: 'https://links.codedthemes.com/AdRiB'
  },
  {
    title: '.Net',
    logo: DotNet,
    link: 'https://links.codedthemes.com/wkQEu'
  },
  {
    title: 'Shopify',
    logo: Shopify,
    link: '/',
    isUpcoming: true
  },
  {
    title: 'Vuetify 3',
    logo: Vue,
    link: 'https://links.codedthemes.com/RqhwV'
  },
  {
    title: 'Full Stack',
    logo: FullStack,
    link: 'https://links.codedthemes.com/quhuG'
  },
  {
    title: 'Django',
    logo: Django,
    link: 'https://links.codedthemes.com/Wfbiy'
  },
  {
    title: 'Flask',
    logo: Flask,
    link: 'https://links.codedthemes.com/quhuG'
  }
];

// =============================|| LANDING - FRAMWORK SECTION ||============================= //
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
const FrameworkSection = ({title, movies, typ}:{title:string, movies:movi[], typ:string}) => {

  const settings: Settings = {
    dots: false,
    className: 'center',
    infinite: true,
    centerPadding: '60px',
    slidesToShow: 7,
    slidesToScroll: 7,
    speed: 500,
    swipeToSlide: false,
    responsive: [
      {
        breakpoint: 1534,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          dots: false
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          dots: false
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: false
        }
      }
    ]
  };

  return (
    <>
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
        <Typography variant="h2" sx={{ ml: 4 }}>
          {title}
          </Typography>
          <Box sx={{p:3}}/>
        <Slider {...settings}>
          {movies.map((item:movi, index:number) => (
            <MovieBox typ={typ} key={index} item={item}/>
          ))}
        </Slider>
      </Box>
    </>
  );
};

export default FrameworkSection;
