// {
//     "data": {
//         "token": "uLJMmvyH9fqBZCUOVJohvYFK3MkzW8",
//         "is_registered": true
//     },
//     "error": {},
//     "meta": {}
// }
export interface BaseResponse<TData, TError = unknown, TMeta = unknown> {
  data: TData;
  error: TError;
  meta: TMeta;
}
