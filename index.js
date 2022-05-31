// IMPORT EXPRESS
const express = require("express"); // import express
const app = express(); // Create application express and asign to app variable
app.use(express.json()); // Use json file

// PORT ENVIRONMENT SETUP
let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("App listening on port " + port + "!");
});

// GET CURRENT WEEK
let date = new Date();
date.setUTCHours(0, 0, 0, 0); // set time at midnight
let day = date.getDay();
let arrDate = [];
for (let i = 0; i < 8; i++) {
  if (i - day != 0) {
    let days = i - day;
    let newDate = new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
    arrDate.push(newDate);
  } else arrDate.push(date);
}

let sun = arrDate[0];
let mon = arrDate[1];
let tue = arrDate[2];
let wed = arrDate[3];
let thur = arrDate[4];
let fri = arrDate[5];
let sat = arrDate[6];
let nextSun = arrDate[7];

// create rewards array object
let rewards = [
  {
    id: 1,
    data: [
      {
        availableAt: sun,
        redeemedAt: null,
        expiresAt: mon,
      },
      {
        availableAt: mon,
        redeemedAt: null,
        expiresAt: tue,
      },
      {
        availableAt: tue,
        redeemedAt: null,
        expiresAt: wed,
      },
      {
        availableAt: wed,
        redeemedAt: null,
        expiresAt: thur,
      },
      {
        availableAt: thur,
        redeemedAt: null,
        expiresAt: fri,
      },
      {
        availableAt: fri,
        redeemedAt: null,
        expiresAt: sat,
      },
      {
        availableAt: sat,
        redeemedAt: null,
        expiresAt: nextSun,
      },
    ],
  },
];

// GET REWARDS BY USER ID AND DATE
app.get("/users/:id/rewards", (req, res) => {
  // Firstly, check if user id exsist or not
  const user = rewards.find((el) => el.id === parseInt(req.params.id));
  // If user id not exsist then show error message to user
  if (!user) return res.status(404).send("User not found");
  // Secondly, Check if date is expire or not
  const currDate = new Date(req.query.at);
  if (currDate < sun || currDate > sat)
    // If date was expired, then show error message to user
    return res.status(404).send("date is expired");
  // Thirdly, if user id is exsist and date is not expire then show data to user
  return res.send(user.data);
});

// UPDATE EXSIST USER INFORMATION
app.patch("/users/:id/rewards/:date/redeem", (req, res) => {
  // Firstly, check if user id exsist or not
  const user = rewards.find((x) => x.id === parseInt(req.params.id));
  // If user id not exsist then show error message to user
  if (!user) return res.status(404).send("User not found");
  const currDate = new Date(req.params.date);
  // Secondly, Check if date is expire or not
  if (currDate < sun || currDate > sat)
    // If date was expired, then show error message to user
    return res.status(404).send("This reward is already expired");
  // Thirdly, when user id is exsist and date is not expire, update infomation
  const userUpdate = user.data.find(
    (x) => currDate >= x.availableAt && currDate < x.expiresAt
  );
  userUpdate.redeemedAt = "current time";
  //Fourtly, show data to user after infomation is update
  return res.send(userUpdate);
});
