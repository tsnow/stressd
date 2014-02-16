package server

import (
	ws "code.google.com/p/go.net/websocket"
	"log"
	"net/http"
	"stressd/config"
)

const MAX_EVENTS_QUEUED = 32

var EventChannel = make(chan interface{}, MAX_EVENTS_QUEUED)
var deactivateChannel = make(chan *ws.Conn)
var connections = make(map[*ws.Conn]string)

func StartWebsocketServer() {
	go handleDisconnects()

	http.Handle("/events", ws.Handler(websocketHandler))
	log.Print("starting websocket server at ", config.Config.WebsocketAddress, ":", config.Config.WebsocketPort)
	if err := http.ListenAndServe(config.Config.WebsocketAddress+":"+config.Config.WebsocketPort, nil); err != nil {
		log.Fatal("failed to start websocket: ", err)
	}
}

func handleDisconnects() {
	for {
		select {
		case conn := <-deactivateChannel:
			log.Print(conn.RemoteAddr(), " disconnected")
			conn.Close()
			delete(connections, conn)
		}
	}
}


type stressPlanMsg struct {
	Key string `json:"key"`
}

type stressResponseMsg struct {
	Key string `json:"key"`
}

func websocketHandler(sock *ws.Conn) {
	log.Print(sock.RemoteAddr(), " connected")
	connections[sock] = sock.RemoteAddr().String()

	var plan stressPlanMsg
	ws.JSON.Receive(sock, &plan)
	log.Print(plan, " received.")
	for {
		select {
		case res :=<- results:
			message := &stressResponseMsg{
				Key: "request_complete",
				Data: res,
			}
			log.Print(res, " sent in response.")
			if ws.Message.Send(sock, message) != nil {
				deactivateChannel <- sock
			}
		}		
	}
}
