---
name: 'Modal-Event'
description: Modal event will add and update any event in system related from the user
model: sonnet
tools: Read, Glob, Grep, Bash, Write
---

## Introduction

This feature has a goal to create a modal/dialog for add and update event in our system.

## Requirements 

This modal need to contais all fields from backend like below:
```
typescript 

location: @/types/api.p.ts

export type CalendarEvent = {
    id: string | number;
    title: string;
    start: Date | string; // "YYYY-MM-DD" or ISO datetime or Date
    amount: number;
    type: 'debit' | 'credit';
};
```
***fields requirements***:
Title : required, min(1) and max(255)
start : required, cannot be future date
amount: number, bigger than 0,
type: required

*** Api ***
To add new event need to make a Http request using the @/api/calendar.ts

Once send the request to API, needs to disable the button and add spinning in the button indicate loading

- Add new event endpoint:
    - Post to /api/v1/calendar-events using CalendarEvent
- Update event endpoint:
    - Put to /api/v1/calendar-events/:id using CalendarEvent

Output: 
    -Post:
        - status code: 201
        - response: `{ data: CalendarEvent }`
    -Put:
        - status code: 200
        - response: `{ data: CalendarEvent }`

*** Responses ***

Good Response:
    - display a toast with good message for the user 

Bad Response: 
    - Display a toast message with erro when tried to add the event

Validation:
    - If one or more fields did not fill corrected, display error with critiria of the field below themselves

*** components to implement ***

TopbarWidget.vue

CalendarSummary.vue

## Accepted Criteria

- Happy Path: Open the modal then fill up all the fields then submit then happy message from toast 
- Error: Open the modal then fill up then to api and return error (500) then display error for use to try later
- Validation error from API: Fill up the modal but some criaterial changed in the backend and front is not update will return message from backend with fields with errors
- Stopped middle to add: Open the modal and fill up some fields and try to close, display a message "Are you sure want to discards these changes"


## Tests

modal unit test:

[] Iniliaze the component if works
[] try to add event without requiments field
[] simulate error in api and display toast
[] error in validation from api
[] happy path and added and toast display
[] disable button when send request to API

if identify more scenarios add here

toptool bar :

[] click on the icon and display the component 
[] click on the icon and failed display a message on toast
[] verify if the icon exist

CalendarSummary:

[] click on the  button and display the component 
[] click on the button and failed display a message on toast
[] verify if the button exist


## Design

explore uikits inside the project and use tailwind and prime to create this modal

## Skills

use vue-best-pratices
use vivint-vue-vistest
use vue-pinia-best-practices

## Rules

[] After all development run unit tests need to passes based on Accepted Criteria, Test and Requirements
[] make a code view using agent called: senior-reviewer
[] format all documents changed based on lint

