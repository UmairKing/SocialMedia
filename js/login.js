
document.getElementById('forminsert').innerHTML = document.getElementById('formlogin').innerHTML;

// Login/Sign Up Start
function signupinsertfunc() {
  document.getElementById('forminsert').innerHTML = document.getElementById('formsignup').innerHTML;
}

function logininsertfunc() {
  document.getElementById('forminsert').innerHTML = document.getElementById('formlogin').innerHTML;
}

function loginfunc() {
  console.log('login function is called');
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  // console.log(email);
  // console.log(password);
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    window.alert('Error :' + errorMessage);
  });
}

// var user;
var userinfoRef = firebase.database().ref("/userinfo");
console.log("Working");

var checker = false;
function signupfunc() {
  checker = true;
  console.log('Signup function is called');
  var email = document.getElementById('emailsignup').value;
  var password = document.getElementById('passwordsignup').value;
  var usernamesignup = document.getElementById('usernamesignup').value;

  var uphotourl = "https://firebasestorage.googleapis.com/v0/b/socialmedia-af41d.appspot.com/o/profilepic.png?alt=media&token=63129c06-7dfb-45b2-b897-4a247b737d0c";


  // Sign Up function
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(
      (user) => {
        var user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: usernamesignup,
          photoURL: uphotourl
        }).then(function (response) {
          var useridtodb = user.uid;
          var uinfo = {
            UserName: usernamesignup,
            UserEmail: email,
            UserPassword: password,
            UserID: useridtodb
          };
          userinfoRef.push(uinfo);
          window.open("index.html", "_self");
          //Success
          // console.log("User signed in");
        }, function (error) {
          //Error
          // console.log("User could not signed in due to following error");
          console.log(error);
        });
      }
    ).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      window.alert('Error: ' + errorMessage);
    });


}
// Login/SignUp end

// The following function will check for if the user have logged in
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    if (checker == true) {
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: usernamesignup,
        photoURL: uphotourl
      }).then(function (response) {
        window.open("index.html", "_self");
        //Success
        // console.log("User signed in");
      }, function (error) {
        //Error
        // console.log("User could not signed in due to following error");
        console.log(error);
      });
    }
    else {
      // User is signed in.
      window.open("index.html", "_self");
    }
  }
  else {
    alert("If you don't have an account and don't want to create a new account then use this email and password to login: email: client@gmail.com , password: client");
  }
});
