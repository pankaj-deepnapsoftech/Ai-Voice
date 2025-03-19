import { Validater } from './validator.js';
import { LoginValidation, RegisterValidation } from '../Validation/Auth.validation.js';
import { NotificationValidation } from '../Validation/Notification.validation.js';

// auth validations
export const CheckRegisterData = Validater(RegisterValidation);
export const CheckLoginData = Validater(LoginValidation);

// notification validation
export const NotificationValidater = Validater(NotificationValidation);