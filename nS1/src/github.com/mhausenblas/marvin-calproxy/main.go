package main

import (
	"encoding/json"
	"fmt"
	ics "github.com/PuloV/ics-golang"
	log "github.com/Sirupsen/logrus"
	"net/http"
	"time"
)

const (
	VERSION         string = "0.1.0"
	DEFAULT_CAL_URL string = "https://calendar.google.com/calendar/ical/r5sj91351jcgb0gul5h0tvou7o%40group.calendar.google.com/public/basic.ics"
	DAY_PARAM       string = "date"
)

var (
	mux *http.ServeMux
)

type CalProxyResult struct {
	Timeframe time.Time `json:"tf"`
	Location  string    `json:"loc"`
}

func main() {
	log.SetLevel(log.DebugLevel)
	mux = http.NewServeMux()
	fmt.Printf("This is the MARVIN nanoservice [Calendar Proxy] in version %s\n", VERSION)
	parser := ics.New()
	inputChan := parser.GetInputChan()
	inputChan <- DEFAULT_CAL_URL
	parser.Wait()

	mux.HandleFunc("/events", func(w http.ResponseWriter, r *http.Request) {
		cal, err := parser.GetCalendars()
		if err == nil {
			day := r.URL.Query().Get(DAY_PARAM)
			log.WithFields(log.Fields{"handle": "/"}).Info("Got day param ", day)
			t, errp := time.Parse("2006-01-02", day)
			if errp == nil {
				log.WithFields(log.Fields{"handle": "/"}).Info("Looking up events for ", t)
				for _, calendar := range cal {
					eventsForDay, _ := calendar.GetEventsByDate(t)
					log.WithFields(log.Fields{"handle": "/"}).Info("Got ", len(eventsForDay), " event(s)")
					w.Header().Set("Content-Type", "application/javascript")
					for _, e := range eventsForDay {
						c := &CalProxyResult{
							Timeframe: e.GetStart(),
							Location:  e.GetLocation(),
						}
						cj, _ := json.Marshal(c)
						fmt.Fprint(w, string(cj))
					}
				}
			} else {
				log.WithFields(log.Fields{"handle": "/"}).Error("Can't parse day due to ", errp)
			}
		}
	})
	log.Fatal(http.ListenAndServe(":9999", mux))
}
