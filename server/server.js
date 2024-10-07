require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require('./db');
const morgan = require("morgan");
const app = express();
app.use(cors());


// app.use((req, res, next) => {
//     res.status(404).json({
//         status: "fail", 

//     });
// });

app.use(express.json());

const port = 3003 || process.env.PORT ;


// get all movies
app.get("/api/v1/movies", async (req, res) => {

    try{

        const results = await db.query("select * from movie");
      
        // console.log(results);
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                movies: results.rows,
            },
            
        });

    } catch(err) {

        console.log(err);

    }
  
});

//get individual movie
app.get("/api/v1/movies/:id", async (req, res) => {


    console.log(req.params.id);
    try{

        const results = await db.query("select * from movie where id = $1" , [req.params.id]);


        res.status(200).json({
            status: "success",
            data: {
                movie: results.rows[0],
            } });


    } catch (err) {
        console.log(err);

    }
    
 

    
}); 

// create a movie
app.post("/api/v1/movies", async (req, res) => {
    console.log(req.body);


    try{

        const results = await db.query("INSERT INTO movie (name, genre, rating) values($1, $2, $3) returning *",
         [req.body.name, req.body.genre, req.body.rating]);
         console.log(results);
        

         res.status(201).json({
            status: "success",
            data: {
                movie: results.rows[0],
            } });
    } catch (err) {
        console.log(err);


    }
  

});

// update movie

app.put("/api/v1/movies/:id", async (req, res) => {

    try {
        const results = await db.query("UPDATE movie SET name = $1, genre = $2, rating = $3 where id = $4 returning *",
         [req.body.name, req.body.genre, req.body.rating, req.params.id]);
         console.log(results);

         res.status(200).json({
            status: "success",
            data: {
                movie: results.rows[0],
            } });

    } catch (err) {
        console.log(err);
    }
    console.log(req.params.id);
    console.log(req.body);

    


});

app.delete("/api/v1/movies/:id", async (req, res) => {

    try {
        const results = await db.query("DELETE FROM movie where id = $1", [req.params.id]);

        res.status(204).json({

            status: "success",
        })
        

    } catch (err) {
        console.log(err);
    }

   
})



app.listen(port, () => {
    console.log(`server is up and listening on port ${port}`);
});