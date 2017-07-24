

//when html document loaded, import all ui and html file

$(function(){
  $("#includedContent").load("ui.html");
	$("#hiPageContainer").load("home.html");
	$("#hiMapModal").css({"visibility": "hidden", "opacity": "0"});	
});


//function to initialize google map api

var map;
var marker;
var marker2;
var x=0;
var pos;
var pos2;
var longi;
var lati;
var mapname;
      
      function initMap() {
         map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: lati, lng: longi},
          zoom: 15
          
        });
        
         pos= {
					 lat: lati,
					 lng: longi,
					 enableHighAccuracy: true
				 },
				
         marker2 = new google.maps.Marker({
          position: {lat: lati, lng: longi},
                 draggable: true,
       raiseOnDrag: true,
          map: map
        });
        
var infoWindow = new google.maps.InfoWindow({content: mapname});   
	infoWindow.open(map, marker2);
}
      
 
// function to update favourite list item using ajax and POST method

function hiSaveFavouriteList(fname, fnote){
	if (sessionStorage.username){

	var flist = {};
	var temp = "";
  flist.action = "save";
	flist.fname = fname;
	flist.username = sessionStorage.username;
  flist.note = $("#"+fnote).val();
  $.ajax({
    url: "/flist",
    type: "POST",
    data: flist,
    success: function(data){
			alert(fname + " saved to your favourite list!");
		},
		error: function(error) { 
			alert("Fail to save favourite list");}
	});
	}else{
		alert("You are not member!");
	}
}
   
// function to add favourite list item using ajax and PUT method

function hiAddFavouriteList(fname){
	if (sessionStorage.username){

	var flist = {};
	var temp = "";
  flist.action = "add";
	flist.fname = fname;
	flist.username = sessionStorage.username;
  $.ajax({
    url: "/flist",
    type: "PUT",
    data: flist,
    success: function(data){
			alert(fname + " added to your favourite list!");
		},
		error: function(error) { 
			alert("Fail to add favourite list");}
	});
	}else{
		alert("You are not member!");
	}
}

// function to delete favourite list item using ajax and DELETE method

function hiDeleteFavouriteList(fname){
	if (sessionStorage.username){

	var flist = {};
	var temp = "";
  flist.action = "delete";
	flist.fname = fname;
	flist.username = sessionStorage.username;
  $.ajax({
    url: "/flist",
    type: "DELETE",
    data: flist,
    success: function(data){
			alert(fname + " deleted from your favourite list!");
			hiOpenFavouriteList();
		},
		error: function(error) { 
			alert("Fail to delete favourite list");
		}
	});
	}else{
		alert("You are not member!");
	}
}

// function to search json file item ajax and GET method

function hiSearchPetPark(){
	var petpark = {};
	var temp = "";
	var temp2 = "";
	var re = new RegExp($("#searchpetpark").val(),"ig");
	
        
	petpark.action = "getpetpark";
	petpark.select = "search";
	petpark.keyword = $("#searchpetpark").val();
  $.ajax({
    url: "/petpark",
    type: "GET",
    data: petpark,
    success: function(data){
			for (i = 0; i < data.length; i++) { 
        temp += "<div class='infoboxContainer'>\n";
				temp2 = "";
				temp2 = data[i].Name_en.replace(re,"<span style='color:red'>"+$("#searchpetpark").val().toUpperCase()+"</span>");
				temp += "<div style='overflow:auto;' class='infoboxTitle' onclick=\"hiOpenInfobox('petparkInfobox"+i+"')\">"+temp2+"\n";
				temp += "<span onclick=\"hiOpenMapForm('"+data[i].Name_en+"',"+data[i].Longitude+","+data[i].Latitude+");event.stopPropagation();\"><img class='infoItemRight' src='/image/find.png' style='width:23px;height:23pxpx;'></span>\n";
				temp += "<span onclick=\"hiAddFavouriteList('"+data[i].Name_en+"');event.stopPropagation();\"><img class='infoItemLeft' src='/image/star.png' style='width:23px;height:23pxpx;'></span>\n";
				temp2 = "";
				temp2 += "</div>\n";
				temp2 += "<div id='petparkInfobox"+i+"' class='infoboxContent'>\n";
				temp2 += "<div class='infoboxItem'>\n";
				temp2 += "<div>District: "+data[i].District_en+"</div>\n";
				temp2 += "<div>Address: "+data[i].Address_en+"</div>\n";
				temp2 += "<div>Facilities:<br>"+data[i].Ancillary_facilities_en+"</div>\n";
				temp2 += "<div>Open hours: "+data[i].Opening_hours_en+"</div>\n";
				temp2 += "<div>Phone: "+data[i].Phone+"</div>\n";
				temp2 += "</div>\n";
				temp2 += "</div>\n";
				temp2 += "</div>\n";
				temp += temp2.replace(re,"<span style='color:red'>"+$("#searchpetpark").val().toUpperCase()+"</span>");
			}
      	//alert("Pet park successful!");
			//var finalResult = temp.replace(re,"<span style='color:red'>"+$("#searchpetpark").val().toUpperCase()+"</span>");
				$("#hiSearchResult").html(temp);

    },
    error: function(error) { alert(JSON.stringify(error));}
  });
	return false; 

}

