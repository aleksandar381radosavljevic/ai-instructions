# .NET Web API

Decision 0017. Rule layer: `stacks/dotnet`.

| Level | Tool | Where |
|---|---|---|
| Unit | xUnit v3 | `tests/<Name>.Tests/`, only for logic with real branches (pricing, rules, parsing) |
| Endpoint (integration) | xUnit v3 + `WebApplicationFactory` + Testcontainers PostgreSQL | `tests/<Name>.Api.Tests/Features/<Feature>/` |
| External HTTP services | a fake `HttpMessageHandler` or WireMock.Net, wired through `ConfigureTestServices` | |

- Most risks in an API are caught cheapest at the endpoint level: send the HTTP request, assert on the status code, the response body and what ended up in the database.
- One PostgreSQL container per test run (an `IAsyncLifetime` fixture shared by the collection); isolate tests by creating their own data, or reset with Respawn between tests.
- Never use the EF Core in-memory provider or SQLite as a stand-in for PostgreSQL; they hide query and constraint behavior.
- Cover per endpoint: success, validation errors (400 with ProblemDetails), not found, conflicts, and authorization (401/403) when the endpoint is protected.
- Assert with xUnit's `Assert`; no FluentAssertions (commercial since v8).
- Pass `TestContext.Current.CancellationToken` to async calls, as xUnit v3 analyzers expect.
