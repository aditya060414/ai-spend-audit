import mongoose, { Schema, Document } from "mongoose";
import { AuditInput, AuditSummary } from "../services/auditEngine.js";
export interface IReport extends Document {
  shareId: string;
  inputs: AuditInput;
  auditResults: AuditSummary;
  aiSummary: string;
  summaryWasFallback: boolean;
  isLeadCaptured: boolean;
}

const ReportSchema = new Schema<IReport>(
  {
    shareId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    inputs: {
      teamSize: {
        type: Number,
        required: true,
      },
      useCases: {
        type: String,
        required: true,
      },
      tools: [
        {
          toolName: {
            type: String,
            required: true,
          },
          currentPlan: {
            type: String,
            required: true,
          },
          seats: {
            type: Number,
            required: true,
          },
          monthlyCost: {
            type: Number,
            required: true,
          },
        },
      ],
    },
    auditResults: {
      perTool: [
        {
          toolName: String,
          currentPlan: String,
          currentMonthlySpending: Number,
          recommendedAction: String,
          recommendedPlan: String,
          projectedMonthlyCost: Number,
          monthlySavings: Number,
          annualSavings: Number,
          reason: String,
        },
      ],
      totalMonthlySavings: Number,
      totalAnnualSavings: Number,
      savingsCategory: String,
    },
    aiSummary: {
      type: String,
      default: "",
    },
    summaryWasFallback: {
      type: Boolean,
      default: false,
    },
    isLeadCaptured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Report = mongoose.model<IReport>("Report", ReportSchema);
