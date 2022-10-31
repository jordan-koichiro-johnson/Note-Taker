//importing express packages
const { json } = require("express");
const express = require("express");
const fs = require("fs");
// instantianting a new express server
const app = express();
// selecting network port
const PORT = process.env.PORT || 3000
// importing path package from standard library
const path =require("path");
const { v4: uuidv4 } = require('uuid');


//middle ware to serve static assets
app.use(express.static("public"))

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//data array
const db = require("./db/db.json")
// GET reuquest to /, serves html page
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/index.html"))
})


app.get("/notes",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/notes.html"))
})


app.post("/api/notes", (req,res)=>{
    console.log(req.body)
    const { title, text } = req.body;
    const newNote = {
        title,
        text,
        id: uuidv4()
    }
    

    let db = fs.readFileSync('./db/db.json')
    

    let parseDb = JSON.parse(db)

    console.log(parseDb)

    parseDb.push(newNote)
    const noteString = JSON.stringify(parseDb)

    fs.writeFileSync('./db/db.json', noteString, (err) => 
    err
    ? console.log(err)
    : console.log(
        `note has been written to JSON file`
      )
      )
    res.json(parseDb)
})



app.get('/api/notes',(req,res)=>{
    const notes = fs.readFileSync('./db/db.json')
    
    res.json(JSON.parse(notes))
})



// catch all for all unhandled routes 
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/index.html"))
})

//tells my server where to looks for requests
app.listen(PORT,()=>{
    console.log("listening!")
})