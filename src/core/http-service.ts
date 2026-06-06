import axios, {
  RawAxiosRequestHeaders,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import appConfig from '@/configs/app.config';
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from '@/constants/api.constant';
import store, { signOutSuccess } from '@/store';
import { AUTH_DATA_STORAGE_KEY, AUTH_OTP_TOKEN_STORAGE_KEY } from '@/constants/app.constant';
import { ApiError } from '@/core/ApiError';

const BASE_URLS = {
  Base: import.meta.env.VITE_API_BASE_URL,
};

const unauthorizedCode = [401];

const httpService = axios.create({
  timeout: 60000,
  baseURL: BASE_URLS.Base,
});

httpService.interceptors.request.use(
  (config) => {
    const { auth } = store.getState();
    const accessToken = auth.session.token;
    let accessTokenFromStorage: string | undefined;
    let adminIdFromStorage: string | undefined;

    try {
      const raw = localStorage.getItem(AUTH_DATA_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          access_token?: string;
          user_info?: { id?: number | string };
        } | null;
        accessTokenFromStorage = parsed?.access_token;
        if (parsed?.user_info?.id !== undefined && parsed?.user_info?.id !== null) {
          adminIdFromStorage = String(parsed.user_info.id);
        }
      }
    } catch {
      accessTokenFromStorage = undefined;
      adminIdFromStorage = undefined;
    }

    const tokenToUse = accessToken ?? accessTokenFromStorage;

    if (tokenToUse) {
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${tokenToUse}`;
    }

    if (adminIdFromStorage) {
      config.headers.admin_id = adminIdFromStorage;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

httpService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;
    if (error?.response) {
      const statusCode = error.response.status;
      const originalRequest = error.config;

      if (statusCode >= 400) {
        const errorData = error.response?.data;

        if (statusCode === 400) {
          console.log('1');
          throw new ApiError({
            ...errorData,
            errorType: 'BadRequest',
          }); //as BadRequestError;
        }
      }
    }
    if (response && unauthorizedCode.includes(response.status)) {
      signOutSuccess();
      localStorage.removeItem(AUTH_DATA_STORAGE_KEY);
      localStorage.removeItem(AUTH_OTP_TOKEN_STORAGE_KEY);
    }

    return Promise.reject(error);
  }
);

// Modify the apiBase function to include cross-origin notifications
async function apiBase<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await httpService(url, options);

  // Notify cross-origin listeners if this is a data update
  if (options?.method && ['POST', 'PUT', 'DELETE'].includes(options.method.toUpperCase())) {
    // notifyCrossOriginUpdate(url, response.data);
  }

  return response.data as T;
}

async function readData<T>(
  url: string,
  headers?: AxiosRequestHeaders,
  apiType?: keyof typeof BASE_URLS, // Optional apiType parameter
  skipAuth?: boolean // Optional flag to skip authentication
): Promise<T> {
  httpService.defaults.baseURL = BASE_URLS[apiType || 'Base']; // Use default if not specified
  const options: AxiosRequestConfig & { skipAuth?: boolean } = {
    headers: headers,
    method: 'GET',
    skipAuth: skipAuth, // Add skipAuth flag to config
  };
  return await apiBase<T>(url, options);
}

async function createData<TModel, TResult>(
  url: string,
  data: TModel,
  headers?: AxiosRequestHeaders,
  skipAuth?: boolean
): Promise<TResult> {
  const options: AxiosRequestConfig & { skipAuth?: boolean } = {
    headers: headers,
    method: 'POST',
    data: JSON.stringify(data),
    skipAuth: skipAuth,
  };
  return await apiBase<TResult>(url, options);
}
async function createFormData<TModel, TResult>(
  url: string,
  data: TModel,
  headers?: AxiosRequestHeaders,
  skipAuth?: boolean
): Promise<TResult> {
  const options: AxiosRequestConfig & { skipAuth?: boolean } = {
    method: 'POST',
    headers: headers,
    data: data,
    skipAuth: skipAuth,
  };
  return await apiBase<TResult>(url, options);
}

async function updateData<TModel, TResult>(
  url: string,
  data: TModel,
  headers?: AxiosRequestHeaders,
  skipAuth?: boolean
): Promise<TResult> {
  const options: AxiosRequestConfig & { skipAuth?: boolean } = {
    headers: headers,
    method: 'PUT',
    data: JSON.stringify(data),
    skipAuth: skipAuth,
  };
  return await apiBase<TResult>(url, options);
}

async function patchData<TModel, TResult>(
  url: string,
  data: TModel,
  headers?: AxiosRequestHeaders,
  skipAuth?: boolean
): Promise<TResult> {
  const options: AxiosRequestConfig & { skipAuth?: boolean } = {
    headers: headers,
    method: 'PATCH',
    data: JSON.stringify(data),
    skipAuth: skipAuth,
  };
  return await apiBase<TResult>(url, options);
}

async function deleteData(
  url: string,
  headers?: RawAxiosRequestHeaders,
  skipAuth?: boolean
): Promise<void> {
  const options: AxiosRequestConfig & { skipAuth?: boolean } = {
    headers: headers,
    method: 'DELETE',
    skipAuth: skipAuth,
  };
  return await apiBase(url, options);
}

export default httpService;
export { readData, createData, updateData, patchData, deleteData, createFormData };
