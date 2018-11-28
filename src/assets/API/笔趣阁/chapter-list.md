## 章节列表
```
url: shuapi.jiaston.com/book/章节link(从章节列表中获得)即search中搜索到的Id/
method: GET
params:
  view chapters

example:
GET shuapi.jiaston.com/book/115088/
Response:
{
    "status":1,
    "info":"success",
    "data":{
        "id":115088,
        "name":"道君",
        "list":[
            {
                "name":"正文卷",
                "list":[
                    {
                        "id":5860382,
                        "name":"第一章 没白来",
                        "hasContent":1
                    },
                    {
                        "id":5860383,
                        "name":"第二章 古人诚不欺我",
                        "hasContent":1
                    },
                    {
                        "id":5860384,
                        "name":"第三章 传位之争",
                        "hasContent":1
                    },
                    {
                        "id":5860385,
                        "name":"第四章 牛有道",
                        "hasContent":1
                    }
                ]
            }
        ]
    }
}
```