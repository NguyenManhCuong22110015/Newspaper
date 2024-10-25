import express from 'express';


const app = express()


app.get("/", (req, res) => {
    res.send("Hello word")
})

app.listen(3000, ()  => {
    console.log("App is running")
})