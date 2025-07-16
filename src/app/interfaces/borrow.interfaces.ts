import { Model, Types } from "mongoose";

export interface IBorrow {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

export interface BookStaticMethods extends Model<IBorrow> {
  updateAvailability(bookId: string, quantity: number): number;
}
