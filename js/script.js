var uname, uemailid, uphotourl, uid;


// References start
var db = firebase.database();
var storage = firebase.storage();
var storageRef = storage.ref();
var msgRef = db.ref("/msgs");
var userinfoRef = firebase.database().ref("/userinfo");
// References end


// Check if the user is logged in or not...If the user is not logged in, the user will be redirected to the login page
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    uid = user.uid;
    var user = firebase.auth().currentUser;
    if (user != null) {
      // console.log(user + "User state");
      user.providerData.forEach(function (profile) {
        uname = profile.displayName;
        uemailid = profile.email;
        uphotourl = profile.photoURL;
        // console.log("Sign-in provider: " + profile.providerId);
        // console.log("  Provider-specific UID: " + profile.uid);
        // console.log("  Name: " + uname);
        // console.log("  Email: " + uemailid);
        // console.log("  Photo URL: " + uphotourl);

        document.getElementById('uname').innerText = uname;
        document.getElementById('uemailid').innerText = uemailid;
        document.getElementById('profilepic').src = uphotourl;

      });
    }
  } else {
    // console.log("User is not loged in");
    window.open("login.html", "_self");
  }
});


// ********   THE FOLLOWING FUNCTION ARE MOVED TO A SEPERATE JavaScript File login.js  *******

// Sign Up/ Sign In/ Sign Out Start

// function signupfunc() {
//   // console.log('Signup function is called');
//   var email = document.getElementById('emailsignup').value;
//   var password = document.getElementById('passwordsignup').value;
//   var usernamesignup = document.getElementById('usernamesignup').value;

//   uphotourl = "https://firebasestorage.googleapis.com/v0/b/socialmedia-af41d.appspot.com/o/profilepic.png?alt=media&token=63129c06-7dfb-45b2-b897-4a247b737d0c";


//   firebase.auth().createUserWithEmailAndPassword(email, password)
//     .then(
//       (user) => {
//         if (user) {
//           var user = firebase.auth().currentUser;
//           user.updateProfile({
//             displayName: usernamesignup,
//             photoURL: uphotourl
//           }).then(function (response) {
//             //Success
//             // console.log("User signed in");
//           }, function (error) {
//             //Error
//             // console.log("User could not signed in due to following error");
//             console.log(error);
//           });
//         }
//       }
//     ).catch(function (error) {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       // ...
//       window.alert('Error: ' + errorMessage);
//     });
// }


// function signupfunc2() {
//   document.getElementById('loginform').style.display = "none";
//   document.getElementById('signupform').style.display = "block";
// }



// function loginfunc() {
//   // console.log('function is called');
//   let email = document.getElementById('email').value;
//   let password = document.getElementById('password').value;
//   // console.log(email);
//   // console.log(password);
//   firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // ...
//     window.alert('Error :' + errorMessage);
//   });
// }

// function loginfunc2() {
//   document.getElementById('loginform').style.display = "block";
//   document.getElementById('signupform').style.display = "none";
// }


// Sign Up/Sign In end

// Sign Out Start

function logoutfunc() {
  firebase.auth().signOut().then(function () {
    // console.log("User loged out");
    window.alert("You've successfully logged out");
    window.open("login.html", "_self");
  }).catch(function (error) {
    // An error happened.
    window.alert("An error happend when logging out the user. Please try again!");
  });
}

//Sign Out End

// Profile Pic Update start

