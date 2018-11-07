Various routes:

For user registration

/register -> post request
send - username,password
response - string

/login -> post request
send - isername,password
response - string ("Found","Not Found")

For news

/postNews -> post request
send - title,description,url,category(seperated by ','),tagPrimary,tagSecondary,imageURL,source
extras - tags(for category splitting),titleSearch(for title splitting into words)
response - string

/updateNews -> post request
find news via - id
send - title,description,url,category(seperated by ','),tagPrimary,tagSecondary,imageURL,source
extras - tags(for category splitting),titleSearch(for title splitting into words)
response - string

/increaseNewsCounter -> post request
send - title
response - string

/deleteNews -> post request
send - id
response - stirng

/getNews -> get request - get all news
response - json - {success,data} - where success is integer and data is json

/getNewsByCategory -> post request
send - category
response - json - {success,data} - where success is integer and data is in json - returns news within a category

/searchNewsByTitle -> post request
send - title
response - json - {success,data} - where success is integer and data is in json - returns news within a category - returns news except the parameters: tags,titleSearch,url,tagPrimary,,tagSecondary,source,date,count,category

/getNewsByTitle -> get request
response - json - {success,data} - where success is integer and data is in json - returns news by title - returns news except the parameters: tags,titleSearch,date,count
