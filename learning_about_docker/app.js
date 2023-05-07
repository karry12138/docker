// code in server
const express = require('express')
const app = express();
const PORT = 3000; //the port of this app

app.get("/",(req,res) => {
    // res.send("<p>泥嚎！我司老年人 </p>")
    res.send("<p>你好！我是老年人 </p>")
});

app.listen(PORT,() => console.log("走3000端口")) //响应文字
//若返回，则服务器正常响应