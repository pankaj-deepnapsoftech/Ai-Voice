import { string, object } from 'yup';

export const RegisterValidation = object({
  email: string().email().required(),
  password: string().min(6).max(16).required(),
  name: string().min(2).required(),
});

export const LoginValidation = object({
  email: string().email().required(),
  password: string().min(6).max(16).required(),
});
