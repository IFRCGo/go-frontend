export type Maybe<T> = T | null | undefined;

export interface UrlParams {
    [key: string]: Maybe<string | number | boolean | (string | number | boolean)[]>;
}
