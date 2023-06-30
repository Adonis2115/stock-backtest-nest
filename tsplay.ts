function getDates(startDate: Date, endDate: Date) {
  var dateArray = [];
  var currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateArray.push(currentDate.toISOString().slice(0, 10));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

var startDate = new Date('2023-01-01');
var endDate = new Date('2023-01-02');

var allDates = getDates(startDate, endDate);
console.log(allDates);
