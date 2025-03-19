import { StatusCodes } from "http-status-codes";
// local imports
import { NotificationModel } from "../model/notification.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { NotFoundError } from "../utils/customError.js";

export const CreateNotification = AsyncHandler(async (req, res) => {
  const data = req.body;
  await NotificationModel.create(data);
  return res.status(StatusCodes.CREATED).json({
    message: "Notification created successful"
  });
});

export const GetNotification = AsyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const pages = parseInt(page) || 1;
  const limits = parseInt(limit) || 10;
  const allData = limits * pages;
  const data = await NotificationModel.find({ reciver: req.currectUser?._id }).sort({ _id: -1 }).limit(allData);
  return res.status(StatusCodes.OK).json({
    data
  });
});


export const ReadNotification = AsyncHandler(async (req, res) => {
  const find = await NotificationModel.find({ reciver: req.currectUser?._id, read: false });
  if (find.length <= 0) {
    throw new NotFoundError("notification already readed", "ReadNotification method");
  }
  await NotificationModel.updateOne({ reciver: req.currectUser?._id }, { read: true });
  return res.status(StatusCodes.OK).json({
    message: "Notification  readed"
  });
});