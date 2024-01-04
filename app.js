const express=require('express')
const bodyParser=require('body-parser')
const request=require('request')
const https=require('https')
const config=require('./config')
const app=express()
const port=3000

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.get('/',function(req,res){
    res.sendFile(__dirname+"/signup.html")
})

app.post('/',(req,res)=>{
    var first=req.body.fname;
    var last=req.body.lname;
    var email=req.body.email;
    console.log(first,last,email);
    const data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: first,
                    LNAME: last
                }
            }
        ]
    }
    const jsonData=JSON.stringify(data);
    const url=`https://${datacenter}.api.mailchimp.com/3.0/lists/${config.mailchimpListId}`
    const options={
        method: "POST",
        auth: `sakshi:${config.mailchimpApiKey}`,
    }
    const request=https.request(url,options,function(response){
        console.log(response.statusCode)
        if(response.statusCode==200)
        res.sendFile(__dirname+"/success.html")
        else
        res.sendFile(__dirname+"/failure.html")
         response.on("data",(data)=>{
            console.log(JSON.parse(data));
         })

    })
    request.write(jsonData)
    request.end()
})
app.post("/failed",(req,res)=>{
    res.redirect("/");
})
app.post("/success",(req,res)=>{
    res.redirect('/')
})
app.listen(port ,(req,res)=>{
    console.log("successfully running at 3000 ")
})