// function to get favourite list item using ajax and POST method

function hiOpenFavouriteList(){
	if (sessionStorage.username){
		
	var petpark = {};
	var temp = "";
		
	petpark.action = "getflist";
	petpark.username = sessionStorage.username;
  $.ajax({
    url: "/flist",
    type: "POST",
    data: petpark,
    success: function(data){
			for (i = 0; i < data.length; i++) { 
        temp += "<div class='infoboxContainer'>\n";
				temp += "<div style='overflow:auto;' class='infoboxTitle' onclick=\"hiOpenInfobox('petparkInfobox"+i+"')\">"+data[i].Name_en+"\n";
				temp += "<span onclick=\"hiOpenMapForm('"+data[i].Name_en+"',"+data[i].Longitude+","+data[i].Latitude+");event.stopPropagation();\"><img class='infoItemRight' src='/image/find.png' style='width:23px;height:23pxpx;'></span>\n";
				temp += "<span onclick=\"hiDeleteFavouriteList('"+data[i].Name_en+"'); event.stopPropagation();\"><img class='infoItemLeft' src='/image/delete.png' style='width:23px;height:23pxpx;'></span>\n";
				temp += "</div>\n";
				temp += "<div id='petparkInfobox"+i+"' class='infoboxContent'>\n";
				temp += "<div class='infoboxItem'>\n";
				temp += "<div>District: "+data[i].District_en+"</div>\n";
				temp += "<div>Address: "+data[i].Address_en+"</div>\n";
				temp += "<div>Facilities:<br>"+data[i].Ancillary_facilities_en+"</div>\n";
				temp += "<div>Open hours: "+data[i].Opening_hours_en+"</div>\n";
				temp += "<div>Phone: "+data[i].Phone+"</div>\n";
				temp += "<div><span class='savenote' onclick=\"hiSaveFavouriteList('"+data[i].Name_en+"', 'fnote"+i+"');event.stopPropagation();\"><img class='infoItemLeft' src='/image/note.png' style='width:23px;height:23pxpx;'></span></div>\n";
				temp += "<textarea id='fnote"+i+"'>"+data[i].note+"</textarea>\n";
				temp += "</div>\n";
				temp += "</div>\n";
				temp += "</div>\n";
			}
      	//alert("Pet park successful!");
				$("#hiPageContainer").html(temp);

    },
    error: function(error) { alert(JSON.stringify(error));}
  });
	return false; 
}
	else{
		alert("You are not member!");
	}
}

// function to delete favourite list item using ajax and GET method

