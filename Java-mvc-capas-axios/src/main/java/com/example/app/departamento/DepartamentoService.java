package com.example.app.departamento;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DepartamentoService {

    private final DepartamentoRepository departamentoRepository;

    // Obtener todos los departamentos
    public List<DepartamentoDTO> obtenerTodos() {
        return departamentoRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Métodos auxiliares de conversión
    private DepartamentoDTO convertirADTO(Departamento departamento) {
        return new DepartamentoDTO(
                departamento.getId(),
                departamento.getNombre(),
                departamento.getUbicacion(),
                departamento.getPresupuesto()
        );
    }
}