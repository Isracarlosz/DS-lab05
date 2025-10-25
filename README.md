# 🏢 Sistema de Gestión de Empleados - LAB05

Sistema completo con Login y CRUD de Empleados usando Spring Boot + PostgreSQL + HTML/CSS/JavaScript

## 📋 Requisitos

- Java 17+
- Maven
- PostgreSQL 14+
- PGAdmin 4
- Navegador web moderno

## 🚀 Instalación Paso a Paso

### 1️⃣ Configurar la Base de Datos

1. Abre **PGAdmin**
2. Crea una base de datos llamada: `lab05_db`
3. Ejecuta el script SQL completo (tablas + datos de prueba)

### 2️⃣ Configurar el Backend

1. Abre el archivo `src/main/resources/application.properties`
2. Configura tus credenciales de PostgreSQL:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lab05_db
spring.datasource.username=postgres
spring.datasource.password=TU_CONTRASEÑA

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

3. Compila y ejecuta el backend:

```bash
mvn clean install
mvn spring-boot:run
```

✅ El servidor debe estar corriendo en: `http://localhost:8081`

### 3️⃣ Abrir el Frontend

1. Coloca los 3 archivos en la misma carpeta:
   - `index.html`
   - `app.js`
   - `style.css`

2. **Abre `index.html` con doble click** en tu navegador

🎉 ¡Listo! La aplicación debe cargar automáticamente.

## 🔑 Credenciales de Prueba

| Usuario | Contraseña |
|---------|------------|
| jorge   | 1234       |
| max     | 1234       |

## 🎯 Funcionalidades

### ✅ Sistema de Login (10 puntos)
- Pantalla de inicio de sesión
- Validación contra base de datos
- Redirección al panel de administración
- Mensajes de error

### ✅ CRUD de Empleados (10 puntos)
- **Crear (3 pts):** Formulario con validaciones
- **Leer (2 pts):** Listado en tabla
- **Actualizar (3 pts):** Edición de datos
- **Eliminar (2 pts):** Con confirmación


## 📁 Estructura del Proyecto

### Backend
```
src/main/java/com/example/app/
├── auth/
│   ├── AuthController.java
│   └── LoginDTO.java
├── usuario/
│   ├── Usuario.java
│   ├── UsuarioController.java
│   ├── UsuarioDTO.java
│   ├── UsuarioRepository.java
│   └── UsuarioService.java
├── empleado/
│   ├── Empleado.java
│   ├── EmpleadoController.java
│   ├── EmpleadoDTO.java
│   ├── EmpleadoRepository.java
│   └── EmpleadoService.java
├── departamento/
│   ├── Departamento.java
│   ├── DepartamentoDTO.java
│   ├── DepartamentoRepository.java
│   └── DepartamentoService.java
└── common/exception/
    ├── ResourceNotFoundException.java
    └── GlobalExceptionHandler.java
```

### Frontend
```
├── index.html    (Login + CRUD en una sola página)
├── app.js        (Toda la lógica JavaScript)
└── style.css     (Todos los estilos)
```


# DS-lab05
