let currentuser = sifan;
let admin = currentuser === "sifan" ? true : false;
if (admin) {
  console.log("welcome admin");
} else {
  console.log("welcome user");
}
