const express = require('express');
const app = express();
const dogRouter = require('./routes/dogs')

//Using express.json()
app.use(express.json())
//Requiring async errors
require('express-async-errors')

//Get static files
app.use("/static",express.static(`assets`))

//Phase 2: Logger
app.use((req,res,next) => {
  console.log(`${req.method} ${req.path}`);
  res.on('finish', ()=>{
    console.log(`Status code: ${res.statusCode}`)
  })
  next();
})

//Dog Router
app.use("/dogs", dogRouter)

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

//Test error if wrong page
app.use((req,res,next) => {
  const error = new Error ("Sorry, The requested resource couldn't be found.")
  error.statusCode = 404;
  next(error)
})

app.use((error, req, res, next) => {
  console.log(error)
  const statCode = error.statusCode || 500
  res.status(statCode)
  res.json({
    message: error.message,
    statusCode: statCode
  })
})







const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
