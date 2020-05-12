/*
 * @Descripttion: 
 * @version: 
 * @Author: Dai Junchao
 * @Date: 2020-04-28 10:31:37
 * @LastEditors: Dai Junchao
 * @LastEditTime: 2020-04-29 20:47:34
 */
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const path = require('path');
const resolve = path.resolve;
const glob = require('glob');
const { connect, initSchemas } = require('./database/init');
const func = require('./utils/func');
app.use(bodyParser());
app.use(static(path.join(__dirname, 'public')));

// 装载子路由
let router = new Router();
glob.sync(resolve(__dirname, './appApi/', '**/*.js')).forEach((childRouter) => {
    router.use('/app/' + childRouter.match(/\/([a-z]+)\.js/)[1], require(childRouter).routes())
})

;
(async() => {
    await connect();
    initSchemas();
})()

// 加载中间件路由
app.use(router.routes()); // 启动路由
app.use(router.allowedMethods());

app.listen(3000, () => {
    console.log('starting at port 3000');
})