function hiOpenPetPark(){
	var petpark = {};
	var temp = "<div>Search:<input id='searchpetpark' type='text' placeholder='enter your keywords here' name='searchkeywords'></div>";
  temp += "<div class='bbutton' style='float:left' onclick='hiSearchPetPark()'>Search</div><div id='hiSearchResult'>"
	petpark.action = "getpetpark";
	petpark.select = "all";
  $.ajax({
    url: "/petpark",
    type: "GET",
    data: petpark,
    success: function(data){
			for (i = 0; i < data.length; i++) { 
        temp += "<div class='infoboxContainer'>\n";
				temp += "<div style='overflow:auto;' class='infoboxTitle' onclick=\"hiOpenInfobox('petparkInfobox"+i+"')\">"+data[i].Name_en+"\n";
				temp += "<span onclick=\"hiOpenMapForm('"+data[i].Name_en+"',"+data[i].Longitude+","+data[i].Latitude+");event.stopPropagation();\"><img class='infoItemRight' src='/image/find.png' style='width:23px;height:23pxpx;'></span>\n";
				temp += "<span onclick=\"hiAddFavouriteList('"+data[i].Name_en+"');event.stopPropagation();\"><img class='infoItemLeft' src='/image/star.png' style='width:23px;height:23pxpx;'></span>\n";
				temp += "</div>\n";
				temp += "<div id='petparkInfobox"+i+"' class='infoboxContent'>\n";
				temp += "<div class='infoboxItem'>\n";
				temp += "<div>District: "+data[i].District_en+"</div>\n";
				temp += "<div>Address: "+data[i].Address_en+"</div>\n";
				temp += "<div>Facilities:<br>"+data[i].Ancillary_facilities_en+"</div>\n";
				temp += "<div>Open hours: "+data[i].Opening_hours_en+"</div>\n";
				temp += "<div>Phone: "+data[i].Phone+"</div>\n";
				temp += "</div>\n";
				temp += "</div>\n";
				temp += "</div>\n";
			}
      	temp += "</div>\n";
				$("#hiPageContainer").html(temp);

    },
    error: function(error) { alert(JSON.stringify(error));}
  });
	return false;
}

// function to load how.html to container

function hiOpenHow(){
	$("#hiPageContainer").load("how.html");
}

// function to load home.html to container

function hiOpenIndex(){
	$("#hiPageContainer").load("home.html");
}

// function to load api.html to container

function hiOpenAPI(){
	$("#hiPageContainer").load("api.html");
}

// function to set logout status

function hiLogout(){
	sessionStorage.clear();
	$("#titleItem").html("Pet Care");
	$("#loginItem").html("<a class='slabel' href='javascript:void(0);' onclick='hiOpenLoginForm()'>Login</a>");
	$("#titleItem2").html("Pet Care");
	$("#loginItem2").html("<a class='slabel' href='javascript:void(0);' onclick='hiOpenLoginForm()'>Login</a>");
	if (sessionStorage.id){
    FB.logout(function() {
        window.location.href = "index.html";
    });
  }
}

// function to send forgotten pw to user email

function hiEmailPassword(){
	var user = {};
  user.action = "emailpassword";
  user.username = $("#logUsername").val();
  if (user.username == ""){
		alert("Please enter your username");
	}else{
  $.ajax({
    url: "/user",
    type: "POST",
    data: user,
    success: function(data){
			if (data.status != "fail"){
      alert("Password is sent to your email!");
			hiCloseLoginForm();
			}else{
				alert("Fail to send password to your email!");
			}
    },
    error: function() { alert("error");}
  });
	}
  return false;
}
	

//function to login using ajax and POST method

function hiLogin(){
  var user = {};
  user.action = "login";
  user.username = $("#logUsername").val();
  user.password = $("#logPassword").val();
  if (user.username == "" || user.password == ""){
		alert("Please enter all information!");
	}else{$.ajax({
    url: "/user",
    type: "POST",
    data: user,
    success: function(data){
			if (data.status != "fail"){
      alert("Login successful!");
			$("#titleItem").html("Pet Care (id: " + data[0].username + ")");
			$("#titleItem2").html("Pet Care (id: " + data[0].username + ")");
			$("#loginItem").html("<a class='slabel' href='javascript:void(0);' onclick='hiLogout()'>Logout</a>");
			$("#loginItem2").html("<a class='slabel' href='javascript:void(0);' onclick='hiLogout()'>Logout</a>");
			hiOpenLoginForm();
			sessionStorage.username = data[0].username;
			}else{
				alert("Login failure!");
			}
    },
    error: function() { alert("error");}
  });
	}
  return false;
}

// function to add new user using ajax and POST method

