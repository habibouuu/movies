import { FC, ReactNode } from 'react';

// project imports
import Customization from '../Customization';
import { Box } from '@mui/material';
import Image from 'next/image';
import iim from '../../../public/assets/images/auth/loginbackground.jpg'
interface Props {
  children: ReactNode;
}

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout: FC<Props> = ({ children }) => (
  <>
 
    {children}
    <Customization />
  </>
);

export default MinimalLayout;
