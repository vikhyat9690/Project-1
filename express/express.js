const express = require("express");
// const fs = require("fs");
const fsPromises = require("fs/promises");
const app = express();

app.use(express.json());

app.get('/api/recipe',async(req, res) => {
    const data = await fsPromises.readFile('./data-cpy.json', 'utf-8');
    const arr = JSON.parse(data).recipes;
    res.json({
        status: 'success',
        results: arr.length,
        data: {
            recipes: arr,
        }
    });
});


app.post('/api/recipe', async(req, res) => {
    const data = req.body;
    // data.id = 121;
    // console.log(data);

    const db = await fsPromises.readFile("./data-cpy.json", "utf-8");
    const arr = JSON.parse(db);
    const len = arr.length;
    if(len === 0) {
        const newRecipe = data;
        newRecipe.id = 1;
        // console.log(db);
        arr.push(newRecipe);
        console.log(arr);
        fsPromises.writeFile("./data-cpy.json", JSON.stringify(arr));
    }
   
    res.send('Work in progress');
});

app.listen(1400);