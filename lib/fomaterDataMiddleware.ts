import { Middleware, SWRHook } from 'swr';
import { axiosDataType } from '@/api/type';

const fomaterDataMiddleware: Middleware = (useSWRNext: SWRHook) => {
  return (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    if (!swr.data) return swr;
    const { status, data, message } = swr.data as axiosDataType;
    return Object.assign({}, swr, {
      ...(status === 200 ? { data } : { error: message })
    });
  };
};

export const onSuccess = (data: axiosDataType) => {
  if (data.status !== 200) {
    throw new Error(data.message);
  }
};

export default fomaterDataMiddleware;
