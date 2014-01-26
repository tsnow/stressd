package main

import (
	"flag"
	"log"
	"os"
	"stressd/config"
	"stressd/server"
)

var conf = config.New()

func init() {
	flag.StringVar(&conf.Environment, "env", "development", "the runtime environment (production, test, etc.)")
	flag.BoolVar(&conf.HelpRequested, "help", conf.HelpRequested, "display this help information")
}

func parseArgs() {
	flag.Parse()
	if conf.HelpRequested {
		flag.Usage()
		os.Exit(1)
	}
	config.Config = conf
}

func main() {
	parseArgs()
	log.Println("stressd [ env:", conf.Environment, "- pid:", os.Getpid(), "- ver:", config.VERSION, "]")
	server.Start()
}
