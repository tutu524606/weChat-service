/*
 * @Descripttion: 
 * @version: 
 * @Author: Dai Junchao
 * @Date: 2020-04-28 13:28:19
 * @LastEditors: Dai Junchao
 * @LastEditTime: 2020-04-28 22:58:43
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema; // 声明Schema
let ObjectId = Schema.Types.ObjectId; // 主键，声明ObjectId

// 对新增用户用加盐加密处理
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10; // 加盐强度，数字1-99

// 创建用户表单schema，描述此集合里有哪些字段，字段是什么类型
const userSchema = new Schema({
    userId: { type: ObjectId },
    username: { unique: true, type: String },
    password: String,
    createAt: { type: Date, default: Date.now() },
    lastLoginAt: { type: Date, default: Date.now() }
}, {
    collection: 'user'
});

// 每次存储数据时都要执行，执行成功的时候执行next静态方法：有Schema就能用
userSchema.pre('save', function(next) {
    // bcrypt提供的加盐方法：
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err); // 加盐失败，返回err
        bcrypt.hash(this.password, salt, (err, hash) => { // 加盐成功再用hash算法对密码进行加密
            if (err) return next(err); // 出错，执行错误
            this.password = hash; // 如果加密成功，将密码置为加盐加密的值
            next(); // 处理完成
        });
    });
});

// 实例方法：需要new才能用，在api中。密码比对，一个客户端密码，一个数据库密码。用bcrypt提供的compare方法进行比对，最后包装成Promise实例对象返回
userSchema.methods = {
    comparePassword: (_password, password) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, password, (err, isMatch) => {
                if (!err) resolve(isMatch)
                else reject(err);
            })
        })
    }
}

// 发布模型：到数据库中会变成users，如果还是想使用自己的配置，直接创建的时候假collection
mongoose.model('user', userSchema);