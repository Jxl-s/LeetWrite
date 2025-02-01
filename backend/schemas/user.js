import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	photo: {
		type: String,
		required: true,
	},
	elo: {
		type: Number,
		required: true,
		default: 1000,
	},
});

const User = mongoose.model("User", userSchema);
export default User;
