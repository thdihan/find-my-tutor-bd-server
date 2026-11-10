import { Response } from 'express';

export interface IMetaResponse {
  page?: number;
  limit?: number;
  total?: number;
  totalPage?: number;
  timestamp?: string;
}

export interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: IMetaResponse;
  data: T;
}

export const sendResponse = <T>(res: Response, data: IApiResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || 'Operation successful',
    meta: data.meta
      ? {
          timestamp: new Date().toISOString(),
          ...data.meta,
        }
      : {
          timestamp: new Date().toISOString(),
        },
    data: data.data,
  });
};
