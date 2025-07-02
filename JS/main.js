// Mente Rica - JavaScript Principal

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const courseButtons = document.querySelectorAll('.card-button');
    
    // Toggle do menu mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Animação do ícone hambúrguer
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (nav.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
    }
    
    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
    });
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Animação dos cards ao fazer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar cards para animação
    document.querySelectorAll('.course-card, .mvv-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Funcionalidade dos botões dos cursos
    courseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.course-card');
            const courseTitle = card.querySelector('.card-title').textContent;
            
            // Efeito visual no botão
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px)';
            }, 150);
            
            // Simular ação (pode ser substituído por navegação real)
            showNotification(`Acessando curso: ${courseTitle}`);
        });
    });
    
    // Sistema de notificações
    function showNotification(message) {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Estilos da notificação
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: 'var(--primary-green)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Efeito parallax sutil no hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Validação de formulários (para páginas de login/registro)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#e74c3c';
                    input.style.boxShadow = '0 0 5px rgba(231, 76, 60, 0.3)';
                } else {
                    input.style.borderColor = '#2D5A5A';
                    input.style.boxShadow = 'none';
                }
            });
            
            if (isValid) {
                showNotification('Formulário enviado com sucesso!');
                // Aqui seria feita a submissão real do formulário
            } else {
                showNotification('Por favor, preencha todos os campos obrigatórios.');
            }
        });
    });
    
    // Efeito de digitação no título
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Aplicar efeito de digitação ao título principal
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Aplicar apenas em telas maiores
        if (window.innerWidth > 768) {
            setTimeout(() => {
                typeWriter(heroTitle, originalText, 80);
            }, 500);
        }
    }
    
    // Contador de visitantes (simulado)
    function updateVisitorCounter() {
        const counter = Math.floor(Math.random() * 1000) + 5000;
        const counterElement = document.querySelector('.visitor-counter');
        if (counterElement) {
            counterElement.textContent = counter.toLocaleString('pt-BR');
        }
    }
    
    // Atualizar contador a cada 30 segundos
    updateVisitorCounter();
    setInterval(updateVisitorCounter, 30000);
});

// Função para navegação entre páginas (SPA básico)
function navigateTo(page) {
    // Simular carregamento
    document.body.style.opacity = '0.7';
    
    setTimeout(() => {
        window.location.href = page;
    }, 300);
}

// Função para voltar ao topo
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Adicionar botão de voltar ao topo quando necessário
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset;
    let backToTopButton = document.querySelector('.back-to-top');
    
    if (scrollTop > 300) {
        if (!backToTopButton) {
            backToTopButton = document.createElement('button');
            backToTopButton.className = 'back-to-top';
            backToTopButton.innerHTML = '↑';
            backToTopButton.onclick = scrollToTop;
            
            Object.assign(backToTopButton.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: 'var(--primary-green)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                fontSize: '20px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: '1000',
                transition: 'all 0.3s ease'
            });
            
            document.body.appendChild(backToTopButton);
        }
        backToTopButton.style.opacity = '1';
    } else if (backToTopButton) {
        backToTopButton.style.opacity = '0';
    }
});

