package com.example.app.empleado;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    // GET - Obtener todos los empleados
    @GetMapping
    public ResponseEntity<List<EmpleadoDTO>> obtenerTodos() {
        List<EmpleadoDTO> empleados = empleadoService.obtenerTodos();
        return ResponseEntity.ok(empleados);
    }

    // GET - Obtener empleado por ID
    @GetMapping("/{id}")
    public ResponseEntity<EmpleadoDTO> obtenerPorId(@PathVariable Long id) {
        EmpleadoDTO empleado = empleadoService.obtenerPorId(id);
        return ResponseEntity.ok(empleado);
    }

    // POST - Crear nuevo empleado
    @PostMapping
    public ResponseEntity<EmpleadoDTO> crear(@Valid @RequestBody EmpleadoDTO empleadoDTO) {
        EmpleadoDTO nuevoEmpleado = empleadoService.crear(empleadoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoEmpleado);
    }

    // PUT - Actualizar empleado
    @PutMapping("/{id}")
    public ResponseEntity<EmpleadoDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody EmpleadoDTO empleadoDTO) {
        EmpleadoDTO empleadoActualizado = empleadoService.actualizar(id, empleadoDTO);
        return ResponseEntity.ok(empleadoActualizado);
    }

    // DELETE - Eliminar empleado
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        empleadoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // GET - Buscar por nombre o apellido
    @GetMapping("/buscar")
    public ResponseEntity<List<EmpleadoDTO>> buscarPorNombreOApellido(@RequestParam String busqueda) {
        List<EmpleadoDTO> empleados = empleadoService.buscarPorNombreOApellido(busqueda);
        return ResponseEntity.ok(empleados);
    }

    // GET - Obtener empleados por departamento
    @GetMapping("/departamento/{departamentoId}")
    public ResponseEntity<List<EmpleadoDTO>> obtenerPorDepartamento(@PathVariable Long departamentoId) {
        List<EmpleadoDTO> empleados = empleadoService.obtenerPorDepartamento(departamentoId);
        return ResponseEntity.ok(empleados);
    }
}