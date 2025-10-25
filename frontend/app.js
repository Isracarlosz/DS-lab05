// ==================================================
// CONFIGURACIÓN DE LA API
// ==================================================
// IMPORTANTE: Verifica que este puerto (8081) y la ruta base (/api) sean correctos para tu backend Java.
// Asegúrate de que tu backend esté ejecutándose en esta dirección.
const BASE_URL = 'http://localhost:8081/api'; 
const EMPLEADOS_API_URL = `${BASE_URL}/empleados`;
const DEPARTAMENTOS_API_URL = `${BASE_URL}/departamentos`;
// Asume que el controlador base para autenticación es /api/usuarios
const USUARIOS_API_URL = `${BASE_URL}/usuarios`; 

// ==================================================
// VARIABLES GLOBALES
// ==================================================
let empleadosData = []; // Cache para los datos de empleados
let departamentosData = []; // Cache para los datos de departamentos
let usuarioActual = null; // Almacena la información del usuario logueado
let empleadoIdToDelete = null; // ID del empleado a eliminar en el modal de confirmación

// Elementos del DOM
const empleadosTableBody = document.getElementById('empleadosTable');
const departamentoSelect = document.getElementById('departamentoId');
const empleadoForm = document.getElementById('empleadoForm');
const modalTitle = document.getElementById('modalTitle');
const empleadoModal = document.getElementById('empleadoModal');
const confirmModal = document.getElementById('confirmModal');
const searchInput = document.getElementById('searchInput');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

// ==================================================
// FUNCIONES DE UTILIDAD (VISTAS Y ALERTAS)
// ==================================================

/**
 * Muestra una vista y oculta las demás.
 * @param {string} viewId - El ID de la vista a mostrar ('loginView' o 'empleadosView').
 */
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
}

/**
 * Muestra una alerta en el contenedor especificado.
 * @param {string} containerId - El ID del contenedor de alerta (ej: 'loginAlert', 'alertContainer').
 * @param {string} message - El mensaje a mostrar.
 * @param {string} type - El tipo de alerta ('success', 'error', 'warning', 'info').
 */
function showAlert(containerId, message, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Limpia y crea el contenido de la alerta
    container.innerHTML = message;
    
    // Remueve todas las clases de alerta y añade la nueva
    container.className = 'alert';
    container.classList.add(`alert-${type}`, 'show');
    
    container.style.display = 'block';

    // Ocultar automáticamente después de 5 segundos, excepto la alerta de login
    if (containerId !== 'loginAlert') {
        setTimeout(() => {
            container.classList.remove('show');
            // Ocultar completamente después de la transición
            setTimeout(() => {
                container.style.display = 'none';
                container.innerHTML = '';
            }, 500); 
        }, 5000);
    }
}

// ==================================================
// MANEJO DE MODALES
// ==================================================

/**
 * Muestra el modal de creación/edición de empleados.
 * @param {string} mode - 'create' o 'edit'.
 * @param {number} [id=null] - ID del empleado si es modo 'edit'.
 */
function showModal(mode, id = null) {
    // Resetear el formulario y limpiar el ID oculto
    empleadoForm.reset();
    document.getElementById('empleadoId').value = ''; 
    document.getElementById('btnGuardar').textContent = 'Guardar';
    
    if (mode === 'create') {
        modalTitle.textContent = '➕ Nuevo Empleado';
    } else {
        modalTitle.textContent = '✏️ Editar Empleado';
        document.getElementById('btnGuardar').textContent = 'Actualizar';
        cargarEmpleadoParaEdicion(id);
    }
    empleadoModal.classList.add('show');
}

function closeModal() {
    empleadoModal.classList.remove('show');
}

function showConfirmModal(id) {
    empleadoIdToDelete = id;
    confirmModal.classList.add('show');
    // Asegura que el handler de confirmación esté asociado al botón correcto
    btnConfirmarEliminar.onclick = confirmarEliminar; 
}

function closeConfirmModal() {
    confirmModal.classList.remove('show');
    empleadoIdToDelete = null;
}

