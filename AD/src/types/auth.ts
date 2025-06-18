export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface IRegisterResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  };
}

export interface ILoginResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  };
}

