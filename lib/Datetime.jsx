// Datetime and formatting functions
//Most up to date versions can always be found at: https://github.com/LearnCodeWithH/indesign-scripts/

function zeroPad(num, pad_to_length) { 
   num = num.toString(); 
   while (num.length < pad_to_length) {
	   num = '0' + num; 
   }
   return num; 
}

function datetimeString(date) {
	return dateString(date) + "_" + timeString(date);
}

function timeString(date){
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var hours = date.getHours();
	if (hours > 12) hours = hours - 12;
	if (hours == 0) hours = 12;

	var amOrPm = "AM";
	if (hours > 11) amOrPm = "PM";

	todaysTime = [
		zeroPad(hours, 2),
		zeroPad(minutes, 2),
		zeroPad(seconds, 2) + amOrPm
	].join('-');

	return todaysTime;
}

function dateString(date){
	var day  = date.getDate();
	var month = date.getMonth() + 1;
	var yy = date.getYear();
	var year = (yy < 1000) ? yy + 1900 : yy;

	todaysDate = [
		year.toString(), 
		zeroPad(month, 2),
		zeroPad(day, 2)
		].join('-');
	return todaysDate;
}