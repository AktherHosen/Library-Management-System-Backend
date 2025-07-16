import { model, Schema } from "mongoose";
import { BookStaticMethods, IBorrow } from "../interfaces/borrow.interfaces";
import { Books } from "./books.model";

const borrowSchema = new Schema<IBorrow, BookStaticMethods>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Books", required: true },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Must be an positive integer"],
    },
    dueDate: { type: Date, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

borrowSchema.static(
  "updateAvailability",
  async function (bookId: string, quantity: number) {
    const book = await Books.findById(bookId);

    if (!book) {
      throw new Error("Book not found");
    }

    if (book.copies < quantity) {
      throw new Error("Not enough copies available");
    }

    book.copies -= quantity;

    if (book.copies === 0) {
      book.available = false;
    }

    await book.save();
    return quantity;
  }
);

export const Borrow = model<IBorrow, BookStaticMethods>("Borrow", borrowSchema);
