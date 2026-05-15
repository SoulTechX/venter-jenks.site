(function() {
    // 1. Inyectar Estilos Dinámicamente
    const style = document.createElement('style');
    style.innerHTML = `
        .chatbot-container {
            position: fixed;
            bottom: 40px;
            right: 40px;
            z-index: 1000;
            font-family: 'Inter', sans-serif;
            pointer-events: none;
        }

        /* Avatar flotante */
        .chatbot-avatar {
            width: 60px;
            height: 60px;
            background-color: #2E9B5E;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            cursor: pointer;
            pointer-events: auto;
            position: absolute;
            bottom: 0;
            right: 0;
            transition: transform 0.3s ease, background-color 0.3s ease;
            z-index: 2;
        }

        .chatbot-avatar:hover {
            transform: scale(1.08);
            background-color: #1a6e40;
        }

        /* Burbuja de bienvenida */
        .chatbot-bubble {
            position: absolute;
            bottom: 75px;
            right: 0;
            background-color: #FFF;
            color: #333;
            padding: 12px 18px;
            border-radius: 15px;
            border-bottom-right-radius: 0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            font-size: 0.95rem;
            width: 220px;
            pointer-events: auto;
            cursor: pointer;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 1;
            line-height: 1.4;
        }

        .chatbot-bubble.show {
            opacity: 1;
            transform: translateY(0);
        }

        /* Panel del Chat */
        .chatbot-panel {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 320px;
            background-color: #FFF;
            border-radius: 15px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            pointer-events: auto;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transform-origin: bottom right;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            visibility: hidden;
            z-index: 3;
            border: 1px solid #eee;
        }

        .chatbot-panel.open {
            opacity: 1;
            transform: translateY(0) scale(1);
            visibility: visible;
        }

        .chatbot-header {
            background-color: #2E9B5E;
            color: #FFF;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chatbot-header h4 {
            margin: 0;
            font-size: 1.05rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .chatbot-close {
            background: none;
            border: none;
            color: #FFF;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .chatbot-close:hover {
            opacity: 1;
        }

        .chatbot-body {
            padding: 16px;
            height: 360px;
            overflow-y: auto;
            background-color: #f8fafc;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        /* Mensajes */
        .chat-msg {
            display: flex;
            flex-direction: column;
            gap: 8px;
            animation: fadeIn 0.3s ease;
        }

        .chat-bot-msg {
            align-self: flex-start;
            background-color: #FFF;
            padding: 12px 16px;
            border-radius: 15px;
            border-bottom-left-radius: 4px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.04);
            font-size: 0.9rem;
            max-width: 90%;
            color: #334155;
            line-height: 1.5;
            border: 1px solid #e2e8f0;
        }

        .chat-user-msg {
            align-self: flex-end;
            background-color: #2E9B5E;
            color: #FFF;
            padding: 12px 16px;
            border-radius: 15px;
            border-bottom-right-radius: 4px;
            font-size: 0.9rem;
            max-width: 90%;
            box-shadow: 0 2px 6px rgba(46,155,94,0.2);
        }

        /* Opciones de Menú */
        .chat-options {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 4px;
        }

        .chat-btn {
            background-color: #FFF;
            border: 1px solid #2E9B5E;
            color: #2E9B5E;
            padding: 10px 14px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            text-align: left;
            transition: all 0.2s ease;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .chat-btn:hover {
            background-color: #2E9B5E;
            color: #FFF;
            transform: translateX(3px);
        }

        /* Botón de Acción final (Ir a sección/WhatsApp) */
        .chat-action-btn {
            display: inline-block;
            background-color: #2E9B5E;
            color: #FFF;
            padding: 8px 16px;
            border-radius: 20px;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 600;
            margin-top: 12px;
            text-align: center;
            border: none;
            transition: background-color 0.2s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .chat-action-btn:hover {
            background-color: #1a6e40;
            color: #FFF;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Ajustes Mobile */
        @media (max-width: 480px) {
            .chatbot-container {
                right: 20px;
                bottom: 20px;
            }
            .chatbot-panel {
                width: calc(100vw - 40px);
                bottom: 70px;
                height: 450px;
            }
            .chatbot-body {
                height: 100%;
            }
        }
    `;
    document.head.appendChild(style);

    // 2. Crear Estructura HTML
    const container = document.createElement('div');
    container.className = 'chatbot-container';

    container.innerHTML = `
        <div class="chatbot-bubble">¡Hola! 👋 Soy Manu, ¿en qué servicio puedo ayudarte hoy?</div>
        
        <div class="chatbot-panel">
            <div class="chatbot-header">
                <h4><img src="img/manu.png?v=1.0" alt="Manu" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;"> Manu - Asistente Virtual</h4>
                <button class="chatbot-close">✖</button>
            </div>
            <div class="chatbot-body" id="chatbot-body"></div>
        </div>

        <div class="chatbot-avatar">
            <img src="img/manu.png?v=1.0" alt="Manu" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
        </div>
    `;

    document.body.appendChild(container);

    // 3. Lógica y Eventos
    const bubble = container.querySelector('.chatbot-bubble');
    const avatar = container.querySelector('.chatbot-avatar');
    const panel = container.querySelector('.chatbot-panel');
    const closeBtn = container.querySelector('.chatbot-close');
    const chatBody = container.querySelector('#chatbot-body');

    // WhatsApp base
    const waNumber = "5492974365975";

    // Opciones del Menú
    const options = [
        { 
            id: 'comprar', 
            text: '🏠 Comprar una propiedad', 
            reply: '¡Excelente decisión! Tenemos opciones fantásticas. Puedes buscar en nuestro catálogo o hablar directo con un vendedor.', 
            actionText: 'Ver Propiedades', 
            actionLink: '#inmobiliaria' 
        },
        { 
            id: 'alquilar', 
            text: '🔑 Alquilar una propiedad', 
            reply: 'Contamos con opciones de alquiler para todos los perfiles. ¿Prefieres verlas o escribirnos?', 
            actionText: 'Escribir por WhatsApp', 
            actionLink: `https://wa.me/${waNumber}?text=${encodeURIComponent('Hola, estoy buscando alquilar una propiedad.')}`,
            external: true
        },
        { 
            id: 'tasacion', 
            text: '📊 Tasación de inmueble', 
            reply: 'Nuestros tasadores profesionales evalúan el valor exacto de tu inmueble. Puedes llenar el formulario online.', 
            actionText: 'Ir a Tasaciones', 
            actionLink: '#tasaciones' 
        },
        { 
            id: 'contable', 
            text: '📝 Estudio Contable', 
            reply: 'Ofrecemos liquidación de impuestos, balances y asesoramiento integral para empresas.', 
            actionText: 'Servicios Contables', 
            actionLink: '#contable' 
        },
        { 
            id: 'legal', 
            text: '⚖️ Asesoría Legal', 
            reply: 'Te ayudamos a realizar tus trámites inmobiliarios y sucesiones con total seguridad jurídica.', 
            actionText: 'Servicios Legales', 
            actionLink: '#abogacia' 
        },
        { 
            id: 'contacto', 
            text: '📞 Contactar un asesor', 
            reply: 'Estamos listos para conversar contigo. ¡Escríbenos!', 
            actionText: 'Chatear por WhatsApp', 
            actionLink: `https://wa.me/${waNumber}?text=${encodeURIComponent('Hola Venter Jenks, necesito comunicarme con un asesor.')}`,
            external: true
        }
    ];

    // Mostrar burbuja luego de 3 segundos
    setTimeout(() => {
        if (!panel.classList.contains('open')) {
            bubble.classList.add('show');
        }
    }, 3000);

    // Renderizar Menú Inicial
    const renderMenu = () => {
        let optionsHtml = options.map(opt => `<button class="chat-btn" data-id="${opt.id}">${opt.text}</button>`).join('');
        
        chatBody.innerHTML = `
            <div class="chat-msg">
                <div class="chat-bot-msg">¡Hola! Soy Manu, asistente virtual de Venter Jenks Negocios Inmobiliarios. Selecciona la opción que te interese:</div>
                <div class="chat-options">
                    ${optionsHtml}
                </div>
            </div>
        `;

        const btns = chatBody.querySelectorAll('.chat-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => handleOptionClick(btn.getAttribute('data-id')));
        });
    };

    const handleOptionClick = (id) => {
        const option = options.find(o => o.id === id);
        if (!option) return;

        // Eliminar botones para que no se puedan volver a tocar
        const optionsContainer = chatBody.querySelector('.chat-options');
        if (optionsContainer) optionsContainer.remove();

        // Burbuja del usuario
        chatBody.insertAdjacentHTML('beforeend', `
            <div class="chat-msg">
                <div class="chat-user-msg">${option.text}</div>
            </div>
        `);

        // Simular que el bot "escribe" (retraso corto)
        setTimeout(() => {
            let targetAttr = option.external ? 'target="_blank" rel="noopener noreferrer"' : '';
            
            chatBody.insertAdjacentHTML('beforeend', `
                <div class="chat-msg">
                    <div class="chat-bot-msg">
                        ${option.reply}
                        <br>
                        <a href="${option.actionLink}" ${targetAttr} class="chat-action-btn">${option.actionText}</a>
                    </div>
                </div>
            `);
            chatBody.scrollTop = chatBody.scrollHeight;
            
            // Si es un link interno (#), cerramos el panel al hacer click
            if (!option.external) {
                const actionBtn = chatBody.querySelector('.chat-action-btn:last-child');
                if (actionBtn) {
                    actionBtn.addEventListener('click', closeChat);
                }
            }
        }, 600);
    };

    const openChat = () => {
        panel.classList.add('open');
        bubble.classList.remove('show');
        if (chatBody.children.length === 0) {
            renderMenu();
        }
    };

    const closeChat = () => {
        panel.classList.remove('open');
        // Resetear el chat luego de ocultarlo para que vuelva a mostrar el menú si lo abren de nuevo
        setTimeout(() => { 
            chatBody.innerHTML = ''; 
            renderMenu(); 
        }, 300);
    };

    avatar.addEventListener('click', () => {
        if (panel.classList.contains('open')) {
            closeChat();
        } else {
            openChat();
        }
    });

    bubble.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);

})();
