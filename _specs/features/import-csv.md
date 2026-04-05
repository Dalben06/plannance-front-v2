## Introduction

we need to create a new page for the User, We are going to call 'Import' in the page the user can import files to register data in the system to be easier to storage data and follow ups

## requirements 

View: Import.vue
    - Need to control all parts of import components
        - components: 
            - default layout
            - importPendingTable
            - button to redirect to importRegister.vue
Components: 
    - ImportPendingTable:
        - this component will fetch information from the backend by the call: api/v1/csv/import that you return 
            - `` { data: [ {id: string, userId: string, errorLines: [], data: [{ id: string, title: string, start: date, amount: number, type: 'credit' | 'debit' }], createdAt: date, expiresAt: date }]}``
            - this table need to display number of registers, number of errors, createAt, and expiresAt: data
            - Click: redirect by id to the update import table -> step 2 in ImportRegister.vue
    - ImportRegister.vue
        - this component will need to create a flow following 3 steps: Import File, Check Info and fix, and Confirm import
        - each step will be a component:
            Step 1: ImportFile.vue
            Step 2: UpdateRecord.vue
            Step 3: ConfirmImportRecords.vue


## Accepted Criteria
    Import.vue
        - Only the user can se your pending register there
        - Need to have loading same as Calendar has (sckeleton)
        - Redirect for ImportRegister.vue page diferent Route

    ImportPendingTable.vue
        - This table only can show unexpired data for the user
        - order by createAt
        - make sure if click in the line redirect to ImportRegister.vue
    
    ImportRegister.vue
        - This page will be a Timeline contains 3 steps (Import, Check, and Confirm)
        - By the url needs to know which step you are.
        - if its new, first component does not have Id until go to the next step.

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


