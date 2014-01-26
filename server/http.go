package server

import (
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"os"
	"stressd/config"
)

func StartHTTPServer() {
	log.Print("starting HTTP server at ", config.Config.Address, ":", config.Config.Port)

	// Route normal requests to the appropriate handlers
	m := mux.NewRouter()
	m.HandleFunc("/", Home).Methods("GET")

	// Route error requests accordingly
	m.NotFoundHandler = http.HandlerFunc(FileNotFound)

	// Serve various assets directly from the /server/* folders
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("server/css"))))
	http.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("server/images"))))
	http.Handle("/scripts/", http.StripPrefix("/scripts/", http.FileServer(http.Dir("server/scripts"))))
	http.Handle("/", m)

	if err := http.ListenAndServe(config.Config.Address+":"+config.Config.Port, nil); err != nil {
		log.Fatal("unable to start HTTP server;", err)
		os.Exit(1)
	}
}
