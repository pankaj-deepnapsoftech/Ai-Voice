import { string, object } from 'yup';


export const NotificationValidation = object({
  title:string().required("title is required field"),
  reciver:string().required("reciver is required field type of ObjectId"),
});