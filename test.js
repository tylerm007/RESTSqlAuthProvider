// this small section is provided by the Espresso Logic server when running in the server.
// a small emulator is provided for testing locally.

out = java.lang.System.out;

var SysUtility = {
	 restPost : function restPost(url, params, settings, data) {
	    var restCaller = new com.kahuna.logic.lib.rest.RestCaller(this);
		var result = restCaller.post(url, params, settings, data);
		return result;
	},

	restGet : function restGet(url, params, settings) {
		var restCaller = new com.kahuna.logic.lib.rest.RestCaller(this);
		var result = restCaller.get(url, params, settings);
		return result;
    }
};

// 1. load the class
load("RESTAuthSecurityProvider.js");

// 2. configuration needed for testing
// change employee to the name of your view User_Login
//if you have a different view for a list of all roles - you can chage the loginGroupURL to reflect that view
//this information is stored on the Server and called when authentication is used.
var configSetup = {
   loginBaseURL: 'https://demotest.espressologic.com/rest/el-test/demo/v1/employee',
   loginGroupURL : 'https://demotest.espressologic.com/rest/el-test/demo/v1/employee',
   logonApiKey: 'n3OKKu9OjxWP3HFYJQBm',
   keyLifetimeMinutes : 60
};

// 3.this is how the server creates the security object
var restClient = RESTAuthSecurityProviderCreate();
restClient.configure(configSetup);

out.println("------------- testing REST authenticate with good payload----------------");

var payload = {
    username: "sam",
    password: "password1",
};

var result = restClient.authenticate(payload);
out.println(JSON.stringify(result, null, 2));
out.println("-------------");


out.println("------------- testing REST authenticate with bad payload --------------");
badPayload = {
    username: "badUserName",
    password: "Password$1",

};

result = restClient.authenticate(badPayload);
out.println(JSON.stringify(result, null, 2));
out.println("-------------");


var payload = {
    username: "tyler",
    password: "password1",
    roleQuery : 'select * from employees'
};


out.println("------------- testing getAllGroups------------------");
result = restClient.getAllGroups();
out.println(JSON.stringify(result, null, 2));
out.println("-------------");

out.println("------------- testing getLoginInfo----------------");

//used only by LiveBrowser to build dynamic dialog box.
result = restClient.getLoginInfo(null);
out.println(JSON.stringify(result, null, 2));
out.println("First field is " + result.fields[0].name);
out.println("-------------");

//used by the setup dialog
out.println("------------- testing getConfigInfo---------------");
result = restClient.getConfigInfo();
out.println(JSON.stringify(result, null, 2));
out.println("First config prop is " + result.fields[0].name);
out.println("-------------");
