## Introduction

I need to create a interface for the user can create a template for CSV, and it will return from API columns from CSV to make from -> to a object based own system, when we click to save we send a request to save the template our database

## requirements 


create a templateRouter.ts

template/:id
if does not have id, it will be new template.

new template work flow:
    -> upload csv file to send a request to POST: /api/v1/csv/mapped and PUT /api/v1/csv/mapped/:id -> for update
    -> it will return `` { columns: [ name: string, type: string]}``
        -> types only can be "string", "date", "number"
    -> we will need to map the object calendarEvent just the fields: startAt:date, amount: number, title: string
    -> need to give a name for this template
    -> for each field only can list columns which match type like startAt , only will list the dates data
    -> final object example: 
    ``` 
    {
        "name": string,
        "mappings": [
            { "from": "Date", "to": "startAt" },
            { "from": "Amount", "to": "amount" },
            { "from": "Description", "to": "title" },
        ]
    }
    ```

to save: send to /api/v1/csv/mapping
200: show a toast with success 
400: display the error on the screen as message
500: toast of error 
    
Add a button on ImportFile.vue to add new Template there
In ImportFile when list template- add a edit icon when you click redirect to edit template in /template/:id

## Accepted Criteria

- All the fields startAt:date, amount: number, title: string are required. make a validation
- list columns which match type like startAt , only will list the dates data
- To add new template button need to be ImportFile.vue
- updating template by edit button

## Design

Follow the prime designs

## Skills

vue-best-practices
vue-pinia-best-practices
vue-testing-best-practices

## Tests

- unit test for all requirements 201,400, and 500
- unit test from accepted criterias


## Rules
After execute the plan action, need to run lint, and test. when passed everything, the implementation will be done.
when its done run /init update claude.md and memory if necessary


