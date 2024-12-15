from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"])

class RoomRequest(BaseModel):
    room_id: str

class RoomConnectionManager:
    def __init__(self, room_id: str):
        self.room_id = room_id
        self.active_connections: list[WebSocket] = []
        self.active_users: list[str] = []

    def get_id(self):
        return self.room_id
    
    def get_active_connections(self):
        return self.active_connections
    
    async def connect(self, websocket: WebSocket, user: str):
        self.active_connections.append(websocket)
        message = f"{self.active_users} in the room." if len(self.active_users) > 0 else "No one in the room yet. Leaving the room will remove the room itself!!!"
        await websocket.send_text(message)
        self.active_users.append(user)
    
    async def disconnect(self, websocket: WebSocket, user: str):
        self.active_connections.remove(websocket)
        self.active_users.remove(user)
    
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

rooms = {}

@app.get("/")
async def get():
    with open('./index.html', 'rt') as rf:
        return HTMLResponse(rf.read())

@app.websocket("/ws/{room_id}/{username}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, username: str):
    await websocket.accept()
    if room_id not in rooms:
        await websocket.send_text(f"Room {room_id} not exist, please create room before enter.")
    else:
        manager: RoomConnectionManager = rooms[room_id]
        
        try:
            await manager.connect(websocket, username)
            await manager.broadcast(f"{username} joined.")

            while True:
                data = await websocket.receive_text()
                await manager.broadcast(f"{username}: {data}")
        except WebSocketDisconnect:
            await manager.disconnect(websocket, username)
            await manager.broadcast(f"{username} left.")
            if len(manager.active_connections) == 0:
                rooms.pop(room_id)


@app.get("/rooms/", status_code=200)
async def get_rooms():
    return {"rooms":[key for key,_ in rooms.items()]}

@app.post("/rooms/", status_code=201)
async def create_room(request: RoomRequest):
    if request.room_id in rooms:
        return JSONResponse(
        status_code=409,
        content={"message": f"Room {request.room_id} already exists."})
    rooms[request.room_id] = RoomConnectionManager(request.room_id)
    return {"room_id": request.room_id}

@app.delete("/rooms/", status_code=204)
async def remove_room(request: RoomRequest):
    if request.room_id not in rooms:
        return JSONResponse(
        status_code=400,
        content={"message": f"Room {request.room_id} not exist."})
    if len(rooms[request.room_id].get_active_connections()) > 0:
        return JSONResponse(
        status_code=400,
        content={"message": f"Room {request.room_id} is not empty."})
    del rooms[request.room_id]
