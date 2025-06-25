import { jwtDecode } from 'jwt-decode';
import { IUser } from "../types/user";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const removeTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getCurrentUser = (): IUser | null => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<IUser>(token);
    return decoded;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
