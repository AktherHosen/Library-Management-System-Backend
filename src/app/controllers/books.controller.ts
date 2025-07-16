import express, { Request, Response } from "express";
import { z } from "zod";
import { Books } from "../models/books.model";

export const booksRoutes = express.Router();

const CreateBookZodSchema = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z.number(),
  available: z.boolean(),
});

// Create New Books
booksRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const zodBody = await CreateBookZodSchema.parseAsync(req.body);
    const data = await Books.create(zodBody);
    res.status(201).json({
      success: true,
      message: "Books created successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to create book",
      success: false,
      error,
    });
  }
});

booksRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const genre = req.query.filter as string;
    const sortBy = req.query.sortBy as string;
    const sort = req.query.sort as string;
    const limitBooks = (req.query.limit as string) || "10";

    let query = Books.find();

    if (genre) {
      query = Books.find({ genre });
    }

    if (sortBy && sort) {
      const sortOption: { [key: string]: any } = {};
      sortOption[sortBy] = sort === "desc" ? -1 : 1;
      query = query.sort(sortOption);
    }

    if (limitBooks) {
      query = query.limit(parseInt(limitBooks));
    }

    const books = await query;

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to retrieve books",
      success: false,
      error,
    });
  }
});

booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const data = await Books.findById(bookId);

    if (!data) {
      res.status(404).json({
        status: false,
        message: "Failed to retrive books",
      });
    }

    res.status(201).json({
      status: true,
      message: "Books retrieved successfully",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to retrieve books",
      success: false,
      error,
    });
  }
});

booksRoutes.patch("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const body = req.body;

  const book = await Books.findById(bookId);
  if (!book) {
    res.status(404).json({
      success: false,
      message: "Books not found",
    });
  }

  const data = await Books.findByIdAndUpdate(bookId, body, { new: true });

  res.status(201).json({
    success: true,
    message: "Books updated successfully",
    data,
  });
});

booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const data = await Books.findOneAndDelete({ _id: bookId });

  if (!data) {
    res.status(404).json({
      success: false,
      message: "Books not found",
    });
  }

  res.status(201).json({
    success: true,
    messaage: "Books deleted successfully",
    data: null,
  });
});
