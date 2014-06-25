//Upload this JavaScript to EspressoLogic Stormpath Authentication Provider
function RESTAuthSecurityProviderCreate() {

	var result = {};
	var configSetup = {
		logonApiKey : '',
		loginBaseURL : '',
		loginGroupURL : '',
		keyLifetimeMinutes : 60
	};

	// FUNCTION this call must be made first to pass in the required SQL
	// configuration values
	result.configure = function configure(myConfig) {
		configSetup.logonApiKey = myConfig.logonApiKey || '';
		configSetup.loginBaseURL = myConfig.loginBaseURL || '';
		configSetup.loginGroupURL = myConfig.loginGroupURL || '';
		configSetup.keyLifetimeMinutes = myConfig.keyLifetimeMinutes || 60;
	};

	// NOTE: the function configure must be called first - this will validate
	// the sql user account
	// FUNCTION AUTHENTICATE REQUIRES PAYLOAD {username : '', password : ''}
	result.authenticate = function authenticate(payload) {

		// helper function to return an named value pairs of customData (exclude
		// reserved fields)
		var parseCustomData = function parseCustomData(result, stringHREF) {
			for ( var id in stringHREF) {
				if (!stringHREF.hasOwnProperty(id)) {
					continue;
				}
				if (RESERVED_FIELDS_HREF.indexOf(id) != -1) {
					continue;
				}
				if (stringHREF.hasOwnProperty('customData')) {
					var customdata = stringHREF[id];
					for ( var key in customdata) {
						result[key] = customdata[key];
					}
				}
			}
		};

		var roles = [];
		var errorMsg = null;
		var resetPasswordURL = null;
		var forgotPasswordURL = null;
		var customDataHREF = {};
		var params = null;
		var settings = {
			headers : {
				'Authorization' : 'Espresso ' + configSetup.logonApiKey + ':1'
			}
		};

		try {
			// GET this JSON request to determine if username and password
			// account is valid in the REST call
			// the view should return an array of role names
			var loginAttemptURL = configSetup.loginBaseURL + "?filter=login='"
					+ payload.username + "'"; // &password='" + payload.password+"'";
			var loginAttempt = SysUtility.restGet(loginAttemptURL, params,settings);

			var groups = JSON.parse(loginAttempt);
			// java.lang.System.out.println(JSON.stringify(groups, null, 2));

			if (groups.hasOwnProperty('errorMessage')) {
				errorMsg = groups.errorMessage;
			} else {
				// change the field name below .name to the name of your
				// roleName column
				for ( var row in groups) {
					roles.push(groups[row].name);
				}
			}
		} catch (e) {
			errorMsg = e.message;
		}

		var autResponse = {
			errorMessage : errorMsg,
			roleNames : roles,
			userIdentifier : payload.username,
			keyExpiration : new Date(+new Date()
					+ (+configSetup.keyLifetimeMinutes) * 60 * 1000),
			resetPasswordURL : resetPasswordURL,
			forgotPasswordURL : forgotPasswordURL,
			userData : customDataHREF,
			lastLogin : {
				datetime : null,
				ipAddress : null
			}
		};
		return autResponse;
	};

	// FUNCTION getAllGroups is used to map all available groups for existing
	// application -
	result.getAllGroups = function getAllGroups() {
		var roles = [];
		var errorMsg = null;
		var params = null;
		var settings = {
			headers : {
				'Authorization' : 'Espresso ' + configSetup.logonApiKey + ':1'
			}
		};
		try {
			var loginAttemptURL = configSetup.loginGroupURL; // no filter needed- get all roles?
			var groupsResponse = SysUtility.restGet(loginAttemptURL, params,
					settings);
			var groups = JSON.parse(groupsResponse);
			if (groups.hasOwnProperty('errorMessage')) {
				errorMsg = groups.errorMessage;
			} else {
				// change the .name to refrelect the name of your roles returned
				// in the JSON object
				for ( var row in groups) {
					roles.push(groups[row].name);
				}
			}
		} catch (e) {
			errorMsg = e.message;
		}

		var autResponse = {
			errorMessage : errorMsg,
			roleNames : roles
		};

		return autResponse;
	};
	// FUNCTION getLoginInfo is used to create the logon dialog - DO NOT CHANGE
	result.getLoginInfo = function getLoginInfo() {
		return {
			fields : [
					{
						name : "username",
						display : "Username",
						description : "Enter your Username",
						type : "text",
						length : 40,
						helpURL : "http://docs.stormpath.com/java/quickstart/#authenticate-an-account"
					},
					{
						name : "password",
						display : "Password",
						description : "Enter your Password",
						type : "password",
						length : 40,
						helpURL : "http://docs.stormpath.com/java/quickstart/#authenticate-an-account"
					} ],
			links : [

			]
		};
	};

	result.getConfigInfo = function getConfigInfo() {
		return {
			current : {

				"keyLifetimeMinutes" : configSetup.keyLifetimeMinutes,
				"logonApiKey" : 	configSetup.logonApiKey,
				"loginBaseURL" :	configSetup.loginBaseURL,
				"loginGroupURL" :  	configSetup.loginGroupURL
			},
			fields : [ {
				name : "logonApiKey",
				display : "logonApiKey",
				type : "text",
				length : 60,
				helpURL : ""
			}, {
				name : "loginBaseURL",
				display : "loginBaseURL",
				type : "text",
				length : 120,
				helpURL : ""
			}, {
				name : "loginGroupURL",
				display : "loginGroupURL",
				type : "text",
				length : 120,
				helpURL : ""
			}, {
				name : "keyLifetimeMinutes",
				display : "API Key Lifetime (Minutes)",
				type : "number",
				length : 8,
				helpURL : "http://www.espressologic.com"
			} ],
			links : []
		};
	};

	return result;
}
