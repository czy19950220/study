# 笔趣阁App和追书神器App的抓包Api
#### 工具
+ Fiddler
+ 使用时注意事项
	+ 手机和电脑必须在一个局域网内
#### 笔趣阁app显示流程
	+ 搜索书名-> 获取到书的id
		+ 笔趣阁App 默认使用的是百度小说的id
		+ 如果不是本站/百度的, 通过一些信息转换为本站id来进行处理
	+ 通过书的id获取到书的章节id  和最新章节(用于检查是否更新)
	+ 通过书的id&章节id获取到内容
#### 部分笔趣阁api展示
	+ 站内->搜索图书->json
		```
		url: https://sou.jiaston.com/search.aspx
		method: GET
		params:
		  siteid: 请求来源
		  page:  页码
		  key: 关键词

		example:
		GET sou.jiaston.com/search.aspx?key=道君&page=1&siteid=app

		reponse:
		{
		"status":1,
		"info":"success",
		"data":[
			{
				"Id":"14287",
				"Name":"道君",
				"Author":"巨人玄鸟",
				"Img":"http://www.apporapp.cc/BookFiles/BookImages/daojun.jpg",
				"Desc":"道君简介　
				　　 道君者，道之君王，逆转阴阳，长生不灭，掌控大道，统领群仙，。然而，上古之后，万年以来炼气士无数，却无一成就道君。
				　　
				　　 一场意料之外的雷劫，让资质平平，却一心求仙缘的许问命数逆转，背负着罕见的即有大机缘，又有大劫难，吉凶相生，大福大祸，或者成就大道，或者身死道消的凶险仙缘。
				　　
				　　 且看少年许问，一心求长生大道，战胜重重大劫难，得到种种大机缘。当他回首时，才发",
				"BookStatus":"连载",
				"LastChapterId":"8170474",
				"LastChapter":"第一千零三章 暂别万灵境",
				"CName":"武侠仙侠",
				"UpdateTime":"2015-08-17 00:00:00"
			},......]
		}
		```
	+ 百度->搜索图书->html
		```
		url: zhannei.baidu.com/cse/search
		method: GET
		params:
		  s: 不知道什么东西
		  p: page 页码
		  q: 关键词

		example:
		GET zhannei.baidu.com/cse/search?s=5541116575338011306&p=0&q=道君

		reponse:
		A HTML File

		```
	+ 获取章节列表	
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
		+ 获取章节内容	
		```		
		url: https://shuapi.jiaston.com/book/115088/5946751.html
		method: GET
		example:
		GET https://shuapi.jiaston.com/book/章节link(从章节列表中获得)即search中搜索到的Id/chapter-list中获取到的章节

		response:

		{
			"status":1,
			"info":"success",
			"data":{
				"id":115088,
				"name":"道君",
				"cid":5946751,
				"cname":"第一千一百章 江湖人称盗爷",
				"pid":5946749,
				"nid":5946784,
				"content":" 牛有道顺这条路挨着一家家问过来，凭栏处的敖丰一看就知道牛有道的目的。
				........",
				"hasContent":1
			}
		}
		```
		+ 获取书源	
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