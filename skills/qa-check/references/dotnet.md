# .NET Web API

Decision 0017. Rule layer: `stacks/dotnet`.

- Start PostgreSQL (`docker compose up -d`), apply migrations, then run the API with `dotnet run --project src/<Name>.Api`.
- Explore through the OpenAPI document (`/openapi/v1.json`) and Scalar in development, and drive requests with `curl` or the project's `.http` files. Save the requests you send; they become the reproduction steps.
- For each endpoint in the charter: valid request, missing and invalid fields, wrong types, boundary values, duplicate submits, unknown ids, and the same call without and with the wrong credentials.
- Check that every error is ProblemDetails with a correct status code and no stack trace or internal detail in the body.
- Check list endpoints with empty and large data sets: paging, sorting, and that they don't return unbounded results.
- Watch the console logs while testing: unhandled exceptions, N+1 query patterns, and secrets or personal data in log lines are bugs.
- A scenario worth keeping becomes an endpoint test (`test-plan` skill).
