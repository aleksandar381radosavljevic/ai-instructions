### .NET Web API
- .NET 10 LTS, C# with `<Nullable>enable</Nullable>` and `<TreatWarningsAsErrors>true</TreatWarningsAsErrors>`. Format with `dotnet format` and the repo's `.editorconfig`; check with `dotnet build`, `dotnet test` and `dotnet format --verify-no-changes`.
- Minimal APIs organized as vertical slices: each feature lives in `Features/<Feature>/` with its endpoints, request and response records and logic, mapped through a `MapGroup` per feature. No controllers, and no MediatR or other mediator.
- Request and response types are records, never EF entities. Validate input with the built-in validation (`AddValidation`, data annotations); return errors as ProblemDetails with the right status code.
- Data access through EF Core with PostgreSQL (Npgsql); the `DbContext` is used directly in feature code, without a generic repository layer. Schema changes are EF migrations, committed with the code.
- `async` all the way with `CancellationToken` passed through; no `.Result` or `.Wait()`. Configuration through options classes; secrets never in `appsettings*.json`.
- Tests use xUnit v3. Endpoints are tested through `WebApplicationFactory` against a real PostgreSQL in Testcontainers, never an in-memory provider; unit tests only for logic with real branches.
