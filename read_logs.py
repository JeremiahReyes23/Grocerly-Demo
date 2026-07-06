import json
import os
transcript_path = r'C:\Users\jirar\.gemini\antigravity-ide\brain\4d1d9fa0-0004-4a87-ae38-13d6cb14d0f6\.system_generated\logs\transcript.jsonl'
if os.path.exists(transcript_path):
    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            try:
                obj = json.loads(line)
                # Look for tool outputs
                if obj.get('type') == 'PLANNER_RESPONSE':
                    tool_calls = obj.get('tool_calls', [])
                    for tc in tool_calls:
                        if tc.get('name') == 'capture_browser_console_logs':
                            print("=== Capture Console Logs Call ===")
                            print(json.dumps(tc.get('arguments'), indent=2))
                if obj.get('type') == 'SYSTEM_RESPONSE' or 'console' in str(obj):
                    content = obj.get('content', '')
                    if content and ('console' in content.lower() or 'log' in content.lower()):
                        print("=== Content containing console ===")
                        print(content[:1500])
            except Exception as e:
                pass
else:
    print("Transcript not found at", transcript_path)
