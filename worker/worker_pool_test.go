package worker

import (
	. "github.com/smartystreets/goconvey/convey"
	"testing"
)

func TestWorkerPool(t *testing.T) {
	Convey("Subject: stressd worker pool", t, func() {
		var pool *WorkerPool
		var numberOfRequests, numberOfWorkers int

		Convey("Given a worker pool", func() {
			numberOfRequests, numberOfWorkers = 5, 5
			pool = NewWorkerPool(numberOfRequests, numberOfWorkers, "http://www.example.com", "GET", "", "")

			Convey("The pool should have the correct number of workers", func() {
				So(len(pool.Workers), ShouldEqual, numberOfWorkers)
			})
		})
	})
}
