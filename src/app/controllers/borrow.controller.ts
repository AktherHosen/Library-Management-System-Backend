import express, { Request, Response } from "express";

import { Books } from "../models/books.model";
import { Borrow } from "../models/borrow.model";

export const borrowRoutes = express.Router();

// Borrow Books
borrowRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;

    if (!bookId || !quantity || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "book, quantity, and dueDate fields are required",
      });
    }

    const book = await Books.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        error: "No book exists with the provided ID",
      });
    }

    if (book.copies < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough copies available",
        error: `Only ${book.copies} copies available`,
      });
    }

    await Borrow.updateAvailability(bookId, quantity);

    const borrowData = await Borrow.create({
      book: bookId,
      quantity,
      dueDate,
    });

    return res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrowData,
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        success: false,
        error: error,
      });
    }

    return res.status(500).json({
      message: "Failed to borrow book",
      success: false,
      error,
    });
  }
});

// Borrowed books summary via aggregation pipelines
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
      { $unwind: "$book" },
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

    return res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: borrowedBooksSummary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve borrowed books summary",
      error,
    });
  }
});
