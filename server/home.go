package server

import (
	"html/template"
	"net/http"
)

func Home(w http.ResponseWriter, req *http.Request) {
	t := template.Must(template.New("home").ParseFiles("server/html/layout.html", "server/html/home.html"))
	t.ExecuteTemplate(w, "layout", "Home")
}
