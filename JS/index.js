// JavaScript específico para a página index

document.addEventListener('DOMContentLoaded', function() {
    // Animação do hero
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroText && heroImage) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateX(-50px)';
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            heroText.style.transition = 'all 0.8s ease';
            heroImage.style.transition = 'all 0.8s ease';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateX(0)';
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }, 300);
    }

    // Animação dos cards dos módulos
    const moduleCards = document.querySelectorAll('.module-card');
    moduleCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 600 + (index * 200));
    });

    // Efeito hover nos cards dos módulos
    moduleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Contador animado (se houver estatísticas)
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        // Iniciar contador quando elemento estiver visível
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });

    // Parallax effect no hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElement = document.querySelector('.hero-image img');
        
        if (parallaxElement) {
            const speed = scrolled * 0.5;
            parallaxElement.style.transform = `translateY(${speed}px)`;
        }
    });
});

// Função para scroll até módulos
function scrollToModules() {
    const modulesSection = document.getElementById('modules');
    if (modulesSection) {
        modulesSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Função para destacar módulo
function highlightModule(moduleType) {
    const moduleCard = document.querySelector(`[data-module="${moduleType}"]`);
    if (moduleCard) {
        moduleCard.classList.add('highlighted');
        moduleCard.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        setTimeout(() => {
            moduleCard.classList.remove('highlighted');
        }, 3000);
    }
}

// Adicionar estilo para módulo destacado
const highlightStyles = document.createElement('style');
highlightStyles.textContent = `
    .module-card.highlighted {
        transform: translateY(-10px) scale(1.05);
        box-shadow: 0 20px 40px rgba(37, 99, 235, 0.3);
        border: 2px solid var(--primary-color);
    }
`;
document.head.appendChild(highlightStyles);

// Função para mostrar modal de informações
function showInfoModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="closeModal()">Entendi</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Adicionar estilos do modal se não existirem
    if (!document.querySelector('#modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .modal-overlay.show {
                opacity: 1;
            }
            .modal-content {
                background: white;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            }
            .modal-overlay.show .modal-content {
                transform: scale(1);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
            }
            .modal-header h3 {
                margin: 0;
                color: var(--text-primary);
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-secondary);
            }
            .modal-body {
                padding: 1.5rem;
                color: var(--text-secondary);
                line-height: 1.6;
            }
            .modal-footer {
                padding: 1.5rem;
                border-top: 1px solid #e5e7eb;
                text-align: right;
            }
        `;
        document.head.appendChild(modalStyles);
    }
    
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => document.body.removeChild(modal), 300);
    }
}

// Event listeners para botões de informação
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('info-btn')) {
        const moduleType = e.target.getAttribute('data-module');
        let title, content;
        
        switch(moduleType) {
            case 'video-aulas':
                title = 'Vídeo Aulas';
                content = 'Aprenda com especialistas através de conteúdo audiovisual de alta qualidade, com explicações práticas e exemplos reais do mercado financeiro.';
                break;
            case 'simulacoes':
                title = 'Simulações Financeiras';
                content = 'Pratique suas decisões financeiras em um ambiente seguro, testando diferentes cenários de investimento e planejamento.';
                break;
            case 'gamificacao':
                title = 'Gamificação';
                content = 'Torne o aprendizado mais divertido e engajante através de jogos, desafios e conquistas que motivam seu progresso.';
                break;
        }
        
        if (title && content) {
            showInfoModal(title, content);
        }
    }
});

// Função para tracking de eventos (analytics)
function trackEvent(eventName, properties = {}) {
    // Aqui você pode integrar com Google Analytics, Mixpanel, etc.
    console.log('Event tracked:', eventName, properties);
}

// Track clicks nos módulos
document.querySelectorAll('.btn-module').forEach(btn => {
    btn.addEventListener('click', function() {
        const moduleCard = this.closest('.module-card');
        const moduleType = moduleCard.getAttribute('data-module');
        trackEvent('module_click', { module: moduleType });
    });
});

