# 11th Commandment API

## Various routes:

### For user 

#### Schema
```sh
username-string
access-number
fb_id-string
fb_number-Number
gmail_id-string
gmail_number-Number
mobile-string
name-string
bookmarkedNews-Array
```

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

#### Schema

```sh
name-string
password-string
access-number
mobile-number
email-string
```

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

#### Schema

```sh
title-string
titleSearch-[String]
description-string
url-string
category-string
tags-[string] -> splitted categories array
imageURL-string
source-string
count-number
date-string
verify-boolean
uniqueUrl-string
type-string
//For poll
question
optionOne
optionTwo
optionOneCount
optionTwoCount
```

>'post' /postNews 
```sh 
send - title,description,url,category(separated by ','),count,tagPrimary,tagSecondary,imageURL,source,type(poll or news),question,optionOne,optionTwo
extras - tags(for category splitting),titleSearch(for title splitting into words)
response - string
```

>'post' /updateNews 
```sh 
find admin via -> user_id
find news via -> _id
send - title,description,url,category(separated by ','),count,tagPrimary,tagSecondary,imageURL,source,type(poll or news),question,optionOne,optionTwo
extras - tags(for category splitting),titleSearch(for title splitting into words)
response - string
```

>'post' /deleteNews 
```sh 
send - id
response - string
```

>'get' /getNews -> Get verified news - for users
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

>'post' /searchUnverifiedNewsByTitle 
```sh 
send - user_id,title
response - json - {success,data} - where success is integer and data is in json - returns news within a category - returns all unverified news
```

>'post' /searchVerifiedNewsByTitle 
```sh 
send - user_id,title
response - json - {success,data} - where success is integer and data is in json - returns news within a category - returns all verified news
```

>'get' /getNewsByTitle 
```sh 
response - json - {success,data} - where success is integer and data is in json - returns news by title - returns news except the parameters: tags,titleSearch,date,count
```


>For sharing news url
```sh
Share -> "https://commandment-api.herokuapp.com/news/" + uniqueUrl
get request to above url will return the news in Json format
```

### For bookmarking news

#### BookmarkedNews Schema
```sh
username-string
news_id-string
news-object
```

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

>'post' /deleteBookmark 
```sh
send - username,news_id
response - json - {success,data} - success in string("0" or "1") and data is String containing the message
```

### For categories

#### Schema

```sh
category-string
count-number
imageURL-string
verify-boolean
```

>'post' /addCategory
```sh
send - category(name),image(url),user_id(Author)
response - String (Either -> Category added OR -> Error) 
```

>'post' /updateCategory
```sh
send - category(name),image(url),user_id(Author)
response - String (Either -> Category added OR -> Error) 
```

>'post' /deleteCategory
```sh
send - _id(category id)
response - json(success:0 means failure, success:1 means success, data has message embedded)
```

>'get' /getUnverifiedCategories
```sh
response - json({successParameter,jsonArrayOfUnverifiedCategories})
```

>'get' /getVerifiedCategories
```sh
response - json({successParameter,jsonArrayOfVerifiedCategories})
```

>'get' /getCategory/:id
```sh
response - json({successParameter,jsonOfCategoryCorrespondingToId})
```

>'get' /getCategories
```sh 
response - json - {success,data} - where success is integer and data is json
``` 

>'get' /getCategoriesWithNews -> Get only those categories which have news
```sh
response - json - ({successParameter,jsonArrayOfAllCategoriesWithNews})
```

### For polls

#### SavedPoll Schema
```sh
username-string
poll_id-string
option-number
```

>'post' /getPolls 
```sh
response - json - {success,data} - success in string("0" or "1") and data is JsonArray of all the Polls
```

>'post' /pollCount -> increase counter
```sh 
send -> 1. option:String(Required) - Either "0" or "1"
        2. username:String(Required)
        3. news_id:String(Required)
response:Json - {success:String, data:(Message)String, optionOne:Number, optionTwo:Number}
```

>'post' /getPoll -> get polls for a user
```sh
send : username:String(Required)
response : Json - {success:String,data:votedPolls}
```

### For Advertisement

#### Schema

```sh
type-string
advertisementListCount-number
title-string
titleSearch-[string]
description-string
advertisementUrl-string
URL-string
source-string
verify-boolean
shown-boolean
uniqueUrl-string
```

>'post' /addAdvertisement
```sh
send : title,URL,source,type,advertisementListCount,description , user_id(Admin)
response : String (Success message or error message)
```

>'post' /updateAdvertisement
```sh
send : title,URL,advertisementUrl,source,type,advertisementListCount,description , user_id(Admin)
response : String (Success message or error message)
```

>'post' /deleteAdvertisement
```sh
send : _id
response : json(successParameter, deletedAdvertisement)
```

>'get' /getAdvertisements -> Get all advertisements - verified only - for users
```sh
response: json - {successParameter,jsonArray}
```

>'get' /getUnverifiedAdvertisement -> Get only unverified - for authors
```sh 
response: json - {successParameter,jsonArray} 
```

>'get' /getAllAdvertisements/:user_id -> Get verified advertisements - for authors
```sh
response: json - {successParameter,jsonArray} 
```