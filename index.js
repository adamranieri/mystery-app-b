const express = require("express");
const { v4: uuidv4 } = require('uuid');
const fsPromises = require('fs').promises;

const app = express();
app.use(express.json()) // will automatically parse all requests from JSON and convert all responses to JSON


const notes = [];

app.get("/",(req,res)=>{
    res.send("Hello");
});

app.get("/notes", (req,res)=>{
    res.send(notes);
});

app.get("/notes/:index",(req,res)=>{
    const index = Number(req.params.index);
    const content = notes[index];
    res.send({index,content});
});

app.put("/notes/:index", (req,res)=>{
    const index = Number(req.params.index);
    const content = req.body.content;
    notes[index] = content;
    res.send({index,content});
});

app.delete("/notes/:index", (req,res)=>{
    const index = Number(req.params.index);
    notes.splice(index,1)
    res.status(204).send("");
});

app.post("/notes", (req,res)=>{
    const note = req.body;
    notes.push(note.content);
    const index = notes.length -1;
    res.send({index, content: note.content});
});

app.post("/notes/:index", (req,res)=>{
    const index = Number(req.params.index);
    const content = req.body.content;
    notes.splice(index,0,content);
    res.send({index,content});
})

app.post("/documents", async (req,res)=>{
    const content = req.body.content;
    const docId = uuidv4();

    await fsPromises.writeFile(`${docId}.txt`,content);
    res.send({docId})
})

app.get("/documents/:id", async (req,res)=>{
    const id = req.params.id;
    
    const bytes = await fsPromises.readFile(`${id}.txt`);
    const content = bytes.toString(); // turn file file bytes into characters
    res.send({docId:id, content})
});

app.get("/math/:num1/:num2/:amount", (req,res)=>{
    // const num1 = req.params.num1;
    // const num2 = req.params.num2;
    // const amount = req.params.amount;
    // alternate object destructuring syntax
    
    const {num1,num2,amount} = req.params

    for(let i =0; i<amount; i++){
        num1*num2
    }
    res.send("Done")

});

let memo = {}; // will save the results from a calculation for futre reference
app.get("/factorial/:num", (req,res)=>{
    const num = Number(req.params.num);

    let previousComputation = memo[num];
    if(previousComputation){
        res.send({previousComputation})
    }else{
        let product =1;
        for(let i = 1; i<num+1; i++){
            product*=i;
        }
        memo[num] = product;
        res.send({product})
    }


})

app.get("/coordinates/:amount", (req,res)=>{
    const amount = Number(req.params.amount);

    const coordinates = [];

    for(let i =0; i <amount; i++){

        const lattitude = Math.random() * 180 -90;
        const longitude = Math.random() * 360 - 180;
        const nsHemisphere = lattitude>0? "North" : "South";
        const ewHemisphere = longitude>0? "East" : "West";
        const coordiante = {lattitude,longitude,nsHemisphere,ewHemisphere};
        coordinates.push(coordiante);
        
    }
    res.send(coordinates);
})


app.listen(3000,()=> console.log("App started!"))