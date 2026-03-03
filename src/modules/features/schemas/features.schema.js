import { Schema, model } from "mongoose";
import {
  FeaturesTypeEnum,
  featuresCodeEnum,
  featuresDestinationEnums,
} from "../../../shared/index.js";

const featureSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(featuresCodeEnum),
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    type: {
      type: String,
      enum: Object.values(FeaturesTypeEnum),
      required: true,
    },
    subtitle: {
      type: String,
      minlength: 3,
      maxlength: 100,
      trim: true,
    },
    icon: {
      type: String,
    },
    link: {
      type: String,
      minlength: 1,
      maxlength: 200,
      trim: true,
      lowercase: true,
    },
    order: {
      type: Number,
      default: 1,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default : true
    },
    featuresIdParent: {
      type: Schema.Types.ObjectId,
      ref: "Features",
    },
    destination : {
      type : String,
      require : true,
      enum : Object.values(featuresDestinationEnums)
    }

  }
);

const Features = model("Features", featureSchema);

export default Features;
