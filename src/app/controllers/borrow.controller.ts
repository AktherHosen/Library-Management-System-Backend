import express, { Request, Response } from "express";
import { z } from "zod";

import { Books } from "../models/books.model";
import { Borrow } from "../models/borrow.model";

export const borrowRoutes = express.Router();

const BorrowBookZodSchema = z.object({
  book: z.string(),
  quantity: z
    .number()
    .int({ message: "Copies must be a positive number" })
    .min(1, { message: "Copies must be at least 1" }),
  dueDate: z.coerce.date({
    message: "Due date must be a valid date",
  }),
});

borrowRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const zodBody = await BorrowBookZodSchema.parseAsync(req.body);
    const { book: bookId, quantity } = zodBody;

    const findingBook = await Books.findById(bookId);
    if (!findingBook) {
      res.status(404).json({
        status: false,
        message: "Book not found",
      });
    }

    if (findingBook?.copies! < quantity) {
      res.status(404).json({
        status: false,
        message: "Not enough copies available",
      });
    }

    await Borrow.updateAvailability(bookId, quantity);

    const data = await Borrow.create(req.body);

    res.status(201).json({
      status: true,
      message: "Book borrowed successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: error,
    });
  }
});

borrowRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const borrowedBooksSummary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $unwind: "$book",
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$book.title",
            isbn: "$book.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({
      status: true,
      message: "Borrowed books summary retrieved successfully",
      data: borrowedBooksSummary,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve borrowed books summary",
      error: error,
    });
  }
});
