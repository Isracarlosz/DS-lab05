package com.example.app.usuario;

import com.example.app.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    // Obtener todos los usuarios
    public List<UsuarioDTO> obtenerTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Obtener usuario por ID
    public UsuarioDTO obtenerPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        return convertirADTO(usuario);
    }

    // Crear usuario
    public UsuarioDTO crear(UsuarioDTO usuarioDTO) {
        // Verificar si el login ya existe
        if (usuarioRepository.existsByLogin(usuarioDTO.getLogin())) {
            throw new IllegalArgumentException("El login ya existe");
        }

        Usuario usuario = convertirAEntidad(usuarioDTO);
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return convertirADTO(usuarioGuardado);
    }

    // Actualizar usuario
    public UsuarioDTO actualizar(Long id, UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        // Verificar si el login ya existe (excluyendo el usuario actual)
        if (!usuario.getLogin().equals(usuarioDTO.getLogin()) &&
                usuarioRepository.existsByLogin(usuarioDTO.getLogin())) {
            throw new IllegalArgumentException("El login ya existe");
        }

        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setLogin(usuarioDTO.getLogin());
        usuario.setClave(usuarioDTO.getClave());

        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return convertirADTO(usuarioActualizado);
    }

    // Eliminar usuario
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    // Autenticar usuario
    public boolean autenticar(String login, String clave) {
        return usuarioRepository.findByLoginAndClave(login, clave).isPresent();
    }

    // Obtener usuario por login
    public UsuarioDTO obtenerPorLogin(String login) {
        Usuario usuario = usuarioRepository.findByLogin(login)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con login: " + login));
        return convertirADTO(usuario);
    }

    // Métodos auxiliares de conversión
    private UsuarioDTO convertirADTO(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getLogin(),
                usuario.getClave()
        );
    }

    private Usuario convertirAEntidad(UsuarioDTO dto) {
        return new Usuario(
                dto.getId(),
                dto.getNombre(),
                dto.getLogin(),
                dto.getClave()
        );
    }
}