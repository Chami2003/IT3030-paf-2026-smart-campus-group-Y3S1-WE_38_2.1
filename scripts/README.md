# Backend runner (no Maven install)

If `mvn` is not recognized on your PC, you can still run the Spring Boot backend using a local (portable) Maven download.

## Requirements

- Java (JDK) 11+ installed and `java` available in PATH

## Run backend

From the project root in PowerShell:

```powershell
.\scripts\run-backend.ps1
```

This will:

- Download Maven into `.tools/maven/` (first run only)
- Run `mvn spring-boot:run` inside the `backend` folder

