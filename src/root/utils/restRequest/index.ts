import {
  RequestContext,
  useRequest,
  useLazyRequest,
  RequestOptions,
  LazyRequestOptions,
} from '@togglecorp/toggle-request';

export type ListResponse<T> = {
  count: number;
  results: T[];
  next?: string;
};

// eslint-disable-next-line max-len
const useGoLazyRequest: <R, C = null>(requestOptions: LazyRequestOptions<R, Error, C, unknown>) => {
    response: R | undefined;
    pending: boolean;
    error: Error | undefined;
    trigger: (ctx: C) => void;
    context: C | undefined,
} = useLazyRequest;

const useGoRequest: <R>(requestOptions: RequestOptions<R, Error, unknown>) => {
    response: R | undefined;
    pending: boolean;
    error: Error | undefined;
    retrigger: () => void;
} = useRequest;

export {
  RequestContext,
  useGoRequest as useRequest,
  useGoLazyRequest as useLazyRequest,
};
