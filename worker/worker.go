package worker

import (
	"sync"
)

// Worker provides the interface for the HTTP endpoint that
// be under stress test, and holds a Response instance for
// reporting to the UI.
type Worker struct {
	Url      string
	Method   string
	Headers  string
	Body     string
	Response *Response
	wg       *sync.WaitGroup
}

// Response provides the interface for the result of the HTTP
// request and gets stored in the Worker instance.
type Response struct {
	Status  int
	Headers string
	Body    string
}

// NewWorker accepts information about the HTTP endpoint to test
// and returns a configured Worker.
func NewWorker(url, method, headers, body string, wg *sync.WaitGroup) *Worker {
	return &Worker{
		Url:     url,
		Method:  method,
		Headers: headers,
		Body:    body,
		wg:      wg,
	}
}

// NewResponse accepts information about the result of the HTTP request
// that was made and returns a configured Response.
func NewResponse(status int, headers, body string) *Response {
	return &Response{
		Status:  status,
		Headers: headers,
		Body:    body,
	}
}

// Execute makes the HTTP request to the endpoint configured in the
// Worker. It will create a Response via NewResponse and will decrement
// the WorkerPool's waitGroup count.
func (worker *Worker) Execute() {
	// TODO: request all the things
	worker.wg.Done()
}
