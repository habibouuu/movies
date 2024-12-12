// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import CardMedia from '@mui/material/CardMedia';
// import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import Slider, { Settings } from 'react-slick';

// project imports
import SubCard from 'ui-component/cards/SubCard';

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

// types
import { ThemeMode } from 'types/config';

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

const FrameworkSection = () => {
  const theme = useTheme();

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
        <Typography variant="h2" sx={{ ml: 2 }}>
          Title
          </Typography>
        <Slider  {...settings}>
          {frameworks.map((item, index) => (
            <Badge
              key={index}
              color="primary"
              badgeContent={item.isUpcoming ? 'Coming Soon' : 0}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              sx={{
                '& .MuiBadge-badge': {
                  left: '50%',
                  transform: 'scale(1) translate(-50%, 0)',
                  ...(item.isUpcoming && {
                    bgcolor: 'background.paper',
                    color: 'primary.main',
                    border: '1px solid',
                    borderColor: 'primary.main'
                  })
                }
              }}
            >
              <SubCard
                content={false}
                sx={{
                  width: '180px !important',
                  height: 140,
                  border: 'none',
                  display: 'inline-flex !important',
                  alignItems: 'center',
                  justifyContent: 'center',
                  my: 1,
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.800' : 'grey.100',
                  '&:hover': {
                    bgcolor: theme.palette.mode === ThemeMode.DARK ? 'primary.main' : 'primary.light'
                  }
                }}
              >
                <Box
                  component={Link}
                  href={item.link}
                  target="_blank"
                  underline="none"
                  sx={{
                    display: 'flex',
                    flex: 1,
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Stack spacing={2} alignItems="center">
                    <Stack sx={{ width: 'auto', height: 48 }} alignItems="center" justifyContent="center">
                      <CardMedia alt={item.title} src={item.logo} component="img" />
                    </Stack>
                    <Typography variant="h4" sx={{ width: 'max-content' }}>
                      {item.title}
                    </Typography>
                  </Stack>
                </Box>
              </SubCard>
            </Badge>
          ))}
        </Slider>
      </Box>
    </>
  );
};

export default FrameworkSection;
