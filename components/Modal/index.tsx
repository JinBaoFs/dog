import {
  Modal as CModal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  BoxProps,
  ModalHeader,
  ModalProps,
  ModalCloseButton,
  Box,
  Image
} from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { PropsWithChildren } from 'react';
import ChakraMotionBox from '../ChakraMotionBox';

const Modal = ({
  isOpen,
  onClose,
  children,
  header,
  showClose,
  modalIcon,
  modalTip,
  bodyBoxProps,
  ...modalProps
}: {
  bodyBoxProps?: BoxProps;
  isOpen: boolean;
  onClose: () => void;
  showClose?: boolean;
  modalIcon: string;
  modalTip?: string;
  header: string;
} & PropsWithChildren &
  ModalProps) => {
  return (
    <>
      <CModal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size={'xs'}
        {...modalProps}
      >
        <ModalOverlay />
        <ModalContent
          bg={'white'}
          borderRadius={'2.5xl'}
          position={'relative'}
        >
          {showClose && (
            <ModalCloseButton
              color={'black'}
              right={4}
              top={4}
              zIndex={'1'}
            />
          )}
          <ModalHeader
            color={'black'}
            fontSize={'16px'}
            p={5}
            textAlign={'center'}
          >
            {header}
          </ModalHeader>
          <ModalBody
            mt={'184px'}
            pb={5}
            pt={0}
            {...bodyBoxProps}
            px={0}
          >
            {modalTip && (
              <Box
                color={'black'}
                fontSize={'xs'}
                pos={'absolute'}
                textAlign={'center'}
                top={'62px'}
                w={'full'}
              >
                {modalTip}
              </Box>
            )}
            <AnimatePresence mode="wait">
              {modalIcon && (
                <Box
                  left={'50%'}
                  pos={'absolute'}
                  top={'99px'}
                  transform={'translateX(-50%)'}
                >
                  <ChakraMotionBox
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    initial={{ y: 20, opacity: 0 }}
                    key={modalIcon}
                    transition={{ duration: '0.3' }}
                  >
                    <Image
                      alt=""
                      borderRadius={'0.625xl'}
                      h={'128px'}
                      src={modalIcon}
                      w={'128px'}
                    />
                  </ChakraMotionBox>
                </Box>
              )}
            </AnimatePresence>
            <Box
              bg={'blue.100'}
              borderRightRadius={'2.5xl'}
              borderTopRadius={'2.5xl'}
              h={'193px'}
              left={0}
              pos={'absolute'}
              top={0}
              w={'full'}
              zIndex={'hide'}
            />
            <Box
              pos={'relative'}
              px={5}
            >
              {children}
            </Box>
          </ModalBody>
        </ModalContent>
      </CModal>
    </>
  );
};

export default Modal;
