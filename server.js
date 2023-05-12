// Importing necessary libraries
import express from "express"; // Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
import cors from "cors"; // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
import mongoose from "mongoose"; // Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.

// Importing JSON data from a local file
import nbaData from "./data/nba.json";

// MongoDB connection URL - can be a local MongoDB or cloud-based MongoDB Atlas
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-nba'

// Connecting to MongoDB using Mongoose
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })

// Telling Mongoose to use ES6 Promises
mongoose.Promise = Promise

// Port number for the server to run on, default is 8080
const port = process.env.PORT || 8080;

// Create an Express application
const app = express();

// Use cors middleware for enabling cross-origin resource sharing
app.use(cors());

// Use express.json middleware to parse JSON request bodies
app.use(express.json());

// Middleware to check if the database connection is ready before processing the request
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: 'Service unavailable' });
  }
});

// Import Schema from mongoose
const { Schema } = mongoose;

// Define the schema for the NBA players
// Nba player stats season 2020-2021, average per game
const statsSchema = new Schema({
  Player: String,
  Pos: String,
  Age: Number,
  Team: String,
  G: Number,
  GS: Number,
  MP: Number,
  FG: Number,
  FGA: Number,
  FGProsent: Number,
  ThreePoints: Number,
  ThreePointsAverage: Number,
  ThreePointProsent: Number,
  TwoPoints: Number,
  TwoPointsAverage: Number,
  TwoPointsProsent: Number,
  eFGProsent: Number,
  FT: Number,
  FTA: Number,
  FTprosent: Number,
  ORB: Number,
  DRB: Number,
  TRB: Number,
  AST: Number,
  STL: Number,
  BLK: Number,
  TOV: Number,
  PF: Number,
  PTS: Number
})



// Create the Mongoose model for the NBA players
const Player = mongoose.model("Player", statsSchema);

// If the RESET_DB environment variable is set, reset the database
if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    try {
      await Player.deleteMany();
      nbaData.forEach((singlePlayer) => {
        const newPlayer = new Player(singlePlayer);
        newPlayer.save();
      });
    } catch (err) {
      console.error("Failed to reset database", err);
    }
  }
  resetDatabase();
}


// Define a route to get the root of the application
app.get("/", (req, res) => {
  res.send("I LOVE THIS GAME! ❤️ 🏀");
});

// Define a route to get all players
app.get("/players", async (req, res) => {
  const { playerName, PTS } = req.query;
  const response = {
    success: true,
    body: {}
  }
  let playerRegex;
  try {
    playerRegex = new RegExp(playerName, 'i');
  } catch (e) {
    return res.status(400).json({ success: false, error: 'Invalid playerName parameter' });
  }
  const ptsQuery = { $gt: PTS ? PTS : 0 }

  try {
    const searchResultFromDB = await Player.find({ Player: playerRegex, PTS: ptsQuery })
    if (searchResultFromDB) {
      response.body = searchResultFromDB
      res.status(200).json(response)
    } else {
      response.success = false;
      res.status(500).json({ success: false, error: 'No players found' });

    }
  } catch (e) {
    response.success = false;
    res.status(500).json({ success: false, error: e.message });

  }
});

// Search by Team
// /players/team/:team

app.get("/players/team/:team", async (req, res) => {
  const teamRegex = new RegExp(req.params.team, 'i'); // 'i' makes it case insensitive
  const teamPlayers = await Player.find({ Team: teamRegex });
  res.json(teamPlayers);
});


// Search by Position
// /players/position/:position
app.get("/players/position/:position", async (req, res) => {
  const positionPlayers = await Player.find({ Pos: new RegExp(req.params.position, 'i') });
  res.json(positionPlayers);
});

// Top Scorers
// /players/topScorers/:num
app.get("/players/topScorers/:num", async (req, res) => {
  const topScorers = await Player.find().sort({ PTS: -1 }).limit(Number(req.params.num));
  res.json(topScorers);
});

// Age Filtering
// /players/age/under/:age
app.get("/players/age/under/:age", async (req, res) => {
  const youngPlayers = await Player.find({ Age: { $lt: Number(req.params.age) } });
  res.json(youngPlayers);
});

// Age Filtering
// /players/age/over/:age
app.get("/players/age/over/:age", async (req, res) => {
  const olderPlayers = await Player.find({ Age: { $gt: Number(req.params.age) } });
  res.json(olderPlayers);
});

// Search Players by Games Played
// /players/games/:games
app.get("/players/games/:games", async (req, res) => {
  const players = await Player.find({ G: { $gte: Number(req.params.games) } });
  res.json(players);
});

// Search Players by Minutes Per Game
// /players/minutes/:minutes
app.get("/players/minutes/:minutes", async (req, res) => {
  const players = await Player.find({ MP: { $gte: Number(req.params.minutes) } });
  res.json(players);
});

// Best Three-Point Shooters
// /players/threePointTop/:num
app.get("/players/threePointTop/:num", async (req, res) => {
  const topThreePointShooters = await Player.find().sort({ ThreePointsAverage: -1 }).limit(Number(req.params.num));
  res.json(topThreePointShooters);
});

// Best Defensive Players
// /players/bestDefensive/:num
app.get("/players/bestDefensive/:num", async (req, res) => {
  const bestDefensivePlayers = await Player.find().sort({ BLK: -1, STL: -1 }).limit(Number(req.params.num));
  res.json(bestDefensivePlayers);
});

// Search Players by Free Throw Percentage
// /players/freeThrow/:percentage
app.get("/players/freeThrow/:percentage", async (req, res) => {
  const players = await Player.find({ FTprosent: { $gte: Number(req.params.percentage) } });
  res.json(players);
});

// Search Players by Points Per Game
// /players/points/:points
app.get("/players/points/:points", async (req, res) => {
  const players = await Player.find({ PTS: { $gte: Number(req.params.points) } });
  res.json(players);
});

// Most Assists
// /players/assistsTop/:num
app.get("/players/assistsTop/:num", async (req, res) => {
  const topAssistPlayers = await Player.find().sort({ AST: -1 }).limit(Number(req.params.num));
  res.json(topAssistPlayers);
});

// Most Rebounds
// /players/reboundsTop/:num
app.get("/players/reboundsTop/:num", async (req, res) => {
  const topReboundPlayers = await Player.find().sort({ TRB: -1 }).limit(Number(req.params.num));
  res.json(topReboundPlayers);
});

// Search Players by Age and Points:
// /players/age/:age/points/:points
app.get("/players/age/:age/points/:points", async (req, res) => {
  const players = await Player.find({ Age: Number(req.params.age), PTS: { $gte: Number(req.params.points) } });
  res.json(players);
});

// Players with Most Games Started
// /players/gamesStartedTop/:num
app.get("/players/gamesStartedTop/:num", async (req, res) => {
  const topGamesStartedPlayers = await Player.find().sort({ GS: -1 }).limit(Number(req.params.num));
  res.json(topGamesStartedPlayers);
});

// Best Two-Point Shooters
// /players/twoPointTop/:num
app.get("/players/twoPointTop/:num", async (req, res) => {
  const topTwoPointShooters = await Player.find().sort({ TwoPointsAverage: -1 }).limit(Number(req.params.num));
  res.json(topTwoPointShooters);
});

app.get("/players/id/:id", async (req, res) => {
  try {
    const singlePlayer = await Player.findOne({ _id: req.params.id });
    if (singlePlayer) {
      res.status(200).json({
        success: true,
        body: singlePlayer
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Player not found"
        }
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      body: {
        message: error
      }
    })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});