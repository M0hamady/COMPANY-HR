/**
 * Converts a date object to a string containing the day name and date and time in Arabic.
 * @param date - The date object or string to be converted.
 * @returns A string containing the day name and date and time in Arabic.
 */
function formatDateAndTimeArabic(date: Date | string): string {
    let dateObj: Date;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return 'Invalid date';
    }
  
    if (!isNaN(dateObj.getTime())) {
      const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const dayName = days[dateObj.getDay()];
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
  
      let hours = dateObj.getHours();
      const isPM = hours >= 12;
      hours = hours % 12 || 12; // Convert to 12-hour format
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const seconds = String(dateObj.getSeconds()).padStart(2, '0');
      const amPm = isPM ? 'م' : 'ص';
  
      return `${dayName}، ${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${amPm}`;
    } else {
      return 'Invalid date';
    }
  }
  
  export { formatDateAndTimeArabic };