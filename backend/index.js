import { config } from "dotenv";
config();

import express from "express";
import OpenAI from "openai";
import jwt from "jsonwebtoken";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import mongoose from "mongoose";
import User from "./schemas/user.js";
import {
	createGame,
	deleteGame,
	joinGame,
	kickPlayer,
	openGames,
	setAI,
	setIO,
	startGame,
	submitDescription,
	updateStatus,
} from "./games/index.js";
import bodyParser from "body-parser";
import Game from "./schemas/game.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

app.use(
	session({
		secret: process.env.SESSION_SECRET,
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

const verifyToken = (req, res, next) => {
	if (!req.headers.authorization) {
		return res
			.status(401)
			.json({ message: "Authorization header required" });
	}

	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};

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

		let user = await User.findOne({ id: req.user.id });
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
	console.log("connected");
});

// handle disconnect
io.on("disconnect", socket => {
	console.log("disconnected");
});

app.get("/openGames", (req, res) => {
	res.json(openGames);
});

app.get("/joinGame/:gameId", verifyToken, async (req, res) => {
	console.log(req.user, "is the user");
	const gameId = req.params.gameId;
	const game = openGames.find(game => game.id == gameId);
	if (!game) {
		return res.status(404).json({ message: "Game not found" });
	}

	if (game.players.length >= game.capacity) {
		return res.status(400).json({ message: "Game is full" });
	}

	let user = await User.findOne({ id: req.user.user_id });
	joinGame(gameId, {
		id: req.user.user_id,
		name: req.user.name,
		photo: req.user.photo ?? "",
		elo: user.elo,
	});

	res.json({ message: "Joined game successfully" });
});

app.get("/leaveGame/:gameId", verifyToken, (req, res) => {
	const gameId = req.params.gameId;
	const game = openGames.find(game => game.id == gameId);
	if (!game) {
		return res.status(404).json({ message: "Game not found" });
	}

	const index = game.players.findIndex(p => p.id == req.user.user_id);
	if (index == -1) {
		return res.status(404).json({ message: "Player not found" });
	}

	game.players.splice(index, 1);
	res.json({ message: "Left game successfully" });
	if (game.players.length === 0) {
		deleteGame(gameId);
	}

	io.emit("openGamesUpdated", openGames);
});

app.post("/createGame", verifyToken, async (req, res) => {
	const { rarity, cleanliness, playerLimit, language } = req.body;
	const user = await User.findOne({ id: req.user.user_id });
	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}

	console.log(req.body);
	createGame({
		host: req.user.name,
		host_id: req.user.user_id,
		host_picture: req.user.photo,
		host_elo: user.elo,
		language,
		rarity,
		cleanliness,
		capacity: playerLimit,
	});

	res.json({ message: "Game created successfully" });
});

app.get("/kickPlayer/:gameId/:playerId", verifyToken, async (req, res) => {
	const gameId = req.params.gameId;
	const playerId = req.params.playerId;
	kickPlayer(gameId, req.user.user_id, playerId);
	io.emit("openGamesUpdated", openGames);
	res.json({ message: "Player kicked successfully" });
});

app.get("/startGame/:gameId", verifyToken, (req, res) => {
	startGame(req.params.gameId, req.user.user_id);
	res.json({ message: "Game started successfully" });
});

app.post("/updateStatus/:gameId", verifyToken, (req, res) => {
	updateStatus(req.params.gameId, req.user.user_id, req.body.words);
	res.json({ message: "Status updated successfully" });
});

app.post("/submit/:gameId", verifyToken, (req, res) => {
	submitDescription(
		req.params.gameId,
		req.user.user_id,
		req.body.description,
	);
	res.json({ message: "Description submitted successfully" });
});

app.get("/getElo", verifyToken, async (req, res) => {
	const user = await User.findOne({ id: req.user.user_id });
	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}
	res.json({ elo: user.elo });
});

app.get("/top", async (req, res) => {
	const users = await User.find().sort({ elo: -1 }).limit(10);
	res.json(users);
});

app.get("/recentGames", async (req, res) => {
	const games = await Game.find().sort({ date: -1 }).limit(10);
	res.json(games);
});

setAI(
	new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	}),
);

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
		setIO(io);
	});
