import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  if (err instanceof mongoose.Error.ValidationError) {
    const filteredError = {
      name: err.name,
      errors: err.errors,
    };

    return res.status(400).json({
      message: "Validation failed",
      success: false,
      error: filteredError,
    });
  }
  return res.status(500).json({
    message: "Internal server error",
    success: false,
    error: err,
  });
};
