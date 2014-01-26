package server

import (
	ws "code.google.com/p/go.net/websocket"
	"log"
	"net/http"
)

const MAX_EVENTS_QUEUED = 32

var EventChannel = make(chan interface{}, MAX_EVENTS_QUEUED)
var deactivateChannel = make(chan *ws.Conn)
var connections = make(map[*ws.Conn]string)

func Start() {
	go broadcast()

	http.Handle("/events", ws.Handler(websocketHandler))
	if err := http.ListenAndServe("0.0.0.0:8080", nil); err != nil {
		log.Fatal("failed to start websocket: ", err)
	}
}

func broadcast() {
	for {
		select {
		case message := <-EventChannel:
			go func() {
				for c := range connections {
					if ws.Message.Send(c, message) != nil {
						deactivateChannel <- c
					}
				}
			}()
		}
	}
}

func websocketHandler(sock *ws.Conn) {
	log.Print(sock.RemoteAddr(), " connected")
	connections[sock] = sock.RemoteAddr().String()

	for {
		select {
		case conn := <-deactivateChannel:
			log.Print(sock.RemoteAddr(), " disconnected")
			conn.Close()
			delete(connections, conn)
		}
	}
}
