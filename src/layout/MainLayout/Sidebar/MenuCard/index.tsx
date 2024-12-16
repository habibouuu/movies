import { memo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
// types
import { ThemeMode } from 'types/config';


// ==============================|| PROGRESS BAR WITH LABEL ||============================== //


// ==============================|| SIDEBAR - MENU CARD ||============================== //

const MenuCard = () => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.light',
        mb: 2.75,
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          width: 157,
          height: 157,
          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'primary.200',
          borderRadius: '50%',
          top: -105,
          right: -96
        }
      }}
    >
    </Card>
  );
};

export default memo(MenuCard);
