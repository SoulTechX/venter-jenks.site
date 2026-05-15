document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Cerrar menú al hacer click en un link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // --- Carga y Filtrado de Propiedades ---
    const propertiesGrid = document.getElementById('properties-grid');
    const filterOperacion = document.getElementById('filter-operacion');
    const filterTipo = document.getElementById('filter-tipo');
    let allProperties = [];

    // Formateador de moneda
    const formatPrice = (price, currency) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(price);
    };

    // Generar enlace de WhatsApp
    const generateWhatsAppLink = (prop) => {
        const phone = "5492974365975"; 
        const message = `Hola Venter Jenks, me interesa la propiedad "${prop.titulo}" (${prop.operacion} - ${prop.tipo}) publicada a ${prop.moneda} ${prop.precio}. ¿Podrían darme más información?`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    // Renderizar tarjetas
    const renderProperties = (properties) => {
        if (!propertiesGrid) return;
        
        propertiesGrid.innerHTML = '';
        
        if (properties.length === 0) {
            propertiesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No se encontraron propiedades con esos filtros.</p>';
            return;
        }

        properties.forEach(prop => {
            const card = document.createElement('div');
            card.className = 'property-card';
            
            card.innerHTML = `
                <img src="${prop.imagen}" alt="${prop.titulo}" class="property-img">
                <div class="property-details">
                    <div class="property-price">${formatPrice(prop.precio, prop.moneda)}</div>
                    <h3 class="property-title">${prop.titulo}</h3>
                    <p class="property-location">📍 ${prop.ubicacion}</p>
                    <div class="property-features">
                        <span>🛏️ ${prop.ambientes} Amb.</span>
                        <span>📏 ${prop.m2} m²</span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <span class="tag">${prop.operacion}</span>
                        <span class="tag">${prop.tipo}</span>
                    </div>
                    <a href="${generateWhatsAppLink(prop)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display: block; width: 100%;">Consultar por WhatsApp</a>
                </div>
            `;
            
            propertiesGrid.appendChild(card);
        });
    };

    // Filtrar propiedades
    const filterProperties = () => {
        if (!allProperties.length) return;

        const operacionValue = filterOperacion.value;
        const tipoValue = filterTipo.value;

        const filtered = allProperties.filter(prop => {
            const matchOperacion = operacionValue === 'todas' || prop.operacion === operacionValue;
            const matchTipo = tipoValue === 'todos' || prop.tipo === tipoValue;
            return matchOperacion && matchTipo;
        });

        renderProperties(filtered);
    };

    // Fetch datos
    if (propertiesGrid) {
        fetch('data/propiedades.json')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar propiedades');
                return response.json();
            })
            .then(data => {
                allProperties = data;
                renderProperties(allProperties);
            })
            .catch(error => {
                console.error(error);
                propertiesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Hubo un error al cargar las propiedades. Por favor intente nuevamente más tarde.</p>';
            });

        // Event Listeners para filtros
        if (filterOperacion) filterOperacion.addEventListener('change', filterProperties);
        if (filterTipo) filterTipo.addEventListener('change', filterProperties);
    }
});
