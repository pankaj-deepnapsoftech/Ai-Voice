import {Schema,model} from "mongoose";

const notificationSchema = new Schema({
  title:{type:String,required:true},
  reciver:{type:Schema.Types.ObjectId,ref:"User",required:true},
  read:{type:Boolean,required:true,default:false}
},{timestamps:true});

export const NotificationModel = model("Notification",notificationSchema);