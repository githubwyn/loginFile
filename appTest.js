/**
 * Created by thinkpad on 2016-10-29.
 */
var session = require('express-session');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParse = require('body-parser');
var app = express();


//实现权限中间件
app.set('view engine','html');
app.set('views',path.resolve('views'));
app.engine('html',require('ejs').__express);

app.use(session({
    secret:'zf',
    resave: true,  //每次客户端请求的时候重新保存session
    saveUninitialized: true  //保存未初始化的session
}));

app.use(cookieParser());
app.use(bodyParse.urlencoded({extended:true}));

function checkLogin(req,res,next){
    if(req.cookies&& req.cookies.username){
        next();
    }else{
        res.redirect('/login');
    }
}

//登录页
app.get('/login',function(req,res){
    res.render('login')
});
app.post('/login',function(req,res){
    var user = req.body;//得到请求体
    if(user.username == user.password){//如果在表单中输入的用户名和密码相同，则登录成功
        //把用户名写入cookie

        req.session.username = user.username;
        req.session.password = user.password;
        //重定向到user页面
        res.redirect('/user');
    }else{
        res.redirect('back');
    }
});
//用户主页
app.get('/user',checkLogin,function(req,res){
    res.render('user',{username:req.session.username,password:req.session.password})
});

app.listen(8083);