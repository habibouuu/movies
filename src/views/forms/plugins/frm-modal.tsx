'use client';

// project imports
import SimpleModal from 'components/forms/plugins/Modal/SimpleModal';
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| MODAL PAGE ||============================== //

const Modal = () => (
  <MainCard title="Simple Modal">
    {/* <ServerModal /> */}
    <SimpleModal />
  </MainCard>
);

export default Modal;
