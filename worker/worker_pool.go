package worker

import (
	"sync"
)

// WorkerPool provides the interface for interacting with
// workers before, during and after stress tests. It's the
// type that upstream code should be working with most of the time.
type WorkerPool struct {
	NumberOfRequests int
	Workers          []*Worker
	wg               sync.WaitGroup
}

// NewWorkerPool accepts the concurrency settings, as well as
// information about the HTTP request to be made. It returns a
// configured WorkerPool struct.
func NewWorkerPool(numberOfRequests, numberOfWorkers int, url, method, headers, body string) *WorkerPool {
	pool := &WorkerPool{
		NumberOfRequests: numberOfRequests,
		Workers:          make([]*Worker, numberOfWorkers),
	}
	for i := 0; i < numberOfWorkers; i++ {
		pool.wg.Add(1)
		pool.Workers[i] = NewWorker(numberOfRequests, url, method, headers, body, &pool.wg)
	}
	return pool
}

// Stress iterates the set of workers and executes each of them
// inside a goroutine; it then blocks until the waitGroup count
// is decremented to 0.
func (pool *WorkerPool) Stress() {
	for i := range pool.Workers {
		go pool.Workers[i].Execute()
	}
	pool.wg.Wait()
}
