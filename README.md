Various routes:

For user registration

/register -> post request
send - username(unique),password
response - string

/login -> post request
send - username,password
response - string ("Found","Not Found")

For news

/postNews -> post request
send - title(unique),description,url,category(seperated by ','),tagPrimary,tagSecondary,imageURL,source
extras - tags(for category splitting),titleSearch(for title splitting into words)
response - string

/deleteNews -> post request
send - id
response - string

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

For updating news

/updateNews -> post request
find news via - id
send - title,description,url,category(separated by ','),tagPrimary,tagSecondary,imageURL,source
extras - tags(for category splitting),titleSearch(for title splitting into words)
response - string

/updateNewsByTitle ->post request
send - _id,title
response - string

/updateNewsByDescription ->post request
send - _id,description
response - string

/updateNewsByUrl ->post request
send - _id,url
response - string

/updateNewsByCategory ->post request
send - _id,category
response - string

/updateNewsByTagPrimary ->post request
send - _id,tagPrimary
response - string

/updateNewsByTagSecondary ->post request
send - _id,tagSecondary
response - string

/updateNewsByImageUrl ->post request
send - _id,imageURL
response - string

/updateNewsBySource ->post request
send - _id,source
response - string

/updateNewsByCounter ->post request
send - _id,count
response - string


For bookmarking news

/bookmark
send - username,news_id
response - string

/getBookmarkedNews
send - username
response - json - {success,data} - where success is integer and data is in json - returns news by id

For getting categories
/getCategories
response - json - {success,data} - where success is integer and data is json