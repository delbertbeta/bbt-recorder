# bbt-recorder

A project for the event of other department in BBT.

# API List

1. /api/upload.php

* 说明：提交一个录音

* 方法: POST

* 类型：Multipart/form-data

* 负载:

```
-----form part------
name: user; content-type: application/json

{
  wechat: string,       // the wechat name
  remark: string        // the user input name
  content: string       // the user message
}

-----form part------
name: recordFile; content-type: unknown

binary file
```

* 返回：

```
{
  "status": number,      // status code (0 is right)
  "message": string,  // error message if needed.
  // "code": string      // deprecated, the identify code if uploaded successfully.
}
```

2. /api/upload-no-record.php

* 说明：提交一个纯文本留言

* 方法: POST

* 类型：application/json

* 负载:

```
{
  wechat: string,       // the wechat name
  remark: string        // the user input name
  content: string       // the user message
}
```

* 返回：

```
{
  "status": number,      // status code (0 is right)
  "message": string,  // error message if needed.
  // "code": string      // deprecated, the identify code if uploaded successfully.
}
```

3. /api/login.php

* 说明: 登录认证（请投放 session）

* 方法: POST

* 类型: application/json

* 负载: 

```
{
  "username": string,
  "password": string
}
```

* 返回:

```
{
  "status": number,   // status code
  "message": string,  // error message if needed.
}
```

4. /api/get_recored.php

* 说明: 获取所有录音

* 方法: GET

* 返回: 

```
[
  {
    "regtime": number,   // unix timestamp for the upload time.
    "id": number,        // id of the record.
    "url": string,       // url to static file of the record audio.
    "remark": string,    // the user input name.
    "wechat": string,    // the wechat name.
    "message": string    // the user message.
  },
  {
    ...
  }
]
```

5. /api/delete_record.php

* 说明: 删除一条录音

* 方法: POST

* 类型: application/json

* 负载: 

```
{
  id: number      // only one number will be post.
}
```

* 返回:

```
{
  "status": number,      // status code
  "message": string,  // error message if needed.
}
```

6. /api/logout.php

* 说明: 登出并销毁 session

* 方法: POST

* 负载: 空

* 返回:

```
{
  "status": number,      // status code
  "message": string,  // error message if needed.
}
```


---

> **deprecated**

7. /api/get_qrcode.php

* 说明: 获取对应 id 的二维码打包后的 zip 文件

* 方法: GET

* 类型: application/json

* 负载: 

```
{
  json: [
    numbers
  ]      // the id fetched from get_record.php api.
}
```

* 返回: 当成功打包时返回 zip 的 blob，当失败时直接产生错误的 HTTP 请求码。
	* 400:缺少id或者id为空
	* 500：zip操作出错


8. /api/get_info.php

* 说明: 根据二维码指向的链接中带的参数（加密后的标识符）获得录音的相关信息。

* 方法: GET

* 参数: code=string

* 返回:

```
{
  "status": number,      // status code
  "message": string,    // error message if needed.
  "remark": string,     // the user input name.
  "url": string         // url to static file of the record audio.
}
//demo
{
 	"status":0,
	"message":"",
	"remark":"this is a user remark",
	"usr":"/record/156545262.mp3"
}
//deme(error){
	"status":1,
	"message":""
}
```
