export function extractNumberFromString(inputStr: string | any): number  {
    // Check if the input string is a number
    const numericValue = Number(inputStr);
    if (!isNaN(numericValue)) {
      return numericValue;
    }
  
    // Split the string by spaces
    const parts = inputStr.split(' ');
  
    // Iterate through the parts and try to convert them to numbers
    for (const part of parts) {
      try {
        // Try to convert the part to a number
        return parseFloat(part);
      } catch (e) {
        // If the conversion fails, move on to the next part
        continue;
      }
    }
  
    // If no number was found, return null
    return 0;
  }