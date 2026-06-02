import axios from 'axios';
import appConfig from '@/configs/app.config';
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from '@/constants/api.constant';
import store, { signOutSuccess } from '@/store';
import { AUTH_DATA_STORAGE_KEY, AUTH_OTP_TOKEN_STORAGE_KEY } from '@/constants/app.constant';

const unauthorizedCode = [401];

const httpService = axios.create({
  timeout: 60000,
  baseURL: appConfig.apiPrefix,
});

httpService.interceptors.request.use(
  (config) => {
    const { auth } = store.getState();
    const accessToken = auth.session.token;
    let accessTokenFromStorage: string | undefined;

    if (!accessToken) {
      try {
        const raw = localStorage.getItem(AUTH_DATA_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { access_token?: string } | null;
          accessTokenFromStorage = parsed?.access_token;
        }
      } catch {
        accessTokenFromStorage = undefined;
      }
    }

    const tokenToUse = accessToken ?? accessTokenFromStorage;

    if (tokenToUse) {
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${tokenToUse}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

httpService.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && unauthorizedCode.includes(response.status)) {
      signOutSuccess();
      localStorage.removeItem(AUTH_DATA_STORAGE_KEY);
      localStorage.removeItem(AUTH_OTP_TOKEN_STORAGE_KEY);
    }

    return Promise.reject(error);
  }
);

export default httpService;
