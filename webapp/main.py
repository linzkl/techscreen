from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse

app = FastAPI()

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <div>
            <label>Username: <input type="text" id="username" autocomplete="off"/></label>
            <button onclick="connect(event)">Connect</button>
            <button onclick="disconnect(event)">Disconnect</button>
        </div>
        <h2>Username: <span id="usernameLabel"></span></h2>
        
        <form action="" onsubmit="sendMessage(event)">
            <label>message: <input type="text" id="messageText" autocomplete="off"/></label>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = null;
            var usernameLabel = document.getElementById("usernameLabel")
            var username = document.getElementById("username")
            var messages = document.getElementById('messages')
            var messageInput = document.getElementById("messageText")

            function connect(event) {
                usernameLabel.textContent = username.value;
                ws = new WebSocket(`ws://localhost:8000/ws/${username.value}`);
                ws.onmessage = function(event) {
                    var message = document.createElement('li')
                    var content = document.createTextNode(event.data)
                    message.appendChild(content)
                    messages.appendChild(message)
                };
            }

            function disconnect(event) {
                if (ws != null && ws.readyState == WebSocket.OPEN) {
                    ws.close()
                    var message = document.createElement('li')
                    var content = document.createTextNode(username.value + " diconnected.")
                    message.appendChild(content)
                    messages.appendChild(message)
                    username.value = ""
                    usernameLabel.textContent = ""
                }
            }
            
            function sendMessage(event) {
                if (ws != null && ws.readyState == WebSocket.OPEN) {
                    ws.send(messageInput.value)
                } else {
                    var message = document.createElement('li')
                    var content = document.createTextNode("You are not connected. Please connect before sending message.")
                    message.appendChild(content)
                    messages.appendChild(message)
                }
                messageInput.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.get("/")
async def get():
    return HTMLResponse(html)

@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    await manager.connect(websocket)
    await manager.broadcast(f"{username} joined.")
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"{username}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"{username} left.")