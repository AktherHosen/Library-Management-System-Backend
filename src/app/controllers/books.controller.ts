import express, { Request, Response } from "express";
import { Books } from "../models/books.model";

export const booksRoutes = express.Router();

// Create a book
booksRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const data = await Books.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      data,
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
      message: "Failed to create book",
      success: false,
      error,
    });
  }
});

// Get all books (with filtering, sorting, limit)
booksRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const genre = req.query.filter as string;
    const sortBy = req.query.sortBy as string;
    const sort = (req.query.sort as string) || "asc";
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const sortOrder = sort === "desc" ? -1 : 1;

    const query = Books.find(genre ? { genre } : {})
      .sort(sortBy ? { [sortBy]: sortOrder } : {})
      .limit(limit);

    const books = await query;

    return res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve books",
      error,
    });
  }
});

// Get book by ID
booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const data = await Books.findById(bookId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve book",
      success: false,
      error,
    });
  }
});

// Update a book
booksRoutes.patch("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;

    const book = await Books.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const data = await Books.findByIdAndUpdate(bookId, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data,
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
      success: false,
      message: "Failed to update book",
      error,
    });
  }
});

// Delete a book
booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;

    const data = await Books.findByIdAndDelete(bookId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete book",
      error,
    });
  }
});
