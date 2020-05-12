/*
 * @Descripttion: 数据库初始化文件
 * @version: 1.0.0
 * @Author: Dai Junchao
 * @Date: 2020-04-28 12:20:49
 * @LastEditors: Dai Junchao
 * @LastEditTime: 2020-04-29 20:47:52
 */
const mongoose = require('mongoose');
const glob = require('glob');
const { resolve } = require('path');
const url = 'mongodb://localhost:27017/weChat';
exports.initSchemas = () => {
    // 同步引入，forEach遍历将里面所有的schema都引进来
    glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require);
}
exports.connect = () => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    let maxConnectTimes = 0;
    return new Promise((resolve, reject) => {
        // 增加数据库连接的事件监听
        mongoose.connection.on('disconnected', () => {
                console.log('**********数据库断开**********');
                if (maxConnectTimes < 3) {
                    maxConnectTimes++;
                    mongoose.connect(url);
                } else {
                    reject();
                    throw new Error('程序员无法搞定，请人为修理....');
                }
            })
            // 数据库出现错误的时候
        mongoose.connection.on('error', err => {
                console.log('**********数据库错误**********');
                if (maxConnectTimes < 3) {
                    maxConnectTimes++;
                    mongoose.connect(url);
                } else {
                    reject(err);
                    throw new Error('数据库出现问题，程序员无法搞定，请人为修理....');
                }
            })
            // 连接打开的时候
        mongoose.connection.on('open', () => {
            console.log('MongoDB connected successfully');;
            resolve();
        })
    });
}