## 书源
```
url: api.zsdfm.com/UrlSource
method: GET
params:
  view: summary
  book: 书籍id
example:
GET api.zsdfm.com/UrlSource/道君/跃千愁/第一千一百章%20江湖人称盗爷/index.html

response:
{
    "status":1,
    "info":"success",
    "data":[
        {
            "Url":"https://www.xxbiquge.com/76_76187/1210001.html",
            "WebName":"新笔趣阁",
            "RegRule":"//div[@id='content']",
            "Replacement":"(www.xxbiquge.com)|奇书屋|(?:]*?>.*?)",
            "ReplaceValue":""
        },
        {
            "Url":"https://www.biqudao.com/bqge19230/1391144.html",
            "WebName":"笔趣阁3",
            "RegRule":"//div[@id='content']",
            "Replacement":"(www.biqudao.com)|奇书屋|(?:]*?>.*?)",
            "ReplaceValue":""
        }
    ]
}
```