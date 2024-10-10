export type UserResponseType = {
  id: number;
  name: string;
  lastname: string;
  email: string;
  role: null;
  averageRating: null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
};

export type LoginValues = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: UserResponseType;
  token: string;
};

export type SuccessResponseType<T> = {
  success: true;
  message: string;
  data: T;
};

export type ErrorResponseType = {
  success: false;
  message: string;
  error: string;
};

export type ApiResponseType<T> = SuccessResponseType<T> | ErrorResponseType;

// Example usage with UserResponseType
export type UserApiResponseType = ApiResponseType<{
  user: UserResponseType;
  token: string;
}>;