document.getElementById('ppupdate').addEventListener('change', updateppfunc);
var newpp;
function updateppfunc(evtt) {
  let charsforstring = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = "";
  let charsforstringLength = charsforstring.length;
  for (let i = 0; i < 7; i++) {
    result = result + charsforstring.charAt(Math.floor(Math.random() * charsforstringLength));
  }
  result = "PP - " + result;
  newpp = evtt.target.files[0];
  var uploadpptask = storageRef.child(`pps/${result}`).put(newpp);

  uploadpptask.on('state_changed', (snapshot) => {
    // Observe state change events such as progress, pause, and resume
  }, (error) => {
    // Handle unsuccessful uploads
    // console.log('unsuccessful upload');
    // console.log(error);
  }, () => {
    // Do something once upload is complete
    // console.log('successfully uploaded');
    newpp.value == "";


    var ppRef = storageRef.child(`pps/${result}`);

    ppRef.getDownloadURL().then(function (url) {
      // Insert url into an <img> tag to "download"
      // console.log(url);
      uphotourl = url;
      document.getElementById('profilepic').src = uphotourl;



      var user = firebase.auth().currentUser;
      user.updateProfile({
        photoURL: uphotourl
      }).then(function () {
        // Update successful.
        // console.log("Janu New photURL: " + uphotourl);
      }).catch(function (error) {
        // An error happened.
        // console.log("Allah di marzi");
      });



    }).catch(function (error) {
      // console.log("jani Error happend!");
      switch (error.code) {
        case 'storage/object-not-found':
          // console.log('File doesnt exist');
          break;

        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          // console.log('No permission');
          break;

        case 'storage/canceled':
          // User canceled the upload
          // console.log('upload cancelled');
          break;

        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          // console.log('Unknown error');
          break;
      }
    });

  });

}

// Profile Pic Update End


var post;
var myurl;
var icheck = false;
var vcheck = false;


function validateFileType(e) {
  var fileName = document.getElementById("imagepost").value;
  var idxDot = fileName.lastIndexOf(".") + 1;
  var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
  if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "gif") {
    icheck = true;
    vcheck = false;
    imgselect(e);
  }
  else if (extFile == "mp4" || extFile == "3gp" || extFile == "ogg") {
    vcheck = true;
    icheck = false;
    vidselect(e);
  }
  else {
    alert("Only jpg, jpeg, png, gif, mp4, 3gp and ogg file types are allowed");
    document.getElementById("imagepost").value = "";
  }
}


// Check if the selected file is selected and than check if an image or video than call image or video function respectivily
function postcheck() {
  post = document.getElementById('inputtext').value;
  if (post != "" || imagepost.value != "") {
    if (post != "" && imagepost.value == "") {
      myurl = "";
      addpostfunc();
    }
    else if (post == "" && imagepost.value != "") {
      if (icheck == true && vcheck == false) {
        imgsubmit();
      }
      else if (vcheck == true && icheck == false) {
        vidsubmit();
      }
    }
    else if (post != "" && imagepost.value != "") {
      if (icheck == true && vcheck == false) {
        imgsubmit();
      }
      else if (vcheck == true && icheck == false) {
        vidsubmit();
      }
    }
  }
}

var date = new Date().toDateString();
var imagepost = document.getElementById('imagepost');



document.getElementById('imagepost').addEventListener('change', validateFileType);


var imagebeforedb;
function imgselect(e) {
  // Get first selected image
  imagebeforedb = e.target.files[0];
}

var videobeforedb;
function vidselect(e) {
  // Get first selected video
  videobeforedb = e.target.files[0];
}


// Upload the video to firebase storage with a unique name and put the image url in post (Which will letter be pushed to realtime database )
function vidsubmit(e) {
  let charsforstring = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = "";
  let charsforstringLength = charsforstring.length;
  for (let i = 0; i < 7; i++) {
    // To assign unique and random name to a video
    // Random string generator
    result = result + charsforstring.charAt(Math.floor(Math.random() * charsforstringLength));
  }
  result = "PostVid - " + result + "+myvid";

  // console.log("vidselect called");
  var uploadvidTask = storageRef.child(`postvideos/${result}`).put(videobeforedb);
  // Getting image back from server start


  uploadvidTask.on('state_changed', (snapshot) => {
    // Observe state change events such as progress, pause, and resume
  }, (error) => {
    // console.log('unsuccessful upload');
    // console.log(error);
  }, () => {
    // console.log('successfully uploaded');
    imagepost.value == "";


    var vidRef = storageRef.child(`postvideos/${result}`);

    vidRef.getDownloadURL().then(function (url) {
      // Insert url into an <video> tag to "download"
      // console.log(url);
      myurl = url;
      addpostfunc();
    }).catch(function (error) {
      switch (error.code) {
        case 'storage/object-not-found':
          // console.log('File doesnt exist');
          break;

        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          // console.log('No permission');
          break;

        case 'storage/canceled':
          // User canceled the upload
          // console.log('upload cancelled');
          break;

        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          // console.log('Unknown error');
          break;
      }
    });

  });

}


