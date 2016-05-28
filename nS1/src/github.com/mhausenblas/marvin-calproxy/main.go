package main

import (
	"fmt"
	ics "github.com/PuloV/ics-golang"
	"time"
)

func main() {
	parser := ics.New()
	inputChan := parser.GetInputChan()
	inputChan <- "https://calendar.google.com/calendar/ical/r5sj91351jcgb0gul5h0tvou7o%40group.calendar.google.com/public/basic.ics"
	parser.Wait()
	cal, err := parser.GetCalendars()
	if err == nil {
		t, _ := time.Parse(ics.YmdHis, "2016-05-31 00:00:00")
		for _, calendar := range cal {
			fmt.Println(calendar.GetName(), calendar.GetDesc())
			eventsForDay, _ := calendar.GetEventsByDate(t)
			for i, event := range eventsForDay {
				fmt.Printf("№%d  %s \n", i, event)
			}
		}
	}
}
