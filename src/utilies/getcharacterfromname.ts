export default function getInitials(name: string | null): string {
    if (!name) return '';
    
    // Check if the name is Arabic
    const isArabic = /[\u0600-\u06FF]/.test(name);
  
    if (isArabic) {
      // Split the name by space and return the second name if it exists
      const names = name.split(' ');
      return names.length > 1 ? names[1] : names[0];
    } else {
      // If not Arabic, proceed with the original logic
      let initials = name.charAt(0).toUpperCase();
      
      for (let i = 1; i < name.length; i++) {
        if (name[i] === name[i].toUpperCase() && name[i] !== ' ') {
          initials += name[i];
          break;
        }
      }
      
      return initials;
    }
  }
  