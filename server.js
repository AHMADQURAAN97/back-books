'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT;
const server = express();
server.use(cors());
server.use(express.json());

mongoose.connect(`${process.env.MONGO_LINK}`, { useNewUrlParser: true, useUnifiedTopology: true });

//===========================ROUTES
server.get('/test',testHandler);
server.get('/books',getBooksHandler);
server.post('/addbook',addbookHandler);
server.delete('/deletebook/:id',deleteBookHandler);
server.put('/updatebook/:id',updatebookHandler);

//Schema 
const boookSchema = new mongoose.Schema({
    title:String,
    description:String,
    email:String,
})

//Model 
const boookModel = mongoose.model('boooks',boookSchema);

function seedDataCollection(){

 const Book1 = new boookModel ({
   title:'Ahmad',
   description:'Ahmaaaad',
   email:'ahmadqouraan@gmail.com'

 })

 const Book2 = new boookModel ({
    title:'Ahmad',
    description:'Ahmaaaad',
    email:'ahmadqouraan@gmail.com'
 
  })
  const Book3 = new boookModel ({
    title:'Ahmad',
    description:'Ahmaaaad',
    email:'ahmadqouraan@gmail.com'
 
  })

  Book1.save();
  Book2.save();
  Book3.save();
}
// seedDataCollection();

//=========================Get Function=============================

//http://localhost:3001/books?email=ahmadqouraan@gmail.com
function getBooksHandler(request,response) {
let searchQuery = request.query.email;

boookModel.find({email:searchQuery},function (err,ownerData){

 if (err){
     console.log('Error in geting data')
 } else { 
    response.send(ownerData);
}
})
}


//=================Add Function======================================

async function addbookHandler (request,response){ 

    let {email,title,description} = request.body;

     await boookModel.create({email,title,description});

     boookModel.find({email},function (err,ownerData){ 

        if (err){

        console.log('Error in getting data')

        } else {response.send(ownerData);

        }
     } )
}


//=================Delete Function======================================


async function deleteBookHandler(request,response){ 

let email = request.query.email;
let bookID = request.params.id;

boookModel.remove({_id:bookID},(err,bookData) => {

if(err){
    console.log('error in deleting data');
}else {

boookModel.find({email:email},(err,ownerData)=> {
if (err){
    console.log('error in getting data')
}else {
response.send(ownerData)
}
});
}
});
}





//=================Update Function======================================


 function updatebookHandler (request, response){

    let {email,description,title} = request.body;
    let bookID = request.params.id;

    boookModel.findOne({_id:bookID},(err,bookData)=> {
    
    bookData.title=title;
    bookData.description=description;
    bookData.email=email;

    bookData.save()
      .then(()=>{
        boookModel.find({email:email},function(err,ownerData) {

          if (err){
              console.log('error in update data')
          }else {
              response.send(ownerData)
        }
    })
    })

        .catch(error=>{

         console.log('error in saving')
        })
    })
    }
 


function testHandler(req,res){ 
res.send('all good');
}


server.listen(PORT,()=>{
console.log(`Listening on port ${PORT}`)
})