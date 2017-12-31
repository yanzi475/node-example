const path = require('path');


function pathMethod() {


    path.join('/src','/path')  // path.join方法用于连接路径

    // var path = require('path');
    path.join(js, "app.js");  // js/app.js

    path.resolve()   //方法用于将相对路径转为绝对路径。如果没有传入 path 片段，则 path.resolve() 会返回当前工作目录的绝对路径

    path.resolve(__dirname, 'js/app.js')     //user/haiyan/project/webpack/js/app.js

    path.parse()     //方法可以返回路径各部分的信息。
    var myFilePath = '/user/haiyan/project/op/test/db.json';
    path.parse(myFilePath).base
    // "db.json"
    path.parse(myFilePath).name
    // "db"
    path.parse(myFilePath).ext
     // ".json"
}

exports.pathMethod = pathMethod;
