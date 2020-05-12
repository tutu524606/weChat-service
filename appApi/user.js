/*
 * @Descripttion: 
 * @version: 
 * @Author: Dai Junchao
 * @Date: 2020-04-28 19:37:50
 * @LastEditors: Dai Junchao
 * @LastEditTime: 2020-04-29 20:59:04
 */
const router = require('koa-router')();
const mongoose = require('mongoose');

// 用户注册
router.post('/register', async(ctx) => {
    const User = mongoose.model('user');
    let newUser = new User(ctx.request.body);
    await newUser.save().then(() => {
        ctx.body = { code: 200, message: '注册成功' }
    }).catch(error => {
        ctx.body = { code: 500, message: error }
    })
})

// 用户登录
router.post('/login', async(ctx, next) => {
    let loginUser = ctx.request.body;
    let username = loginUser.username;
    let password = loginUser.password;
    const User = mongoose.model('user');
    await User.findOne({ username: username }).exec().then(async(result) => {
        if (result) {
            let newUser = new User(); // 实例方法，必须new出实例对象才能使用
            await newUser.comparePassword(password, result.password).then((isMatch) => {
                ctx.body = { code: 200, message: isMatch }
            }).catch(err => {
                console.log(err);
                ctx.body = { code: 500, message: err }
            })
        } else {
            ctx.body = { code: 201, message: '该用户不存在' }
        }
    }).catch(err => {
        ctx.body = { code: 500, message: err }
    })
});
module.exports = router;