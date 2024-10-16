const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name field should not be blank"],
  },
  email: {
    type: String,
    required: [true, "Email address is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Password can not be empty"],
    minlength: [8, "Password must be atleast 8 characters or more"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (val) {
        // 'this' only points on CREATE and SAVE!!!
        return val === this.password
      },
      message: "Passwords must match!",
    },
  },
})

userSchema.pre("save", async function (next) {
  // only run this function when password is modified
  if (!this.isModified("password")) return next()

  // hashing the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  // delete the passwordConfirm field
  this.passwordConfirm = undefined
  next()
})

const User = mongoose.model("User", userSchema)

module.exports = User