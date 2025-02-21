import { AxiosRequestHeaders } from 'axios';
import REQUEST_API from './api';

export interface interAxiosRequestConfig extends AxiosRequestHeaders {
  [key: string]: string;
}

export type ajaxType<T> = {
  status: number;
  data: T;
  message: string;
};

export type requestsType = (toekn: string) => Promise<interAxiosRequestConfig>;

export type axiosDataType = {
  [key: string]: any;
};

export type axiosUrlType = keyof typeof REQUEST_API;
