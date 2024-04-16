//Set all required terms with the help of respected variables
const fs = require("fs");
const http = require("http");
const url = require("url");

//sync file using readFileSync
const data = fs.readFileSync("./data.json", "utf-8");

//make object of the data :
const recipe = JSON.parse(data).recipes;


// Make a html template :
const inputElement = `
<div>
<form action ='/recipe'>
    <input type="text" name = "recipeName"></input>
    <button type="submit">Search</button>
</form>
</div>
<hr>
`
const HtmlTemplate = `
    <!DOCTYPE HTML>
    <HTML>
        <HEAD>
        <style>
                * {
                    font-family : poppins;
                }
                body {
                  background-color: beige;
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                }
                <style>
                    * {
                        font-family : poppins;
                        box-sizing: border-box;
                    }
            
                    .recipe-card {
                    width: 550px;
                    margin: 20px auto;
                    border: 5px solid red;
                    border-radius: 8px;
                    padding: 16px;
                    object-fit: fit-content;
                    
                }
            img {
                heigth: 200px;
                width: 200px;
                
            }
            
            
            

            </style> 
            <BODY>
            RECIPE_CARDS</BODY>
        </HEAD>
    </HTML>
    `;



//CREATE CARD TEMPLATE FOR RECIPES
const cardTemplate = `   

<div class = "recipe-card">
    <h1>_Name_</h1>
    <img src="$dish$"></img>
    <h3>_recipe_</h3>
    <p>_ingridents_</p>
    <a href="$readmore" style = "background-color: black; color: white">Read More</a>
    <hr>
    </div>
`; 
//CREATE A MAP FUNCTION FOR ALL CARDS
const allCards = recipe.map((elem) => {
  let newRecipe = cardTemplate;
  newRecipe = newRecipe
    .replace("_Name_", elem.name)
    .replace("$dish$", elem.image)
    .replace("_recipe_", elem.ingredients)
    .replace("_ingridents_", elem.instructions)
    .replace("$readmore", `/recipe?id=${elem.id}`)
    ;
  return newRecipe;
});

//JOIN ALL CARDS USING STRING CONSTANT
const allCardsString = allCards.join(" ");

//CREATE A VARIABLE CONSTANT TO REPLACE HTMLTEMPLATE
const page = HtmlTemplate.replace("RECIPE_CARDS", allCardsString);


//make server
const server = http.createServer((req, res) => {
  console.log("recived");

  console.log(req.url);
  const path = url.parse(req.url, true);
  const pathname = path.pathname;
  const q = path.query;
  if(pathname === '/home') {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    res.end(inputElement + page);
  }
  else if (pathname === '/recipe') {
    const id = q.id;
    const rName = q.recipeName;
    if(id) {
      const item = recipe[id-1];
    
    res.end(`
    <div style="width: 600px;
    margin: 20px auto;
    border: 5px solid red;
    border-radius: 8px;
    padding: 16px;
    object-fit: fit-content;">
    <h1>${item.name}</h1>
    <img src="${item.image}" height="300px", width="300px"></img>
    <h3>${item.instructions}</h3>
    <p>${item.ingredients}</p>
    <hr>
    <a href="http://localhost:1300/home">Back</a>
    </div>
      `)
    }
    else if(rName) {
      const Searchbyresult = recipe.filter((elem) => {
        if(elem.name.includes(rName)){
          return true;
        }
        else {
          return false;
        }
      })
      res.end(JSON.stringify(Searchbyresult));
    }
  }
  else {
    res.end("404.. Not found");
  }
});

//listen server
server.listen(1300, () => {
  console.log(".......Server Start.......");
});
