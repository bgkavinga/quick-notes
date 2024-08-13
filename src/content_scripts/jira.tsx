import '@/content_scripts/styles.css'

const navElement = document.querySelector('nav');
// Define the pattern to search for using regex
const pattern = /E-\d{9}/g;
// Select the element with the specified ID
const container = document.getElementById('customfield_10802-val');

if (container) {
  // Extract the text content
  const textContent = container.textContent;

  // Use regex to find the pattern
  const match = textContent?.match(pattern)?.[0];

  if (match) {
    if (navElement) {
        // Create a new container element
        const container = document.createElement('div');
        container.className = 'custom-container';
      
        // Create a new button element
        const button = document.createElement('a');
        button.innerText = match;
        button.className = 'custom-button';
        button.href = `https://adobe-ent.crm.dynamics.com/main.aspx?appid=f2e74f34-7119-ea11-a811-000d3a5936c5&forceUCI=1&pagetype=search&searchText=${match}&searchType=0`;
        button.target = '_blank';
      
        // Append the button to the container
        container.appendChild(button);
      
        // Append the container to the nav element
        navElement.appendChild(container);
      }
  } else {
    console.log('No matches found.');
  }
} else {
  console.log('Container with ID field-customfield_10802 not found.');
}

