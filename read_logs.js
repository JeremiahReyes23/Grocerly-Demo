const fs = require('fs');
const path = require('path');
const transcriptPath = 'C:\\Users\\jirar\\.gemini\\antigravity-ide\\brain\\4d1d9fa0-0004-4a87-ae38-13d6cb14d0f6\\.system_generated\\logs\\transcript.jsonl';
if (fs.existsSync(transcriptPath)) {
  const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
  lines.forEach(line => {
    if (!line) return;
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          if (tc.name === 'capture_browser_console_logs') {
            console.log("=== Console Logs Call ===");
            console.log(JSON.stringify(tc.arguments));
          }
        });
      }
      if (obj.type === 'PLANNER_RESPONSE' && obj.content && obj.content.includes('console')) {
        console.log("=== Planner Response content ===");
        console.log(obj.content.substring(0, 1000));
      }
      // Also look for step response with console output
      if (obj.content && obj.content.includes('[') && (obj.content.includes('error') || obj.content.includes('Error'))) {
        console.log("=== Step content ===");
        console.log(obj.content.substring(0, 1000));
      }
    } catch (e) {}
  });
} else {
  console.log("Transcript not found at", transcriptPath);
}
