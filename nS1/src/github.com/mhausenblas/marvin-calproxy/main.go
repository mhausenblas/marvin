package main

import (
	"encoding/json"
	"fmt"
	ics "github.com/PuloV/ics-golang"
	log "github.com/Sirupsen/logrus"
	"net/http"
	"os"
	"strings"
	"time"
)

const (
	VERSION         string = "0.4.0"
	DEFAULT_CAL_URL string = "https://calendar.google.com/calendar/ical/r5sj91351jcgb0gul5h0tvou7o%40group.calendar.google.com/public/basic.ics"
	DAY_PARAM       string = "date"
)

var (
	mux    *http.ServeMux
	forcal string
)

type CalProxyResult struct {
	Title      string    `json:"title"`
	Eventstart time.Time `json:"start"`
	Eventend   time.Time `json:"end"`
	Location   string    `json:"loc"`
}

func sanitize(loc string) string {
	return strings.Replace(loc, "\\", " ", -1)
}

func main() {
	mux = http.NewServeMux()
	forcal = DEFAULT_CAL_URL
	if fc := os.Getenv("MARVIN_CAL_URL"); fc != "" {
		forcal = fc
	}
	fmt.Printf("This is the MARVIN nanoservice [Calendar Proxy] in version %s listening on port 9999\n", VERSION)
	fmt.Printf("Proxying calendar:\n%s\n", forcal)
	parser := ics.New()

	mux.HandleFunc("/sync", func(w http.ResponseWriter, r *http.Request) {
		parser = ics.New()
		inputChan := parser.GetInputChan()
		inputChan <- DEFAULT_CAL_URL
		parser.Wait()
		log.WithFields(log.Fields{"handle": "/sync"}).Info("Parsing calendar data done")
		time.Sleep(time.Second * 1) // wait a bit for parsing to finish
		cal, err := parser.GetCalendars()
		if err == nil {
			for _, calendar := range cal {
				log.WithFields(log.Fields{"handle": "/sync"}).Info("Got data from ", calendar.GetName(), " with ", len(calendar.GetEvents()), " events")
			}
		} else {
			log.WithFields(log.Fields{"handle": "/sync"}).Error("Can't parse calendar due to ", err)
		}
	})

	mux.HandleFunc("/events", func(w http.ResponseWriter, r *http.Request) {
		cal, err := parser.GetCalendars()
		if err == nil {
			day := r.URL.Query().Get(DAY_PARAM)
			log.WithFields(log.Fields{"handle": "/events"}).Info("Got day param ", day)
			t, errp := time.Parse("2006-01-02", day)
			if errp == nil {
				log.WithFields(log.Fields{"handle": "/events"}).Info("Looking up events for ", t)
				eres := []CalProxyResult{}
				for _, calendar := range cal {
					eventsForDay, _ := calendar.GetEventsByDate(t)
					log.WithFields(log.Fields{"handle": "/events"}).Info("Got ", len(eventsForDay), " event(s)")
					w.Header().Set("Content-Type", "application/javascript")
					for _, e := range eventsForDay {
						c := &CalProxyResult{
							Title:      e.GetSummary(),
							Eventstart: e.GetStart(),
							Eventend:   e.GetEnd(),
							Location:   sanitize(e.GetLocation()),
						}
						eres = append(eres, *c)
					}
				}
				eresj, _ := json.Marshal(eres)
				fmt.Fprint(w, string(eresj))
			} else {
				log.WithFields(log.Fields{"handle": "/events"}).Error("Can't parse day due to ", errp)
			}
		}
	})

	log.Fatal(http.ListenAndServe(":9999", mux))
}
