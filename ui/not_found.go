package ui

import (
	"html/template"
	"net/http"
)

func FileNotFound(w http.ResponseWriter, req *http.Request) {
	t := template.Must(template.New("404").ParseFiles("ui/html/layout.html", "ui/html/404.html"))
	t.ExecuteTemplate(w, "layout", "Whoops!")
}
