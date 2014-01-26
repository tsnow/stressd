package ui

import (
	"html/template"
	"net/http"
)

func Home(w http.ResponseWriter, req *http.Request) {
	t := template.Must(template.New("home").ParseFiles("ui/html/layout.html", "ui/html/home.html"))
	t.ExecuteTemplate(w, "layout", "Home")
}