// ==================================================
// CARGA DE DATOS Y RENDERIZADO
// ==================================================

/**
 * Carga los departamentos y rellena el <select>.
 */
async function cargarDepartamentos() {
    try {
        // Usamos la librería 'axios' (asumida en el index.html) para hacer la petición
        const response = await axios.get(DEPARTAMENTOS_API_URL);
        departamentosData = response.data;
        departamentoSelect.innerHTML = '<option value="">Seleccionar...</option>';
        departamentosData.forEach(dep => {
            const option = document.createElement('option');
            option.value = dep.id;
            option.textContent = dep.nombre;
            departamentoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar departamentos:', error);
        // Si falla, al menos la aplicación sigue funcionando
    }
}

/**
 * Carga todos los empleados desde la API.
 */
async function cargarEmpleados() {
    // Muestra el estado de carga
    empleadosTableBody.innerHTML = '<tr><td colspan="9" class="loading">Cargando empleados...</td></tr>';
    
    try {
        const response = await axios.get(EMPLEADOS_API_URL);
        empleadosData = response.data;
        renderEmpleados(empleadosData);
    } catch (error) {
        console.error('Error al cargar empleados:', error);
        empleadosTableBody.innerHTML = '<tr><td colspan="9" class="loading">❌ Error al cargar datos. Verifique la conexión con el backend o la sesión.</td></tr>';
        showAlert('alertContainer', '❌ Error al cargar los empleados. Es posible que la API no responda o haya un problema de CORS.', 'error');
    }
}

/**
 * Renderiza los empleados en la tabla.
 * @param {Array<Object>} data - Lista de empleados a renderizar.
 */
function renderEmpleados(data) {
    empleadosTableBody.innerHTML = ''; // Limpiar contenido anterior

    if (data.length === 0) {
        empleadosTableBody.innerHTML = '<tr><td colspan="9" class="empty-state">No se encontraron empleados.</td></tr>';
        return;
    }

    data.forEach(empleado => {
        // Encontrar el nombre del departamento
        const dep = departamentosData.find(d => d.id === empleado.departamentoId);
        const departamentoNombre = dep ? dep.nombre : empleado.departamentoNombre || 'N/A';
        
        // Formato de fecha (ajustar si la fecha de Java viene con timestamp)
        let fechaContratacionFormatted = 'N/A';
        if (empleado.fechaContratacion) {
            try {
                // Si viene como 'YYYY-MM-DD' o un objeto Date válido
                const date = new Date(empleado.fechaContratacion);
                if (!isNaN(date)) {
                    // Usar toLocaleDateString para formato DD/MM/YYYY
                    fechaContratacionFormatted = date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
                }
            } catch (e) {
                console.warn("Fecha inválida:", empleado.fechaContratacion);
            }
        }
        
        // Salario formateado (manejo de null/undefined)
        const salarioFormatted = empleado.salario !== null && empleado.salario !== undefined
            ? `$${parseFloat(empleado.salario).toFixed(2)}`
            : 'N/A';

        const row = empleadosTableBody.insertRow();
        row.innerHTML = `
            <td>${empleado.id || 'N/A'}</td>
            <td>${empleado.nombre || ''} ${empleado.apellido || ''}</td>
            <td>${empleado.email || 'N/A'}</td>
            <td>${empleado.telefono || 'N/A'}</td>
            <td>${empleado.cargo || 'N/A'}</td>
            <td>${departamentoNombre}</td>
            <td>${salarioFormatted}</td>
            <td>${fechaContratacionFormatted}</td>
            <td class="actions">
                <button class="btn btn-warning btn-sm" onclick="showModal('edit', ${empleado.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="showConfirmModal(${empleado.id})">Eliminar</button>
            </td>
        `;
    });
}

/**
 * Rellena el formulario con los datos del empleado para edición.
 * @param {number} id - ID del empleado.
 */
function cargarEmpleadoParaEdicion(id) {
    const empleado = empleadosData.find(e => e.id === id);
    if (!empleado) {
        showAlert('alertContainer', '❌ Empleado no encontrado para edición.', 'error');
        closeModal();
        return;
    }

    document.getElementById('empleadoId').value = empleado.id;
    document.getElementById('nombre').value = empleado.nombre || '';
    document.getElementById('apellido').value = empleado.apellido || '';
    document.getElementById('email').value = empleado.email || '';
    document.getElementById('telefono').value = empleado.telefono || '';
    document.getElementById('cargo').value = empleado.cargo || '';
    
    // Salario: Asegurar que se muestre el valor numérico
    document.getElementById('salario').value = empleado.salario || 0;
    
    // Formatear la fecha (si viene con HORA, solo necesitamos la parte DATE para el input type="date")
    if (empleado.fechaContratacion) {
        try {
            const date = new Date(empleado.fechaContratacion);
            if (!isNaN(date)) {
                // Obtener YYYY-MM-DD
                const dateString = date.toISOString().split('T')[0];
                document.getElementById('fechaContratacion').value = dateString;
            }
        } catch (e) {
            document.getElementById('fechaContratacion').value = '';
        }
    } else {
        document.getElementById('fechaContratacion').value = '';
    }
    
    // Seleccionar el departamento
    document.getElementById('departamentoId').value = empleado.departamentoId || '';
}

// ==================================================
// CRUD (CREAR, EDITAR, ELIMINAR)
// ==================================================

empleadoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('empleadoId').value;
    const isEditing = id !== '';
    const btnSubmit = document.getElementById('btnGuardar');
    
    btnSubmit.disabled = true;
    btnSubmit.textContent = isEditing ? 'Actualizando...' : 'Guardando...';

    // Obtener y validar datos del formulario
    const empleado = {
        nombre: document.getElementById('nombre').value.trim(),
        apellido: document.getElementById('apellido').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim() || null,
        cargo: document.getElementById('cargo').value.trim() || null,
        // Convertimos a número. Si está vacío, usamos null.
        departamentoId: Number(document.getElementById('departamentoId').value) || null,
        // Usamos parseFloat y aseguramos que no sea NaN
        salario: parseFloat(document.getElementById('salario').value) || 0,
        fechaContratacion: document.getElementById('fechaContratacion').value,
    };

    // Validación básica
    if (!empleado.nombre || !empleado.apellido || !empleado.email || !empleado.salario || !empleado.fechaContratacion) {
        showAlert('alertContainer', '❌ Por favor, rellena todos los campos obligatorios (Nombre, Apellido, Email, Salario, Fecha).', 'error');
        btnSubmit.disabled = false;
        btnSubmit.textContent = isEditing ? 'Actualizar' : 'Guardar';
        return;
    }
    
    try {
        if (isEditing) {
            // EDITAR (PUT)
            empleado.id = parseInt(id);
            await axios.put(`${EMPLEADOS_API_URL}/${id}`, empleado);
            showAlert('alertContainer', `✅ Empleado ${id} actualizado con éxito.`, 'success');
        } else {
            // CREAR (POST)
            await axios.post(EMPLEADOS_API_URL, empleado);
            showAlert('alertContainer', '✅ Empleado creado con éxito.', 'success');
        }
        
        closeModal();
        await cargarEmpleados(); // Recargar datos de la tabla

    } catch (error) {
        console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} empleado:`, error);
        
        // Intenta extraer un mensaje de error del cuerpo de la respuesta, si está disponible
        const errorMessage = error.response?.data?.message || `Error en la comunicación con la API. Revise la consola.`;
        
        showAlert('alertContainer', `❌ Error: ${errorMessage}`, 'error');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = isEditing ? 'Actualizar' : 'Guardar';
    }
});

async function confirmarEliminar() {
    const id = empleadoIdToDelete;
    closeConfirmModal();

    if (id === null) return;

    try {
        // ELIMINAR (DELETE)
        await axios.delete(`${EMPLEADOS_API_URL}/${id}`);
        showAlert('alertContainer', `✅ Empleado ${id} eliminado con éxito.`, 'success');
        await cargarEmpleados(); // Recargar datos de la tabla
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        const errorMessage = error.response?.data?.message || `Error al eliminar el empleado ${id}.`;
        showAlert('alertContainer', `❌ Error: ${errorMessage}`, 'error');
    }
}

// ==================================================
// BÚSQUEDA
// ==================================================

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm.length === 0) {
        renderEmpleados(empleadosData); // Muestra todos si la búsqueda está vacía
        return;
    }
    
    // Filtrar los datos en el cache local
    const filteredData = empleadosData.filter(empleado => {
        // Concatenar campos relevantes para una búsqueda amplia
        const searchableText = [
            empleado.nombre, 
            empleado.apellido, 
            empleado.email, 
            empleado.cargo,
            // Incluir el nombre del departamento si está disponible en el cache
            departamentosData.find(d => d.id === empleado.departamentoId)?.nombre
        ].map(item => String(item || '').toLowerCase()).join(' ');

        return searchableText.includes(searchTerm);
    });
    
    renderEmpleados(filteredData);
});

// ==================================================
// AUTENTICACIÓN Y LOGIN (CRÍTICO)
// ==================================================

/**
 * Maneja el cierre de sesión.
 */
function logout() {
    usuarioActual = null;
    empleadosData = []; // Limpiar caché de datos
    departamentosData = [];
    document.getElementById('empleadosTable').innerHTML = ''; // Limpiar tabla
    showView('loginView');
    document.getElementById('loginForm').reset();
    document.getElementById('userName').textContent = 'Usuario';
    showAlert('loginAlert', '👋 Sesión cerrada exitosamente.', 'info');
    // Asegurar que la alerta del main content se oculte
    document.getElementById('alertContainer').style.display = 'none';
}


document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const login = document.getElementById('loginUsuario').value.trim();
    const clave = document.getElementById('loginClave').value;

    const btnSubmit = e.target.querySelector('button[type="submit"]');
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Iniciando sesión...';
    
    // Limpiar alerta previa
    document.getElementById('loginAlert').style.display = 'none';

    try {
        // Endpoint de login (ejemplo: POST /api/usuarios/auth/login)
        const response = await axios.post(`${USUARIOS_API_URL}/auth/login`, {
            login: login,
            clave: clave
        });

        // El backend debe devolver un objeto con los datos del usuario en caso de éxito
        // Asumiendo que el backend devuelve un 200/201 con los datos del usuario si es exitoso
        if (response.data && response.status < 400) {
            // LOGIN EXITOSO
            usuarioActual = response.data; // Asume que 'response.data' es el objeto usuario
            document.getElementById('userName').textContent = usuarioActual.nombre || 'Administrador';
            
            showAlert('loginAlert', '✅ ¡Login exitoso! Redirigiendo...', 'success');
            
            // Redirigir y cargar datos después de un breve delay
            setTimeout(() => {
                showView('empleadosView');
                cargarDepartamentos(); 
                cargarEmpleados();      // <--- INICIA LA CARGA DE LA TABLA
            }, 1000);
        } else {
             // Esto se maneja mejor en el catch, pero por si acaso.
             throw new Error("Respuesta de API inesperada.");
        }

    } catch (error) {
        console.error('Error en login:', error);
        
        let errorMessage = '❌ Error desconocido.';
        
        if (error.response) {
            // Error de respuesta (4xx, 5xx)
            if (error.response.status === 401 || error.response.status === 403) {
                errorMessage = '❌ Credenciales inválidas. Verifica tu usuario y contraseña.';
            } else if (error.response.data && error.response.data.message) {
                errorMessage = `❌ Error del servidor: ${error.response.data.message}`;
            } else {
                errorMessage = `❌ Error ${error.response.status}: El servidor respondió con un error.`;
            }
        } else if (error.request) {
            // El servidor no respondió (API está caído o URL incorrecta)
            errorMessage = '❌ No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en la URL configurada.';
        }
        
        showAlert('loginAlert', errorMessage, 'error');
        
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Iniciar Sesión';
    }
});

// Inicializar la aplicación al cargar la página
window.onload = function() {
    showView('loginView');
}
