/*
 * @Descripttion: 
 * @version: 
 * @Author: Dai Junchao
 * @Date: 2020-04-28 11:25:18
 * @LastEditors: Dai Junchao
 * @LastEditTime: 2020-04-28 11:34:16
 */
const parseQueryStr = (queryStr) => {
    let queryData = {};
    let queryStrList = queryStr.split('&');
    for (let [index, queryStr] of queryStrList.entries()) {
        let itemList = queryStr.split('=');
        queryData[itemList[0]] = decodeURIComponent(itemList[1]);
    }
    return queryData;
}
const parsePostData = (ctx) => {
    return new Promise((resolve, reject) => {
        try {
            let postData = "";
            ctx.req.addListener('data', (data) => {
                postData += data;
            })
            ctx.req.addListener('end', () => {
                let parseData = parseQueryStr(postData);
                resolve(parseData);
            })
        } catch (err) {
            reject(err);
        }
    })
}
module.exports = {
    parsePostData
}