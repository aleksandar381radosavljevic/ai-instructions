# 0017. The .NET Web API stack

- Status: Accepted
- Date: 2026-10-29

## Context
.NET Web API is the supported backend stack (decision 0013). Its framework version, architecture, data access and testing are decided once here. Versions on NuGet as of 29 October 2026: .NET 10.0.14 (LTS, supported until November 2028; .NET 11 is at RC3 and will be a shorter-lived STS release), EF Core 10.0.14, `Npgsql.EntityFrameworkCore.PostgreSQL` 10.0.3, `xunit.v3` 4.0.2, TUnit 1.76.45, NUnit 5.0.0, `Testcontainers.PostgreSql` 4.16.0, `Scalar.AspNetCore` 2.18.5. MediatR (since v13) and FluentAssertions (since v8) need commercial licenses.

Defaults that weren't contested: .NET 10 LTS with nullable reference types and warnings as errors; `dotnet format` with `.editorconfig`; built-in OpenAPI with Scalar; ProblemDetails for errors; data annotations instead of FluentValidation; no mediator library; integration tests through `WebApplicationFactory` and Testcontainers.

## Options
**Code organization**
1. **Vertical slices on Minimal APIs, one project**: a feature's endpoint, contracts and logic live together; split into more projects only when the code asks for it.
2. **Clean Architecture** (Domain, Application, Infrastructure, Api) with controllers: strict boundaries, a lot of ceremony per change.
3. **Layered single project** (Controllers, Services, Repositories): familiar, but one feature is spread over three folders.

**Database and data access**
1. **EF Core + PostgreSQL**: migrations and LINQ, no license cost, runs in Testcontainers.
2. **EF Core + SQL Server**: best Microsoft tooling, license cost beyond Express and Developer.
3. **Dapper + PostgreSQL**: full SQL control; migrations and mapping by hand.

**Test framework**
1. **xUnit v3**: the most widely used, with the most examples and agent familiarity.
2. **TUnit**: source-generated and fast, younger, fewer examples.
3. **NUnit 5**: mature, less common in new .NET projects.

## Decision
Organization 3 (layered single project with controllers), data 1, tests 1, chosen by the owner on 2026-10-30. Vertical slices were recommended for organization; the owner chose layers.

## Why
Layers with controllers are the structure most .NET developers already know, so a new contributor or agent finds code where they expect it, and the service and repository interfaces give clear seams for unit tests. The cost is that one change touches three folders; keeping controllers thin and repositories specific to an aggregate (no generic `IRepository<T>`) keeps that cost down. EF Core covers most needs without hand-written SQL, and PostgreSQL costs nothing and runs the same in tests and production. xUnit's value here is being the ecosystem default: the most examples and the fewest agent mistakes.

## Consequences
- `rules/stacks/dotnet.md` holds these rules; `init` adds the layer when it finds a `Microsoft.NET.Sdk.Web` project in the root or up to two folders down.
- If a feature's change routinely spans many files across the layers, revisit vertical slices (option 1).
- `new-project`, `test-plan` and `qa-check` gain `references/dotnet.md`; `new-component` and `design/osnova` don't apply to APIs.
- Endpoint tests run against a real PostgreSQL container, never the EF in-memory provider, so CI needs Docker.
- Revisit .NET 12 LTS when it ships (November 2027).
