export const convertUrlsToLinks = (text: string): string => {
    // Regular expression to match URLs
    const urlPattern = /(https?:\/\/[^\s]+)/g;
  
    // Replace plain URLs with anchor tags
    return text.replace(urlPattern, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${url}</a>`;
    });
  };
  