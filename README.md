###########
ASSIGNMENT 3
-Where in The World-
###########

+ Worked with git throughout the project and pushed both to heroku and my master branch in a repo (out of my private repo) called "server-ex"
+ All the different paths work fine locally. To test locally, I created my own collection and added
different documents as I went through (in my mongo console). Concerning the post request, I used a google Chrome add-on called Postman (https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en) which lets you add data to a collection. To test locally I just specified my localhost:3000/sendLocation url.
+ get("/") works both locally and on Heroku
+ get("/locations.json") works both locally and on Heroku
+ get("/redline.json") works on Heroku / I added it to my redline lab and all the markers appear.
+ post("/sendLocation") works locally and "kind-of" works on heroku. Data is being persisted to database for sure since I can see records on my mongoLab database on Heroku.I get data back for my location but not for other students for some reason when I link it to my assignment 2. Also my herokuapp has crashed once or twice for unknown reasons when I post to /sendLocation. Yet, Data has still been persisted to my mongoLab.
+ Sorts all data according to created_at in desc order
+ CORS works for all necessary paths
+ Spent a total of 10 hours in different sittings (used my first token)
+ Worked with my good lad Ivan Cherem

