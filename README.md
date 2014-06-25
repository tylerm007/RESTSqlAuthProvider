RESTAuthProvider
===================

This is a  REST authentication - it uses a predefined apiKey to make REST calls to authenticate users and roles

###Building###

1. Clone the repo using `git clone --recurse-submodules https://github.com/EspressoLogicCafe/RESTSqlAuthProvider.git`.
2. `mvn clean install`

###Setup###
Modify the rest URLs in test.js to match your own project
Create a special ApiKey with ReadOnly access to your User_Role view
Modify the JavaScript to match your column names of your User Table and the Role column names
Load the JavaScript library into LogicDesigner Project>Your Library
Configure the Authentication Provider in LogicDesigner Project>Authentication Provider

Optional: You can load the sample app by doing an import in LogicDesigner>Project

###Tesing locally###
 
startRESTSQLAuthServer.cmd (windows)

test.sh (Linux)


