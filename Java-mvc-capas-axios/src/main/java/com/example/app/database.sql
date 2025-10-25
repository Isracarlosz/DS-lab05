-- ==========================
-- CREACIÓN DE TABLAS
-- ==========================

-- Tabla de Departamentos
CREATE TABLE departamentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(100),
    presupuesto NUMERIC(12,2)
);

CREATE TABLE usuarios(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    login VARCHAR(20),
    clave VARCHAR(20)
);

-- Tabla de Empleados
CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_contratacion DATE NOT NULL,
    salario NUMERIC(10,2) NOT NULL,
    cargo VARCHAR(100),
    departamento_id INT REFERENCES departamentos(id)
);

-- ==========================
-- INSERCIÓN DE DATOS
-- ==========================

-- Departamentos (4 registros)
INSERT INTO departamentos (nombre, ubicacion, presupuesto) VALUES
('Recursos Humanos', 'Lima', 150000.00),
('Tecnología', 'Arequipa', 300000.00),
('Marketing', 'Cusco', 200000.00),
('Finanzas', 'Lima', 250000.00);

-- Departamentos (4 registros)
INSERT INTO usuarios (nombre, login, clave) VALUES
('Jorge Curioso', 'jorge', '1234'),
('Mac Pato', 'max', '1234');

-- Empleados (20 registros de ejemplo)
INSERT INTO empleados (nombre, apellido, email, telefono, fecha_contratacion, salario, cargo, departamento_id) VALUES
('Ana', 'Pérez', 'ana.perez@empresa.com', '999111222', '2021-03-10', 3500.00, 'Analista RRHH', 1),
('Luis', 'García', 'luis.garcia@empresa.com', '999111223', '2020-07-15', 5000.00, 'Desarrollador Senior', 2),
('María', 'Lopez', 'maria.lopez@empresa.com', '999111224', '2019-02-01', 4200.00, 'Diseñadora UX', 2),
('Carlos', 'Ramírez', 'carlos.ramirez@empresa.com', '999111225', '2022-05-20', 2800.00, 'Asistente Marketing', 3),
('Lucía', 'Fernández', 'lucia.fernandez@empresa.com', '999111226', '2023-01-10', 3100.00, 'Ejecutiva de Ventas', 3),
('Miguel', 'Torres', 'miguel.torres@empresa.com', '999111227', '2018-08-08', 6000.00, 'Jefe de Tecnología', 2),
('Rosa', 'Castro', 'rosa.castro@empresa.com', '999111228', '2021-12-12', 2900.00, 'Asistente Administrativo', 1),
('Jorge', 'Flores', 'jorge.flores@empresa.com', '999111229', '2020-11-30', 4800.00, 'Contador', 4),
('Patricia', 'Mendoza', 'patricia.mendoza@empresa.com', '999111230', '2017-09-14', 7000.00, 'Gerente de Finanzas', 4),
('Raúl', 'Díaz', 'raul.diaz@empresa.com', '999111231', '2022-06-18', 3200.00, 'Analista de Datos', 2),
('Elena', 'Morales', 'elena.morales@empresa.com', '999111232', '2023-04-01', 2800.00, 'Community Manager', 3),
('Diego', 'Reyes', 'diego.reyes@empresa.com', '999111233', '2019-07-22', 4500.00, 'Ingeniero de Software', 2),
('Verónica', 'Soto', 'veronica.soto@empresa.com', '999111234', '2021-10-05', 3800.00, 'Especialista en Selección', 1),
('Hugo', 'Rojas', 'hugo.rojas@empresa.com', '999111235', '2020-02-28', 5200.00, 'Arquitecto de Software', 2),
('Claudia', 'Vega', 'claudia.vega@empresa.com', '999111236', '2022-09-09', 3400.00, 'Ejecutiva de Cuentas', 3),
('Fernando', 'Cruz', 'fernando.cruz@empresa.com', '999111237', '2018-12-17', 6100.00, 'Gerente de TI', 2),
('Andrea', 'Navarro', 'andrea.navarro@empresa.com', '999111238', '2021-06-25', 3600.00, 'Analista Financiero', 4),
('Pablo', 'Guzmán', 'pablo.guzman@empresa.com', '999111239', '2020-08-13', 4700.00, 'Desarrollador Backend', 2),
('Gabriela', 'Ortega', 'gabriela.ortega@empresa.com', '999111240', '2023-03-03', 3000.00, 'Asistente Contable', 4),
('Sebastián', 'Ibarra', 'sebastian.ibarra@empresa.com', '999111241', '2019-11-11', 4200.00, 'Desarrollador Frontend', 2);