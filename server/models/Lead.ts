import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  shareId: string;
  email: string;
  companyName?: string;
  role?: string;
  totalMonthlySavings: number;
  isHighValue: boolean;
  emailSent: boolean;
}

const leadSchema = new Schema<ILead>(
  {
    shareId: {
      type: String,
      index: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    companyName: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    totalMonthlySavings: {
      type: Number,
      required: true,
    },
    isHighValue: {
      type: Boolean,
      default: false,
      index: true,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Lead = mongoose.model("Lead", leadSchema);
