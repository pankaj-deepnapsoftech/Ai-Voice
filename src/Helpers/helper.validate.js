import { Validater } from './validator.js';
import { LoginValidation, RegisterValidation } from '../Validation/Auth.validation.js';

// auth validations
export const CheckRegisterData = Validater(RegisterValidation);
export const CheckLoginData = Validater(LoginValidation);
