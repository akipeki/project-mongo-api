# Project Mongo API

Replace this readme with your own information about your project.

Start by briefly describing the assignment in a sentence or two. Keep it short and to the point.

## The problem

Describe how you approached to problem, and what tools and techniques you used to solve it. How did you plan? What technologies did you use? If you had more time, what would be next?

## View it live

GET /: Returns a greeting message.

GET /players: Returns a list of players. Can accept playerName and PTS as query parameters for filtering.

GET /players/team/:team: Returns a list of players in the specified team.

GET /players/position/:position: Returns a list of players in the specified position.

GET /players/topScorers/:num: Returns the top scoring players, limited to the specified number.

GET /players/age/under/:age: Returns players younger than the specified age.

GET /players/age/over/:age: Returns players older than the specified age.

GET /players/games/:games: Returns players who have played at least the specified number of games.

GET /players/minutes/:minutes: Returns players who have at least the specified average minutes per game.

GET /players/threePointTop/:num: Returns the top three-point shooters, limited to the specified number.

GET /players/bestDefensive/:num: Returns the best defensive players, limited to the specified number.

GET /players/freeThrow/:percentage: Returns players with a free throw percentage greater than or equal to 
the specified value.

GET /players/points/:points: Returns players who score at least the specified number of points per game.

GET /players/assistsTop/:num: Returns players with the most assists, limited to the specified number.

GET /players/reboundsTop/:num: Returns players with the most rebounds, limited to the specified number.

GET /players/age/:age/points/:points: Returns players of the specified age who score at least the specified number of points per game.

GET /players/gamesStartedTop/:num: Returns players who have started the most games, limited to the specified number.

GET /players/twoPointTop/:num: Returns the top two-point shooters, limited to the specified number.
GET /players/id/:id: Returns a single player by their ID.

Note: This assumes the server's base URL is http://localhost:${port}, where ${port} is the port your server is running on (default is 8080). So, for example, the URL for getting players by team would be http://localhost:8080/players/team/:team
