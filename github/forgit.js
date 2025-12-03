let currentuser = sifan;
let admin = currentuser === "sifan" ? true : false;
if (admin) {
  console.log("welcome admin");
} else {
  console.log("welcome user");
}


let access = admin ? "all access granted" : "limited access granted";
console.log(access);    

let role=admin? "admin": "user";
console.log(`you are logged in as ${role}`);


const handleLogin = (user) => {
  return user === "sifan" ? "admin" : "user";
}   if (handleLogin(currentuser) === "admin") {
  console.log("you have admin privileges");
} else {
  console.log("you have user privileges");
} 
const handleLogin = (user) => {
  return user === "sifan" ? "admin" : "user";
}   if (handleLogin(currentuser) === "admin") {
  console.log("you have admin privileges");
} else {
  console.log("you have user privileges");
} 
const handleLogin = (user) => {
  return user === "sifan" ? "admin" : "user";
}   if (handleLogin(currentuser) === "admin") {
  console.log("you have admin privileges");
} else {
  console.log("you have user privileges");
} 

const handleLogin = (user) => {
  return user === "sifan" ? "admin" : "user";
}
  if (handleLogin(currentuser) === "admin") {
  console.log("you have admin privileges");
} else {
  console.log("you have user privileges");
};
 if (handleLogin(currentuser) === "admin") {
  console.log("you have admin privileges");
} else {
  console.log("you have user privileges");
};