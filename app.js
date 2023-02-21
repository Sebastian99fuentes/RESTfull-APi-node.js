const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO

// Conexion BDmongoose
const MONGO_URL =
//   "mongodb+srv://ssfuentes99:11perritos@cluster0.lzaad5z.mongodb.net/todoList";

"mongodb://127.0.0.1:27017/wikiDB";

  mongoose.set("strictQuery", true);
  mongoose.connect(MONGO_URL)
  .then(()=>{
    console.log('conectado a la bd')
  }).catch(err=>{
    console.error(err)
  })
// Conexion BDmongoose

// Modelo
const todolSSchema= new mongoose.Schema({
    title:String,
    content:String
});

const Article = mongoose.model("articles",todolSSchema);
// const item1 = new Item({
//     activity: "Primera"
// });


// todo a una misma ruta mas easy
app.route("/articles")

.get(function(req,res){
    Article.find(function(err,foundArticles){
        if(!err){
            res.send(foundArticles)
        }else{
            res.send(err)
        } 
    });
})

.post(function(req, res){
    const newArticle = Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err){
      if (!err){
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send ("succesfully deleted all records")
        }else{
            res.send (err)
        }
    });
});


app.route("/articles/:articleTitle")
.get(function(req,res){
Article.findOne({title:req.params.articleTitle},function(err,findarticle){
    if(!err){
        res.send(findarticle)
    }else{
        res.send(err)
    }
})
})
.put(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        { title: req.body.title,content: req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("succesfully update")
            }
        }   
    );
})

.patch(function(req,res){
Article.update(
    {title: req.body.title},
    {$set:req.body},
    function(err){
        if(!err){
            res.send("succesfully update")
        }else{
            res.send(err)
        }
    }
)
})
.delete(function(req,res){
    Article.deleteOne({title: req.body.title},function(err){
        if(!err){
            res.send("succesfully record deleted")
        }else{
            res.send(err)
        }
    })
});

app.listen(3001, function() {
  console.log("Server started on port 3001");
}); 


