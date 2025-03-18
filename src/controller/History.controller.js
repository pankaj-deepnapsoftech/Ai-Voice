import { StatusCodes } from "http-status-codes";
import { HistoryModel } from "../model/History.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { NotFoundError } from "../utils/customError.js";


export const CreateHistory = AsyncHandler(async (req,res) => {
    const {talk} = req.body;
    if(!talk.trim()){
        throw new NotFoundError('question us required',"Create History method ");
    }

    await HistoryModel.create({talk,creater:req.currectUser?._id})

    return res.status(StatusCodes.CREATED).json({
        message:"history created"
    })

});


export const GetHistory = AsyncHandler(async(req,res)=>{
    const data = await HistoryModel.find({creater:req.currectUser?._id});
    return res.status(StatusCodes.OK).json({
        data
    })
});

export const DeleteOneHistory = AsyncHandler(async(req,res)=> {
    const {id} = req.params;
    const data = await HistoryModel.findById(id);
    if(!data){
        throw new NotFoundError("data not found",'DeleteOneHistory method')
    }
    
    await HistoryModel.findByIdAndDelete(id);
    return res.status(StatusCodes.OK).json({
        message:"History deleted successful"
    })
})


export const DeleteAllHistory = AsyncHandler(async(req,res)=> {
    const data = await HistoryModel.find({creater:req.currectUser?._id});
    if(data.length <= 0){
        throw new NotFoundError("History already deleted",'DeleteAllHistory method')
    }
    
    await HistoryModel.deleteMany({creater:req.currectUser?._id});
    return res.status(StatusCodes.OK).json({
        message:"History deleted successful"
    })
})