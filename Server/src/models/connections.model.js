import mongoose, { Schema } from "mongoose";

const connectionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    connectedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure uniqueness (1 user can't connect to same user multiple times)
connectionSchema.index({ userId: 1, connectedTo: 1 }, { unique: true });

export const Connection = mongoose.model("Connection", connectionSchema);