// Upload the image to firebase storage with a unique name and put the image url in post (Which will letter be pushed to realtime database )
function imgsubmit(e) {
  let charsforstring = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = "";
  let charsforstringLength = charsforstring.length;
  for (let i = 0; i < 7; i++) {
    result = result + charsforstring.charAt(Math.floor(Math.random() * charsforstringLength));
  }
  result = "PostIMG - " + result + "+myimage";
  var uploadTask = storageRef.child(`postimages/${result}`).put(imagebeforedb);
  // Getting image back from server start


  uploadTask.on('state_changed', (snapshot) => {
    // Observe state change events such as progress, pause, and resume
  }, (error) => {
    // Handle unsuccessful uploads
    // console.log('unsuccessful upload');
    console.log(error);
  }, () => {
    // Do something once upload is complete
    // console.log('successfully uploaded');
    imagepost.value == "";


    var imgRef = storageRef.child(`postimages/${result}`);

    imgRef.getDownloadURL().then(function (url) {
      // Insert url into an <img> tag to "download"
      // console.log(url);
      myurl = url;
      addpostfunc();
    }).catch(function (error) {
      switch (error.code) {
        case 'storage/object-not-found':
          // console.log('File doesnt exist');
          break;

        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          // console.log('No permission');
          break;

        case 'storage/canceled':
          // User canceled the upload
          // console.log('upload cancelled');
          break;

        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          // console.log('Unknown error');
          break;
      }
    });

  });

}

// Create the post and push to the firebase realtime database
function addpostfunc() {
  var myRef = msgRef.push();
  let nodekey = myRef.key;
  var msg = {
    nkey: nodekey,
    name: uname,
    dbpic: uphotourl,
    dbdate: date,
    text: post,
    dbimgurl: myurl,
    dbuid: uid
  };
  if (myRef.push(msg)) {

    // Clearing the both text and img/video inputs after successfull upload
    document.getElementById('inputtext').value = "";
    document.getElementById('imagepost').value = "";
  }
}


