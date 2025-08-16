# Stage 1: Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5298
EXPOSE 443
ENV ASPNETCORE_URLS=http://+:5298

# Stage 2: Build image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG configuration=Release
WORKDIR /src

# Copy project file and restore as distinct layers
COPY ["Net9WebSite.csproj", "./"]
RUN dotnet restore "Net9WebSite.csproj"

# Copy the rest of the source code
COPY . .

# Build the application
RUN dotnet build "Net9WebSite.csproj" -c $configuration -o /app/build

# Stage 3: Publish image
FROM build AS publish
RUN dotnet publish "Net9WebSite.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

# Stage 4: Final image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Net9WebSite.dll"]
