package com.example.app.usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método para buscar usuario por login
    Optional<Usuario> findByLogin(String login);

    // Método para verificar si existe un login
    boolean existsByLogin(String login);

    // Método para buscar usuario por login y clave (para autenticación)
    Optional<Usuario> findByLoginAndClave(String login, String clave);
}