function hiRegister(){
  var user = {};  
  user.action = "register";
  user.username = $("#regUsername").val();
  user.password1 = $("#regPassword1").val();
  user.password2 = $("#regPassword2").val();
  user.email = $("#regEmail").val();
  if (user.username == "" || user.password1 == "" || user.password2 == "" || user.email == ""){
    alert("Please enter all information!");
  }else if (user.password1 != user.password2){
    alert("Please enter password again!");
  }else {
    $.ajax( {
      url: "/user",
      type: "POST",
      data: user,
			success: function(data){
      	alert(data.status);
				hiCloseRegisterForm;
    	},
    	error: function() { alert("fail");}
    });
  }
  return false;   
}

// function to display bottom menu using css 

function hiOpenMobileMenu(){
  var x = document.getElementById("hiMobileMenu");
  var s1 = document.getElementById("hiMobileSubMenu1");
  var s2 = document.getElementById("hiMobileSubMenu2");
  var s3 = document.getElementById("hiMobileSubMenu3");
  if (x.style.maxHeight == "0px" || x.style.maxHeight === ""){
    x.style.maxHeight = "150px";
  }else{
    x.style.maxHeight = "0px"
    s1.style.maxHeight = "0px";    
    s2.style.maxHeight = "0px";
    s3.style.maxHeight = "0px";
  }
}


// function to display login popup using css 

function hiOpenLoginForm(){
  var x = document.getElementById("hiLoginModal");
  var y = document.getElementById("hiContainerTop");
  if (x.style.visibility == "hidden" || x.style.visibility === ""){
    x.style.visibility = "visible";
    x.style.opacity = "1";
    y.style.zIndex = "5";
  }else{
    x.style.visibility = "hidden";
    x.style.opacity = "0";
    y.style.zIndex = "-1";
  }
}

// function to close login popup using css 

function hiCloseLoginForm(){
  var x = document.getElementById("hiLoginModal");
  var y = document.getElementById("hiContainerTop");
  x.style.visibility = "hidden";
  x.style.opacity = "0";
  y.style.zIndex = "-1";
}

// function to open register popup using css 

function hiOpenRegisterForm(){
  hiCloseLoginForm()
  var x = document.getElementById("hiRegisterContainer");
  var y = document.getElementById("hiContainerTop");
  
  if (x.style.visibility == "hidden" || x.style.visibility === ""){
    y.style.visibility = "hidden";
    x.style.visibility = "visible";
    x.style.opacity = "1";
  }else{
    x.style.visibility = "hidden";
    x.style.opacity = "0";
  }
}

// function to close register popup using css 

function hiCloseRegisterForm(){
  var x = document.getElementById("hiRegisterContainer");
    x.style.visibility = "hidden";
    x.style.opacity = "0";
}

// function to open google map popup using css 

function hiOpenMapForm(tname, long, lat){
	var x = document.getElementById("hiMapModal");
	var y = document.getElementById("hiContainerTop");
	
  if (x.style.visibility == "hidden" || x.style.visibility === ""){
    x.style.visibility = "visible";
    x.style.opacity = "1";
    y.style.zIndex = "5";
		longi = long;
		lati = lat;
		mapname = tname;
		initMap();
  }else{
    x.style.visibility = "hidden";
    x.style.opacity = "0";
    y.style.zIndex = "-1";
  }
}

// function to json data item box using css 

function hiOpenInfobox(data){
  var x = document.getElementById(data);
  if (x.style.maxHeight == "0px" || x.style.maxHeight === ""){
    x.style.maxHeight = "500px";  
  }else{
    x.style.maxHeight = "0px";
  }
}


// When the user clicks anywhere outside of the modal, close popup

window.onclick = function(event) {
  var x = document.getElementById("containertop");
  var y = document.getElementById("login");
  var x1 = document.getElementById("hiLoginModal");
  var x2 = document.getElementById("hiRegisterContainer");
  var x3 = document.getElementById("hiMapModal");
  
    if (event.target == y) {
        y.style.display = "none";
    }
    if (event.target == x) {
        x.style.display = "none";
    }
  if (event.target == x1) {
      hiOpenLoginForm();
    }
   if (event.target == x2) {
      hiOpenRegisterForm();
    }
     if (event.target == x3) {
      hiOpenMapForm();
    }
  
}
