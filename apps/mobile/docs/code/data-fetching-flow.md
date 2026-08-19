# Data flow

This doc describes how the data flows from the backend to the frontend and into UI components, and how errors are handled on the way.

## High-level overview

Inside the `data` folder there are folders grouped by domains (for example `auth`, `user`, `flowers`, ...). Each of these domains has the following files:

- `<domain>.models.ts`: Here is where we define zod models (schemas). These schemas will later be used to:
  - ensure type-safety when we fetch the API by parsing the response data
  - validate forms before sending data to the API
  - TS types for DTOs will be generated and exported from here as well
- `<domain>.api.ts`: Here is where we define API endpoints that a given domain will use. Note that this file doesn't handle API state or anything - it sole purpose is to have the API interface for the domain defined.
- `<domain>.queries.ts`: Here is where we define queries/mutation using `@tanstack/react-query`. These hooks will later be consumed by components fetching/submitting data.

## Caching

Tanstack Query uses a concept of Query Caching with Keys. We define keys in the `data/<domain>/<domain>.queries.ts`

## Template instructions

Delete this section after you've read through the doc.
