import { Center, Spinner, BoxProps, Box } from '@chakra-ui/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';

const LoadDataContainer = ({
  isNoData,
  src,
  children,
  isLoading,
  noNeedConnectWallet = false,
  ...boxProps
}: {
  isNoData?: boolean;
  noNeedConnectWallet?: boolean;
  isLoading?: boolean;
  src?: string;
  children: React.ReactNode;
} & BoxProps) => {
  const account = useAccount();
  const t = useTranslations();

  if (noNeedConnectWallet && !isNoData) return <>{children}</>;

  return (
    <>
      {isLoading || isNoData || !account.address ? (
        <Center
          alignContent={'center'}
          flexDir={'column'}
          gap={4}
          justifyContent={'center'}
          minH="100px"
          w={'full'}
          {...boxProps}
        >
          {!account.address && !noNeedConnectWallet ? (
            <>
              <Image
                alt="No Data"
                height={150}
                src={'/assets/img/connect.png'}
                width={160}
              />
              <Box
                color={'gray.500'}
                fontSize={'md'}
              >
                {t('Please connect your wallet first')}
              </Box>
            </>
          ) : (
            <>
              {isLoading ? (
                <Spinner size={'xl'} />
              ) : isNoData ? (
                <>
                  <Image
                    alt="No Data"
                    height={100}
                    src={src || '/assets/img/nodata.png'}
                    width={100}
                  />
                </>
              ) : (
                <div></div>
              )}
            </>
          )}
        </Center>
      ) : (
        children
      )}
    </>
  );
};
export default LoadDataContainer;
