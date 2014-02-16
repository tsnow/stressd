package worker

import (
	"sync"
	"time"
	"net/http"
	"strings"
)

// Worker provides the interface for the HTTP endpoint that
// be under stress test, and holds a Response instance for
// reporting to the UI.
type Worker struct {
	Url              string
	Method           string
	Headers          string
	Body             string
	Responses        []*Response
	NumberOfRequests int
	wg               *sync.WaitGroup
}

// Response provides the interface for the result of the HTTP
// request and gets stored in the Worker instance.
type Response struct {
	Status  int
	Headers string
	Body    string
	Start 	time.Time
	End 	time.Time
}

// NewWorker accepts information about the HTTP endpoint to test
// and returns a configured Worker.
func NewWorker(numberOfRequests int, url, method, headers, body string, wg *sync.WaitGroup) *Worker {
	return &Worker{
		Url:              url,
		Method:           method,
		Headers:          headers,
		Body:             body,
		NumberOfRequests: numberOfRequests,
		wg:               wg,
	}
}

// NewResponse accepts information about the result of the HTTP request
// that was made and returns a configured Response.
func NewResponse(status int, headers, body string, start time.Time) *Response {
	return &Response{
		Status:  status,
		Headers: headers,
		Body:    body,
		Start: start,
		End: time.Now(),
	}
}

func (worker *Worker) DoRequest() *Response {
	client := &http.Client{}
	req, err := http.NewRequest(worker.Method, worker.Url, strings.NewReader(worker.Body))
	start := time.Now()	
	resp, err := client.Do(req)
	if err != nil {
		//log.Fatal(err)
	}

	defer func() { resp.Body.Close() }()
	return NewResponse(resp.StatusCode, "", "", start) // resp.Header, ioutil.ReadAll(resp.Body)
}

// Execute makes the HTTP request to the endpoint configured in the
// Worker. It will create a Response via NewResponse and will decrement
// the WorkerPool's waitGroup count.
func (worker *Worker) Execute() {
	for i := 0; i < worker.NumberOfRequests; i++ {
		worker.Responses[i] = worker.DoRequest()
	}
	worker.wg.Done()
}
