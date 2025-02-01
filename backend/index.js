import express from "express";
import { config } from "dotenv";
config();

import jwt from "jsonwebtoken";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import mongoose from "mongoose";
import User from "./schemas/user.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

// Replace these with your actual Google OAuth credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Set up session middleware
app.use(
	session({
		secret: "your_secret_key",
		resave: false,
		saveUninitialized: true,
	}),
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Set up passport to use Google OAuth
passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.BACKEND_URL + "/auth/google/callback", // Make sure this matches the redirect URI in Google Developer Console
		},
		(token, tokenSecret, profile, done) => {
			return done(null, profile);
		},
	),
);

// Google OAuth routes
app.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/" }),
	async (req, res) => {
		const token = jwt.sign(
			{
				user_id: req.user.id,
				name: req.user.displayName,
				photo: req.user.photos[0]?.value ?? "",
			},
			process.env.JWT_SECRET,
			{ expiresIn: "24h" },
		);

		let user = await User.findOne({ user_id: req.user.id });
		if (!user) {
			user = await User.create({
				id: req.user.id.toString(),
				name: req.user.displayName,
				photo: req.user.photos[0]?.value ?? "",
				elo: 1000,
			});
		}

		console.log(user, "WA ADDED");
		console.log(token);
		res.redirect(process.env.FRONTEND_URL + "/signin?token=" + token);
	},
);

// Profile route to display user information after login
app.get("/profile", (req, res) => {
	if (!req.user) {
		return res.redirect("/");
	}
	res.send(`<h1>Hello ${req.user.displayName}</h1>`);
});

// Logout route to log the user out
app.get("/logout", (req, res) => {
	req.logout(err => {
		if (err) return next(err);
		res.redirect("/");
	});
});

// Default route
app.get("/", (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect("/profile");
	}
	res.send('<a href="/auth/google">Login with Google</a>');
});

// Socket.IO connection
io.on("connection", socket => {
	console.log("a user connected");
});

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		// Start the server
		const PORT = process.env.PORT ?? 5050;
		server.listen(PORT, () => {
			console.log(`server running at http://localhost:${PORT}`);
		});
	});
