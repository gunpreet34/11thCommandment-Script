# 11th Commandment API

## Various routes:

### For user 
>'post' /register
```sh 
username:String(unique,required)
password:String(required)
response:String(Toast to be shown)
```

>'post' /login
```sh 
username:String(unique,required)
password:String(required)
response:String("Found","Not Found")
```

### For admin registration
>'get' /registerAdmin -> To load the webpage for registration

>'post' /registerSuccess
```sh 
name:String(required)
email:String(Unique.required)
password:String(required)
access:String ("0" for Editor and "1" for Admin) - (Required)
number:Number(Required)
response:Json - {success:String,data:Msg to be shown}
```

>'post' /adminLogin
```sh 
email:String(Unique.required)
password:String(required)
response:Json - {success:String,data:Msg to be shown}
```

### For news

>'post' /postNews 
```sh 
send - title,description,url,category(separated by ','),count,tagPrimary,tagSecondary,imageURL,source,type(poll or news),question,optionOne,optionTwo
extras - tags(for category splitting),titleSearch(for title splitting into words)
response - string
```

>'post' /deleteNews 
```sh 
send - id
response - string
```

>'get' /getNews 
```sh 
response - json - {success,data} - where success is integer and data is json
```

>'post' /getNewsByCategory
```sh 
send - category
response - json - {success,data} - where success is integer and data is in json - returns news within a category
```

>'post' /searchNewsByTitle 
```sh 
send - title
response - json - {success,data} - where success is integer and data is in json - returns news within a category - returns news except the parameters: tags,titleSearch,url,tagPrimary,,tagSecondary,source,date,count,category
```

>'get' /getNewsByTitle 
```sh 
response - json - {success,data} - where success is integer and data is in json - returns news by title - returns news except the parameters: tags,titleSearch,date,count
```


>'post' /updateNews 
```sh 
find admin via -> user_id
find news via -> _id
send - title,description,url,category(separated by ','),count,tagPrimary,tagSecondary,imageURL,source,type(poll or news),question,optionOne,optionTwo
extras - tags(for category splitting),titleSearch(for title splitting into words)
response - string
```

### For bookmarking news

>'post' /bookmark
```sh 
send - username,news_id
response - string
```

>'post' /getBookmarkedNews
```sh 
send - username
response - json - {success,data} - where success is integer and data is in json - returns news by id
```

### For categories

>'post' /addCategory
```sh
send - category(name),image(base64 encoded image)
response - String (Either -> Category added OR -> Error) 
```

>'post' /updateCategory
```sh 
send - 
response - 
```

>'get' /getCategories
```sh 
response - json - {success,data} - where success is integer and data is json
``` 

For getting polls
/getPolls - Post request
response - json - {success,data} - success in string("0" or "1") and data is JsonArray of all the Polls

For removing bookmarks
/deleteBookmark - post request
send - username,news_id
response - json - {success,data} - success in string("0" or "1") and data is String containing the message

For sharing news url
Share -> "https://commandment-api.herokuapp.com/news/" + uniqueUrl
get request to above url will return the news

Get categories - Only those categories which have news in it
/getCategoriesWithNews/:category -GET request
Nothing to send
Response - json - {success,data} - success in string("0" or "1") and data is json containing categories

### Increase poll count
>'post' /pollCount
```sh 
option:String(Required) - Either "0" or "1"
username:String(Required)
news_id:String(Required)
response:Json - {success:String, data:(Message)String, optionOne:Number, optionTwo:Number}
```

### Get polls for a user
>'post' /getPoll
```sh
username:String(Required)
response: Json - {success:String,data:votedPolls}
```

