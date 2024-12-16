# Chat Room
This application serve as a Chat Room, which includes two parts, one part is a web app, another part is a server app. Web app is built as static web page with Next.js, available easily deploy to CDN network like cloudfront holding in S3. Server app is built with FastAPI can be dockerized. The app not consider holding chat room history data, but can be expanded if needed.

# Start app
- open one terminal
```
cd webapp/server
python3 -m venv .venv && source .venv/bin/activate && pipenv install
fastapi dev main.py
```

- open a different terminal
```
cd webapp/app
npm install && npm run build && npx serve@latest out
```

# Run chat room
In browser open url http://localhost:3000

# Testing app
- You can either use different browser to open APP portal http://localhost:3000 
- OR you can use same browser, one tab open APP portal http://localhost:3000, another tab open testing portal http://localhost:8000
- app flow:
  - enter username used for connect
  - create a new chat room, room name for alphanumeric only with 15 chars limit
  - enter specific room for chat
  - you can remove room if it is empty, or auto remove if you are the last user for that room when you leave