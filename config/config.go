package config

const VERSION = "0.0.1"

type config struct {
	Environment      string
	HelpRequested    bool
	Address          string
	Port             string
	WebsocketAddress string
	WebsocketPort    string
}

func New() *config {
	return new(config)
}

var Config *config
