window.fbAsyncInit = function() {
    // FB JavaScript SDK configuration and setup
    FB.init({
      appId      : '1550598311673130', // FB App ID
      cookie     : true,  // enable cookies to allow the server to access the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.9' // use graph api version 2.9
    });
    
    // Check whether the user already logged in
	
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {

        }
    });
};

// Load the JavaScript SDK asynchronously

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Facebook login with JavaScript SDK

function fbLogin() {
  
  
    FB.login(function (response) {
      
       if (response.authResponse) {
         FB.api('/me', function(response) {
            // Get and display the user profile data
           FB.api('/me', {locale: 'en_US', fields: 'id,first_name,last_name,email,link,gender,locale,picture'},
           function (response) {
              sessionStorage.fb = response.first_name;
           sessionStorage.username = response.id;
           $("#titleItem").html("Pet Care (FB: " + sessionStorage.fb + ")");
			     $("#titleItem2").html("Pet Care (FB: " + sessionStorage.fb + ")");
			     $("#loginItem").html("<a class='slabel' href='javascript:void(0);' onclick='hiLogout()'>Logout</a>");
			     $("#loginItem2").html("<a class='slabel' href='javascript:void(0);' onclick='hiLogout()'>Logout</a>");
           hiCloseLoginForm()
           });
           
         });
       } else {
            window.location.href = "index.php";
       }
  
  });
}

// Fetch the user profile data from facebook

function getFbUserData(){
    FB.api('/me', {locale: 'en_US', fields: 'id,first_name,last_name,email,link,gender,locale,picture'},
    function (response) {
        document.getElementById('fbLink').setAttribute("onclick","fbLogout()");
        document.getElementById('fbLink').innerHTML = 'Logout from Facebook';
        document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.first_name + '!';
        document.getElementById('userData').innerHTML = '<p><b>FB ID:</b> '+response.id+'</p><p><b>Name:</b> '+response.first_name+' '+response.last_name+'</p><p><b>Email:</b> '+response.email+'</p><p><b>Gender:</b> '+response.gender+'</p><p><b>Locale:</b> '+response.locale+'</p><p><b>Picture:</b> <img src="'+response.picture.data.url+'"/></p><p><b>FB Profile:</b> <a target="_blank" href="'+response.link+'">click to view profile</a></p>';
    });
}

// Logout from facebook

function fbLogout() {
    hiLogout();
    if (sessionStorage.id){
    FB.logout(function() {
        window.location.href = "index.php";
    });
    }
}
  
  