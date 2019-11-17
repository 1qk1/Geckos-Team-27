/*
  Catch Errors Handler
  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

const catchErrors = fn => (req, res, next) => fn(req, res, next).catch(next);

/*
  format date 
*/
const formatDate = date => {
  let month = date.toString().slice(4, 7);
  month = monthToNum(month);
  const day = date.toString().slice(8, 10);
  const year = date.toString().slice(11, 15);
  return month + day + year;
};

function monthToNum(month) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const index = monthNames.indexOf(month);
  return index + 1;
}

/*
  getPingInterval()
    get interval to ping the heroku app so server doesn't sleep
    leave 8 hours in the night to sleep because it's not needed
    to be awake at that time
*/
function getPingInterval() {
  const hoursNow = new Date().getUTCHours();
  if (hoursNow >= 12 || hoursNow <= 8) {
    return 28800000;
  } else {
    return (Math.floor(Math.random() * 14) + 10) * 60000;
  }
}

/*
  Array to Object fn()
  @param: array & string 'keyField'
    example: take an array such as...
  const Array = [
    { id: 123, name: "T'Challa", age: 23 },
    { id: 456, name: "Thor", age: 1000 },
  ]
    and convert it to....
  const Object = {
    "123": { id: 123, name: "T'Challa", age: 23 },
    "456": { id: 456, name: "Thor", age: 1000 },
  }
  p.s: immutable. doesn't mutate the array param. 
*/
const arrayToObject = (array, keyField) =>
  array.reduce((soFar, row) => ({ ...soFar, ...{ [row[keyField]]: row } }), {});

module.exports = {
  arrayToObject,
  formatDate,
  catchErrors,
  getPingInterval
};
