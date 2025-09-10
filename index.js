require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/demo",(req,res)=>{
    res.send("heyy pooja")
})

app.get('/login',(req,res)=>{
    res.send("please login..!")
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})