import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount, usePublicClient } from 'wagmi';
// import { updateBlockNumber } from '../application/actions';
import { Hash, TransactionReceiptNotFoundError } from 'viem';
import { useAddPopup, useBlockNumber } from '../application/hooks';
import { AppState } from '..';
import { checkedTransaction, finalizeTransaction } from './actions';

export function shouldCheck(
  lastBlockNumber: number,
  tx: { addedTime: number; receipt?: object; lastCheckedBlockNumber?: number }
): boolean {
  if (tx.receipt) return false;
  if (!tx.lastCheckedBlockNumber) return true;
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber;
  if (blocksSinceCheck < 1) return false;
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60;
  if (minutesPending > 60) {
    return blocksSinceCheck > 9;
  } else if (minutesPending > 5) {
    return blocksSinceCheck > 2;
  } else {
    return true;
  }
}

const Updater = () => {
  const { chain } = useAccount();
  const dispatch = useDispatch();
  const lastBlockNumber = useBlockNumber();
  const publicClient = usePublicClient();

  const addPopup = useAddPopup();
  const state = useSelector<AppState, AppState['transactions']>(
    (state: AppState) => state.transactions
  );

  useEffect(() => {
    if (!chain?.id) return;
    const transactions = chain?.id ? state[chain.id] ?? {} : {};
    (Object.keys(transactions) as Hash[])
      .filter(hash => shouldCheck(lastBlockNumber, transactions[hash]))
      .forEach(async (hash: Hash) => {
        try {
          const receipt = await publicClient?.getTransactionReceipt({
            hash
          });
          if (receipt) {
            const isSuccess = receipt.status === 'success';
            dispatch(
              finalizeTransaction({
                hash,
                receipt: {
                  to: receipt.to,
                  from: receipt.from,
                  status: isSuccess,
                  transactionHash: receipt.transactionHash,
                  transactionIndex: receipt.transactionIndex,
                  contractAddress: receipt.contractAddress as Hash,
                  blockHash: receipt.blockHash,
                  blockNumber: Number(receipt.blockNumber)
                },
                chainId: chain.id
              })
            );
            addPopup({
              content: {
                txn: {
                  hash,
                  success: isSuccess,
                  summary: transactions[hash]?.summary
                }
              },
              key: hash
            });
          } else {
            dispatch(
              checkedTransaction({
                chainId: chain.id,
                hash,
                blockNumber: lastBlockNumber
              })
            );
          }
        } catch (error) {
          console.log(error instanceof TransactionReceiptNotFoundError);
        }
      });
  }, [addPopup, dispatch, chain, publicClient, state, lastBlockNumber]);

  return <></>;
};
export default Updater;
