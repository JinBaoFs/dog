import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useBlockNumber, useAccount } from 'wagmi';
import { useVisible } from '@/hooks/useVisible';
import { updateBlockNumber } from './actions';

const Updater = () => {
  const dispatch = useDispatch();
  const { chain } = useAccount();
  const visible = useVisible();
  const { data } = useBlockNumber({
    watch: visible
  });

  useEffect(() => {
    if (data && chain?.id) {
      dispatch(
        updateBlockNumber({ chainId: chain?.id, blockNumber: Number(data) })
      );
    }
  }, [dispatch, data, chain]);

  return <></>;
};
export default Updater;
