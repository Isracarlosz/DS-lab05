package com.example.app.departamento;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departamentos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DepartamentoController {

    private final DepartamentoService departamentoService;

    // GET - Obtener todos los departamentos
    @GetMapping
    public ResponseEntity<List<DepartamentoDTO>> obtenerTodos() {
        List<DepartamentoDTO> departamentos = departamentoService.obtenerTodos();
        return ResponseEntity.ok(departamentos);
    }
}