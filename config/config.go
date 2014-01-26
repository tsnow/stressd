package config

const VERSION = "0.0.1"

type config struct {
	Environment   string
	HelpRequested bool
}

func New() *config {
	return new(config)
}

var Config *config