// Get the posts from the real time datbase
var postdiv = document.getElementById('postdiv');
msgRef.on('child_added', data => {
  var mydata = data.val();
  var arr = Object.values(mydata);
  // console.log(mydata);
  // console.log(arr[0]);

  var { nkey, name, dbpic, dbdate, text, dbimgurl, dbuid } = arr[0];
  // console.log(nkey, name, dbpic, dbdate, text, dbimgurl);
  // console.log(dbuid);
  var dbdiv = document.createElement('div');
  dbdiv.className = `mypost ${dbuid}`;
  dbdiv.innerHTML = `<img class="dbpic" src=${dbpic}><h3>${name} <span id="admin" style="display: none"> <u> ADMIN</u></span></h3><p>${dbdate}</p>
  <br><p>${text}</p><p><img id="dbimage"></p><p> <video id="dbvid" controls></video></p><p></p>
  <br id="mybr">
  <div class="engagediv">
  <button class="like" onclick= "likefunc(this)">Like</button> <button id= ${nkey} class="delete" onclick="deletefunc(this.id)">Delete</button></div>
  <br>
  <div class="commentdiv" style="display: none"><input type="text" class="commentinput"placeholder="Comment..."><input class="commentbutton" type="button" value="Post Comment"></div>
  <p class="showcomments" onclick="showcommentfunc(this)">Show Comments</p>
  `;

  // Append the comming posts div on the main page (index.html)
  postdiv.appendChild(dbdiv);
  postdiv.insertBefore(dbdiv, postdiv.childNodes[0]);
  // console.log("DB IMG URL IS: " + dbimgurl);
  var adminuid = "1fip9MGQfDhLwllFEceZRkT1fdO2";
  if (dbuid == adminuid) {
    document.getElementById("admin").style.display = "inline-block";
  }
  if (dbimgurl != "" && dbimgurl != undefined) {
    // Check for image
    var str = dbimgurl;
    // var ext = [".jpg", ".jpeg", ".png", ".gif", ".JPG", ".JPEG", ".PNG", ".GIF"];
    var ext = ["%2Bmyimage"];
    var checkimg = false;
    for (var i = 0; i < ext.length; i++) {
      if (str.indexOf(ext[i]) !== -1) {
        checkimg = true;
        break;
      }
    }
    // console.log("DB img url contains image:" + checkimg);


    // Check for video
    // var videotxt = [".mp4", ".3gp", ".ogg", ".MP4", ".3GP", ".OGG"];
    var videotxt = ["%2Bmyvid"];
    var checkvid = false;
    for (var j = 0; j < videotxt.length; j++) {
      if (str.indexOf(videotxt[j]) !== -1) {
        checkvid = true;
        break;
      }
    }
    // console.log("DB img url contains video:" + checkvid);



    if (checkimg == true) {
      // console.log("Displaying image now...");
      document.getElementById('dbimage').src = dbimgurl;
      document.getElementById('dbvid').style.display = "none";
      document.getElementById('dbimage').style.display = "block";
    }

    else if (checkvid == true) {
      // console.log("Displaying video now...");
      document.getElementById('dbvid').src = dbimgurl;
      document.getElementById('dbimage').style.display = "none";
      document.getElementById('dbvid').style.display = "block";
    }
    document.getElementById('mybr').style.display = "none";
  }

  else {
    document.getElementById('dbimage').style.display = "none";
    document.getElementById('dbvid').style.display = "none";
    document.getElementById('mybr').style.display = "block";
  }
  var adminuid = "1fip9MGQfDhLwllFEceZRkT1fdO2";
  if (dbuid == uid || uid == adminuid) {
    document.getElementById(`${nkey}`).style.display = "inline-block";
  }
  else {
    document.getElementById(`${nkey}`).style.display = "none";
  }
});


// On new user registration, show it on the index.html page (in the sidebar as happens in most forms)
var newusercontainer = document.getElementById("newusercontainer");
userinfoRef.on('child_added', snap => {
  var { UserName, UserEmail, UserPassword, UserID } = snap.val();
  console.log(UserName, UserEmail, UserPassword, UserID);
  var userweldiv = document.createElement("div");
  userweldiv.className = "userweldiv";
  userweldiv.innerHTML = `<h3>New User</h3> <p>${UserName} has just joined</p>`;
  newusercontainer.appendChild(userweldiv);
  newusercontainer.insertBefore(userweldiv, postdiv.childNodes[0]);

});





let i;
function likefunc(_this) {
  if (i == 0 || i == undefined) {
    console.log(i);
    i = 1;
    _this.style.cssText = "background: green; color: white; border: green;";
    console.log(i);
  }
  else if (i == 1) {
    i = 0;
    console.log(i);
    _this.style.cssText = "background: white; color: black; border: white;";
  }
}


// Only the user that have posted the post will be able to delete it
function deletefunc(id) {
  if (confirm("Do You really want to delete this post?")) {
    var removeRef = firebase.database().ref(`msgs/${id}`);
    removeRef.remove()
      .then(function () {
        console.log("Remove succeeded.");
      })
      .catch(function (error) {
        console.log("Remove failed: " + error.message);
      });
    location.reload();
  }
  else {
    alert("You cancelled the deletion. Nice decision Man!");
  }
}


function gpfunc() {
  window.open("studentgradecalculculator/gpcal.html");
}


// Comment function (Not yet completed)
function showcommentfunc(_this) {
  console.log("clicked");
  _this.style.display = "none";
  _this.previousElementSibling.style.display = "block";
}
window.onload = function () {
  alert("You can now calculate your 2nd semester GPA by clicking on the 'GPA Calculator!' button");
}