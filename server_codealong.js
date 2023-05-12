import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()
// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    if (mongoose.connection.readyState === 1) {
        next();
    } else {
        res.status(503).json({ error: 'Service unavailable' });
    }
});

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-books'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Author = mongoose.model('Author', {
    name: String
})

const Book = mongoose.model('Book', {
    title: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }
})

if (process.env.RESET_DATABASE) {
    console.log('reseting database')

    const SeedDatabase = async () => {
        const tolkien = new Author({ name: 'J.R.R Tolkien' })
        await tolkien.save()

        const rowling = new Author({ name: 'J.K Rowling' });
        await rowling.save()

        await new Book({ title: "Harry Potter and Philosopher's Stone", author: rowling }).save()
        await new Book({ title: "Harry Potter and Chamber of Secrets", author: rowling }).save()
        await new Book({ title: "Harry Potter and Prisoner of Azkaban", author: rowling }).save()
        await new Book({ title: "Harry Potter and x1", author: rowling }).save()
        await new Book({ title: "Harry Potter and x2", author: rowling }).save()
        await new Book({ title: "Harry Potter and x3", author: rowling }).save()
        await new Book({ title: "Harry Potter and x4", author: rowling }).save()
        await new Book({ title: "Harry Potter and x5", author: rowling }).save()
        await new Book({ title: "The Lord of the Rings", author: tolkien }).save()
        await new Book({ title: "The Hobbit", author: tolkien }).save()
        await new Book({ title: "Silmarilion", author: tolkien }).save()
    }
    SeedDatabase();
}


/*const Animal = mongoose.model('Animal', {
  name: String,
  age: Number,
  isFurry: Boolean
})*/

/*Animal.deleteMany().then(() => {
  new Animal({ name: 'Alfons', age: 2, isFurry: true }).save()
  new Animal({ name: 'Lucy', age: 5, isFurry: true }).save()
  new Animal({ name: 'Goldie - the goldfish', age: 1, isFurry: false }).save()
})*/

// Start defining your routes here
app.get("/", (req, res) => {
    Author.find().then(authors => {
        res.json(authors)
    })
});

app.get('/authors', async (req, res) => {
    const authors = await Author.find()
    res.json(authors)
})

app.get('/authors/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        if (author) {
            res.json(author)
        } else {
            res.status(404).json({ error: 'Author not found' })
        }
    } catch (err) {
        res.status(400).json({ error: 'Invalid author id' })
    }
});


// for example Rowlings books: http://localhost:8080/authors/645a13482c6650352d2a729d/books
app.get('/authors/:id/books', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        if (author) {
            const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) })
            res.json(books)
        } else {
            res.status(404).json({ error: 'Author not found' })
        }
    } catch (err) {
        res.status(400).json({ error: 'Invalid author id' })
    }
})


app.get('/books', async (req, res) => {
    const books = await Book.find().populate('author')
    res.json(books)
})


/* app.get('animal/:name', async (req, res) => {
  try {
    const animal = await Animal.findOne(req.params.name)
    if (animal) {
      res.json(animal)
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid user id' })
  }
})*/

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});