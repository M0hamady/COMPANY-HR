export function calculateDaysToCurrentDate(dateString: string |any): number {
    const currentDate: Date = new Date(); // Get the current date
    const targetDate: Date = new Date(dateString); // Create a Date object from the target date string
  
    // Calculate the difference in milliseconds between the target date and the current date
    const timeDifference: number = currentDate.getTime() - targetDate.getTime();
  
    // Calculate the number of days by dividing the time difference by the number of milliseconds in a day
    const daysDifference: number = Math.floor(timeDifference / (1000 * 3600 * 24));
  
    return daysDifference;
  }