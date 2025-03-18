import {Schema,model} from "mongoose";


const HistorySchema = new Schema({
    talk:{type:String,required:true},
    creater:{type:Schema.Types.ObjectId,ref:"User"}
},{timestamps:true})

export const HistoryModel = model("History",HistorySchema);
