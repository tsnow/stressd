# Stressd
## A Raspberry Pi Load Testing Tool

![http://71.19.156.55/images/stressd.png](http://71.19.156.55/images/stressd.png)

### Getting Started

First, you'll need Go. Once you have that hotness, clone this and run `go get` from inside the project folder (if you haven't set up a Go workspace yet, so read the docs. It's important.)

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