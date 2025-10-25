package com.example.app.usuario;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "El login es obligatorio")
    @Size(min = 3, max = 20, message = "El login debe tener entre 3 y 20 caracteres")
    private String login;

    @NotBlank(message = "La clave es obligatoria")
    @Size(min = 4, max = 20, message = "La clave debe tener entre 4 y 20 caracteres")
    private String clave;
}