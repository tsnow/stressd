# Stressd
## A Raspberry Pi Load Testing Tool

![http://71.19.156.55/images/stressd.png](http://71.19.156.55/images/stressd.png)

## Go stressd service

### Local Development

First, you'll need Go. Once you have that hotness, clone this and run `go get` from inside the project folder (if you haven't set up a Go workspace yet, go read the docs. It's important.)

If `go get` returns nothing, you're in good shape. If you don't have Mercurial installed and in your `PATH`, it'll complain about not being able to find `hg`. Install however you see fit.

After that, you can either `go build` and run the resulting executable, or `go run stressd.go` to build one in a temporary location.

```shell
$ go get
$ go run stressd.go
2014/01/26 10:03:03 stressd [ env: development - pid: 64722 - ver: 0.0.1 ]
2014/01/26 10:03:03 starting HTTP server at 0.0.0.0:9898
2014/01/26 10:03:03 starting websocket server at 0.0.0.0:9899
```

Checkout http://0.0.0.0:9898 for a bare-bones HTML form. All the goody bits still need to be written and wired, but there's a skeleton now.

### Tests

I added [GoConvey](http://smartystreets.github.io/goconvey/) to the project. It's got a nice websocket-backed web UI and so on for tests.

You can reach the web interface by running `$GOPATH/bin/goconvey` and then hitting http://localhost:8080/.

```shell
$ go get github.com/jacobsa/oglematchers
$ go get github.com/smartystreets/goconvey
$ $GOPATH/bin/goconvey
2014/01/26 17:56:20 goconvey.go:39: Initial configuration: [host: 127.0.0.1] [port: 8080] [poll 250ms]
2014/01/26 17:56:20 goconvey.go:80: Constructing components...
2014/01/26 17:56:20 watcher.go:30: Adjusting to watch new root: /Users/aharris/work/go/src/stressd/worker
2014/01/26 17:56:20 watcher.go:40: Including: /Users/aharris/work/go/src/stressd/worker
2014/01/26 17:56:20 tester.go:15: Now configured to test 10 packages concurrently.
2014/01/26 17:56:20 watcher.go:72: Number of watched folders: 1
2014/01/26 17:56:20 goconvey.go:72: Serving HTTP at: http://127.0.0.1:8080
2014/01/26 17:56:20 monitor.go:16: Engaging monitoring loop...
2014/01/26 17:56:20 scanner.go:31: Updating root in scanner: /Users/aharris/work/go/src/stressd/worker
2014/01/26 17:56:20 watcher.go:72: Number of watched folders: 1
2014/01/26 17:56:20 monitor.go:33: Preparing for test run (watching 1 folders)...
2014/01/26 17:56:20 executor.go:56: Executor status: 'executing'
2014/01/26 17:56:20 coordinator.go:37: Executing concurrent tests: stressd/worker
2014/01/26 17:56:20 executor.go:56: Executor status: 'parsing'
2014/01/26 17:56:20 parser.go:19: [passed]: stressd/worker
2014/01/26 17:56:20 executor.go:56: Executor status: 'idle'
2014/01/26 17:56:20 monitor.go:36: Test run complete, updating server with latest output...
2014/01/26 17:56:20 monitor.go:39: Server updated with 1 tested packages (revision: '2014-01-26 17:56:20.815924277 -0500 EST').
```

You can also just run tests like normal.

```shell
$ cd worker; go test
.

1 assertion thus far

....

5 assertions thus far

PASS
ok      stressd/worker  0.013s
```

### TODOs
