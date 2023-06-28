require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs');

app.use(express.static('public'));

const dbPass=process.env.DB_Pass;
const DB="mongodb+srv://itsadityasharma7124:"+dbPass+"@cluster0.rgyn6el.mongodb.net/wikiAPI?retryWrites=true&w=majority"

mongoose.set('strictQuery',false);
mongoose.connect(DB,{useNewUrlParser:true}).then(console.log("connected"));

// mongoose.connect(DB);

const wikiSchema=new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    content:{
        type:String,
        require:true
    }
});

const Article=mongoose.model("Article",wikiSchema);


///////////////////////////////////////request targeting all articles////////////////////////////////////////////
app.route("/articles")
    .get(function(req,res){
        Article.find({})
        .then((foundArticle)=>{
            if(foundArticle){
                foundArticle.forEach(function(Article){
                    console.log(Article)
                });
                res.send(foundArticle);
            }
            else{
                console.log("nothing found");
            }
        })
        .catch((err)=>{
            console.log(err);
        })
   
    })
    .post((req,res)=>{
        console.log(req.body.title);
        console.log(req.body.content);
        const article=new Article({
            title:req.body.title,
            content:req.body.content
        });
        article.save().then(res.send("saved successfully"));
    })
    .delete((req,res)=>{
        Article.deleteMany()
        .then((deleted)=>{
            res.send("successfully deleted all articles");
        })
        .catch((err)=>{
            res.send(err);
        });
    });

    //////////////////////////////////request targeting specific article//////////////////////////////////////
app.route("/articles/:articleTitle")
    .get((req,res)=>{
        const articleTitle=req.params.articleTitle;
        Article.findOne({title:articleTitle})
        .then((foundArticle)=>{
            if(foundArticle){
                res.send(foundArticle);
            }
            else{
                res.send("nothing found");
            }
        })
        .catch((err)=>{
            console.log(err);
        })

    })
    .put((req,res)=>{
        Article.findOneAndUpdate(
            {title:req.params.articleTitle},
            {title:req.body.title,content:req.body.content},
            {overwrite:true}
        )
        .then((foundArticle)=>{
            if(foundArticle){
                res.send(foundArticle + " is updated");
            }
            else{
                res.send("can't find the article");
            }
        })
        .catch((err)=>{
            res.send(err);
        })
    }) 
    .patch((req,res)=>{
        Article.findOneAndUpdate(
            {title:req.params.articleTitle},
            {$set:req.body}
        )
        .then((foundArticle)=>{
            if(foundArticle){
                res.send(foundArticle + " is updated");
            }
            else{
                res.send("can't found");
            }
        })
        .catch((err)=>{
            res.send(err);
        })
    })
    .delete((req,res)=>{
        Article.deleteOne({title:req.params.articleTitle})
        .then((foundArticle)=>{
            if(foundArticle){
                res.send("successfully deleted "+foundArticle);
            }
            else{
                res.send("can't find");
            }
        })
        .catch((err)=>{
            res.send(err);
        })
    });

app.listen("3000",function(req,res){
    console.log("server started at 3000");
});