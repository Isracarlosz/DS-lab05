package com.example.app.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {

    @NotBlank(message = "El login es obligatorio")
    private String login;

    @NotBlank(message = "La clave es obligatoria")
    private String clave;
}