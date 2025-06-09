package main

import (
	"fmt"
	"log"
	"net/http"

	"go get github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // allow all origins (adjust for prod)
	},
}

type Client struct {
	conn *websocket.Conn
	room string
}

var rooms = make(map[string][]*Client)

func wsHandler(w http.ResponseWriter, r *http.Request) {
	room := r.URL.Query().Get("room")
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	client := &Client{conn: conn, room: room}
	rooms[room] = append(rooms[room], client)
	defer conn.Close()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			break
		}
		for _, c := range rooms[room] {
			if c != client {
				c.conn.WriteMessage(websocket.TextMessage, msg)
			}
		}
	}
}

func main() {
	http.HandleFunc("/ws", wsHandler)
	fmt.Println("Go WebSocket server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
