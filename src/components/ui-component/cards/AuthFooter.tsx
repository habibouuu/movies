// material-ui
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://www.linkedin.com/in/abiboulaye-diagne-84884225b" target="_blank" underline="hover">
      Abiboulaye
    </Typography>
    <Typography variant="subtitle2" component={Link} href="https://abiboulaye.com" target="_blank" underline="hover">
      &copy; Abiboulaye.com
    </Typography>
  </Stack>
);

export default AuthFooter;
