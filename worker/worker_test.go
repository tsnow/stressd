package worker

import (
	. "github.com/smartystreets/goconvey/convey"
	"sync"
	"testing"
)

func TestWorker(t *testing.T) {
	Convey("Subject: stressd worker", t, func() {
		var worker *Worker
		var wg sync.WaitGroup

		Convey("Given a worker", func() {
			worker = NewWorker(5, "http://www.example.com", "GET", "", "", &wg)

			Convey("The worker should be properly configured", func() {
				So(worker.Url, ShouldEqual, "http://www.example.com")
				So(worker.Method, ShouldEqual, "GET")
				So(worker.Headers, ShouldEqual, "")
				So(worker.Body, ShouldEqual, "")
			})
		})
	})
}
