package com.example.app.empleado;

import com.example.app.common.exception.ResourceNotFoundException;
import com.example.app.departamento.Departamento;
import com.example.app.departamento.DepartamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final DepartamentoRepository departamentoRepository;

    // Obtener todos los empleados
    public List<EmpleadoDTO> obtenerTodos() {
        return empleadoRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Obtener empleado por ID
    public EmpleadoDTO obtenerPorId(Long id) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con id: " + id));
        return convertirADTO(empleado);
    }

    // Crear empleado
    public EmpleadoDTO crear(EmpleadoDTO empleadoDTO) {
        // Verificar si el email ya existe
        if (empleadoRepository.existsByEmail(empleadoDTO.getEmail())) {
            throw new IllegalArgumentException("El email ya existe");
        }

        Empleado empleado = convertirAEntidad(empleadoDTO);

        // Asignar departamento si existe
        if (empleadoDTO.getDepartamentoId() != null) {
            Departamento departamento = departamentoRepository.findById(empleadoDTO.getDepartamentoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado"));
            empleado.setDepartamento(departamento);
        }

        Empleado empleadoGuardado = empleadoRepository.save(empleado);
        return convertirADTO(empleadoGuardado);
    }

    // Actualizar empleado
    public EmpleadoDTO actualizar(Long id, EmpleadoDTO empleadoDTO) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con id: " + id));

        // Verificar si el email ya existe (excluyendo el empleado actual)
        if (!empleado.getEmail().equals(empleadoDTO.getEmail()) &&
                empleadoRepository.existsByEmail(empleadoDTO.getEmail())) {
            throw new IllegalArgumentException("El email ya existe");
        }

        empleado.setNombre(empleadoDTO.getNombre());
        empleado.setApellido(empleadoDTO.getApellido());
        empleado.setEmail(empleadoDTO.getEmail());
        empleado.setTelefono(empleadoDTO.getTelefono());
        empleado.setFechaContratacion(empleadoDTO.getFechaContratacion());
        empleado.setSalario(empleadoDTO.getSalario());
        empleado.setCargo(empleadoDTO.getCargo());

        // Actualizar departamento
        if (empleadoDTO.getDepartamentoId() != null) {
            Departamento departamento = departamentoRepository.findById(empleadoDTO.getDepartamentoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado"));
            empleado.setDepartamento(departamento);
        } else {
            empleado.setDepartamento(null);
        }

        Empleado empleadoActualizado = empleadoRepository.save(empleado);
        return convertirADTO(empleadoActualizado);
    }

    // Eliminar empleado
    public void eliminar(Long id) {
        if (!empleadoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Empleado no encontrado con id: " + id);
        }
        empleadoRepository.deleteById(id);
    }

    // Buscar por nombre o apellido
    public List<EmpleadoDTO> buscarPorNombreOApellido(String busqueda) {
        return empleadoRepository.findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(busqueda, busqueda)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Obtener empleados por departamento
    public List<EmpleadoDTO> obtenerPorDepartamento(Long departamentoId) {
        return empleadoRepository.findByDepartamentoId(departamentoId)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Métodos auxiliares de conversión
    private EmpleadoDTO convertirADTO(Empleado empleado) {
        EmpleadoDTO dto = new EmpleadoDTO();
        dto.setId(empleado.getId());
        dto.setNombre(empleado.getNombre());
        dto.setApellido(empleado.getApellido());
        dto.setEmail(empleado.getEmail());
        dto.setTelefono(empleado.getTelefono());
        dto.setFechaContratacion(empleado.getFechaContratacion());
        dto.setSalario(empleado.getSalario());
        dto.setCargo(empleado.getCargo());

        if (empleado.getDepartamento() != null) {
            dto.setDepartamentoId(empleado.getDepartamento().getId());
            dto.setDepartamentoNombre(empleado.getDepartamento().getNombre());
        }

        return dto;
    }

    private Empleado convertirAEntidad(EmpleadoDTO dto) {
        Empleado empleado = new Empleado();
        empleado.setId(dto.getId());
        empleado.setNombre(dto.getNombre());
        empleado.setApellido(dto.getApellido());
        empleado.setEmail(dto.getEmail());
        empleado.setTelefono(dto.getTelefono());
        empleado.setFechaContratacion(dto.getFechaContratacion());
        empleado.setSalario(dto.getSalario());
        empleado.setCargo(dto.getCargo());

        return empleado;
    }
}