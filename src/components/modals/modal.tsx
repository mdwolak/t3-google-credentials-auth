import React from 'react';
import ReactDom from 'react-dom';

interface ModalProps {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  children: React.ReactNode;
}

const Modal = ({
  openModal,
  setOpenModal,
  children,
} : ModalProps) => {
  if (!openModal) return null;
  return ReactDom.createPortal(
    <>
      <div
        className='fixed inset-0 bg-[rgba(0,0,0,.5)] z-[1000]'
        onClick={() => setOpenModal(false)}
      ></div>
      <div className='max-w-lg w-full rounded-md fixed top-0 xl:top-[10%] left-1/2 -translate-x-1/2 bg-white z-[1001] p-6'>
        {children}
      </div>
    </>,
    document.getElementById('main-modal') as HTMLElement
  );
};

export default Modal;
