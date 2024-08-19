const fs = require('fs');
const path = require('path');

// Generate random strings for titles and contents
function randomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Generate random tags
function randomTags() {
  const tags = ["html", "javascript", "css", "react", "vue", "angular", "json", "api", "node", "typescript"];
  const tagCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 tags
  const selectedTags = [];
  for (let i = 0; i < tagCount; i++) {
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    if (!selectedTags.includes(randomTag)) {
      selectedTags.push(randomTag);
    }
  }
  return selectedTags;
}

// Generate random timestamp
function randomTimestamp() {
  const start = new Date(2023, 0, 1); // January 1, 2023
  const end = new Date(2024, 8, 19); // December 31, 2024
  const timestamp = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return timestamp.toISOString();
}

// Generate test data
function generateTestData(num) {
  const data = [];
  for (let i = 0; i < num; i++) {
    const note = {
      content: randomString(Math.floor(Math.random() * 81) + 20), // 20 to 100 characters
      id: Date.now().toString() + i.toString().padStart(3, '0'), // Unique ID based on timestamp + index
      tags: randomTags(),
      timestamp: randomTimestamp(),
      title: randomString(Math.floor(Math.random() * 26) + 5) // 5 to 30 characters
    };
    data.push(note);
  }
  return data;
}

// Generate 1000 test data entries
const testData = generateTestData(10000);

// Save the data to a file
const filePath = path.join(__dirname, 'test_data_1000.json');
fs.writeFileSync(filePath, JSON.stringify(testData, null, 2), 'utf-8');

console.log(`Generated test data saved to ${filePath}`);
