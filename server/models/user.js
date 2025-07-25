import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // hide password by default
  },
  profilePicUrl : {
    type : String,
    default : null
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  problemsSolved: {
    type: [String],
    default: []
  },
  contestAttended: {
    type: [String],
    default : []
  },
  aiUsage : {
    count : {
      type : Number,
      default : 0
    },
    lastUsed : {
      type : Date,
      default : null
    }
  },
  mobileNumber: {
    type: String,
    default: "",
  },
  linkedIn: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  resetPasswordToken : {
    type : String,
    default : null
  },
  resetPasswordExpire : {
    type : Date,
    default : null
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
