import RequestContext from './context';
import useRequest from './useRequest';
import useLazyRequest from './useLazyRequest';

export { RequestContext, useRequest, useLazyRequest };

export type ListResponse<T> = {
  count: number;
  results: T[];
  next?: string;
};
