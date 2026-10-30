# .NET Web API

Decision 0017 in ai-instructions. Rule layer: `stacks/dotnet`.

1. Check the installed SDK with `dotnet --version`; it must be 10.x. If it isn't, stop and ask.
2. Create the solution and projects, checking current template options with `dotnet new <template> --help`:
   ```sh
   dotnet new sln -n <Name>                       # .slnx
   dotnet new webapi --use-controllers -n <Name>.Api -o src/<Name>.Api
   dotnet new xunit3 -n <Name>.Api.Tests -o tests/<Name>.Api.Tests
   dotnet sln add src/<Name>.Api tests/<Name>.Api.Tests
   ```
   If the `xunit3` template isn't installed, install `xunit.v3.templates` first.
3. Add a `Directory.Build.props` with `Nullable`, `TreatWarningsAsErrors` and `ImplicitUsings`, and an `.editorconfig`. Pin the SDK in `global.json`.
4. In the API: built-in OpenAPI plus `Scalar.AspNetCore` in development, `AddControllers` and `MapControllers`, `AddProblemDetails`, health checks at `/health`, and the folders from the rules (`Controllers/`, `Services/`, `Repositories/`, `Entities/`, `Contracts/`, `Data/`) with one sample resource going through all three layers.
5. EF Core with `Npgsql.EntityFrameworkCore.PostgreSQL`, a `DbContext`, the first migration, and a `compose.yaml` that runs PostgreSQL for local development. Connection strings come from user secrets or environment variables.
6. In the tests: `Microsoft.AspNetCore.Mvc.Testing` and `Testcontainers.PostgreSql`, with one passing test that calls `/health` through `WebApplicationFactory`.
7. Shared rules (needs Node on the machine):
   ```sh
   pnpm dlx github:aleksandar381radosavljevic/ai-instructions#<latest tag> init
   ```
   Expect `core` and `stacks/dotnet`. Done when `dotnet build`, `dotnet test` and `dotnet format --verify-no-changes` pass.
