// JavaScript específico para a página de vídeo aulas

// Dados dos vídeos
const videoData = {
    '1-1': {
        title: 'Introdução à Educação Financeira',
        description: 'Nesta aula introdutória, você aprenderá os conceitos fundamentais da educação financeira e sua importância para uma vida equilibrada.',
        duration: '15:30'
    },
    '1-2': {
        title: 'Conceitos Básicos de Finanças',
        description: 'Entenda os principais termos e conceitos utilizados no mundo das finanças pessoais.',
        duration: '18:45'
    },
    '1-3': {
        title: 'Importância do Planejamento',
        description: 'Descubra por que o planejamento financeiro é essencial para alcançar seus objetivos.',
        duration: '12:20'
    },
    '2-1': {
        title: 'Como Fazer um Orçamento',
        description: 'Aprenda passo a passo como criar e manter um orçamento pessoal eficiente.',
        duration: '22:15'
    },
    '2-2': {
        title: 'Controle de Gastos',
        description: 'Técnicas práticas para controlar e reduzir seus gastos mensais.',
        duration: '19:30'
    },
    '2-3': {
        title: 'Eliminando Dívidas',
        description: 'Estratégias comprovadas para quitar suas dívidas de forma organizada.',
        duration: '25:10'
    },
    '3-1': {
        title: 'Reserva de Emergência',
        description: 'Como construir e manter uma reserva de emergência adequada.',
        duration: '20:45'
    },
    '3-2': {
        title: 'Estratégias de Poupança',
        description: 'Diferentes formas de poupar dinheiro e fazer seu dinheiro render.',
        duration: '17:25'
    },
    '4-1': {
        title: 'Primeiros Passos nos Investimentos',
        description: 'Guia completo para iniciantes no mundo dos investimentos.',
        duration: '28:15'
    },
    '4-2': {
        title: 'Renda Fixa vs Renda Variável',
        description: 'Entenda as diferenças e quando escolher cada tipo de investimento.',
        duration: '24:30'
    },
    '4-3': {
        title: 'Diversificação de Carteira',
        description: 'Como diversificar seus investimentos para reduzir riscos.',
        duration: '21:45'
    },
    '5-1': {
        title: 'Planejamento para Aposentadoria',
        description: 'Como se preparar financeiramente para uma aposentadoria tranquila.',
        duration: '26:40'
    },
    '5-2': {
        title: 'Seguros e Proteção',
        description: 'A importância dos seguros no planejamento financeiro.',
        duration: '18:55'
    }
};

// Estado da aplicação
let currentVideo = null;
let completedVideos = JSON.parse(localStorage.getItem('completedVideos')) || [];
let videoNotes = JSON.parse(localStorage.getItem('videoNotes')) || {};

document.addEventListener('DOMContentLoaded', function() {
    initializeVideoPlayer();
    updateProgress();
    loadCompletedVideos();
    
    // Abrir primeiro módulo por padrão
    toggleModule(1);
});

// Inicializar player de vídeo
function initializeVideoPlayer() {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoControls = document.getElementById('videoControls');
    
    // Event listeners para botões
    document.getElementById('markComplete').addEventListener('click', markVideoComplete);
    document.getElementById('addNotes').addEventListener('click', showNotesSection);
}

// Alternar módulo
function toggleModule(moduleId) {
    const module = document.querySelector(`[data-module="${moduleId}"]`);
    const isActive = module.classList.contains('active');
    
    // Fechar todos os módulos
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    
    // Abrir o módulo clicado se não estava ativo
    if (!isActive) {
        module.classList.add('active');
    }
}

// Reproduzir vídeo
function playVideo(videoId) {
    currentVideo = videoId;
    const video = videoData[videoId];
    
    if (!video) return;
    
    // Atualizar interface do player
    const videoPlayer = document.getElementById('videoPlayer');
    const videoControls = document.getElementById('videoControls');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    
    // Simular carregamento do vídeo
    videoPlayer.innerHTML = `
        <div style="aspect-ratio: 16/9; background: #000; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">
            <div style="text-align: center;">
                <i class="fas fa-play-circle" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.7;"></i>
                <p>Reproduzindo: ${video.title}</p>
                <p style="font-size: 0.9rem; opacity: 0.7;">Duração: ${video.duration}</p>
            </div>
        </div>
    `;
    
    videoTitle.textContent = video.title;
    videoDescription.textContent = video.description;
    videoControls.style.display = 'block';
    
    // Atualizar item ativo na lista
    document.querySelectorAll('.video-item').forEach(item => {
        item.classList.remove('active');
        const status = item.querySelector('.video-status i');
        if (completedVideos.includes(item.getAttribute('data-video'))) {
            status.className = 'fas fa-check-circle completed';
        } else {
            status.className = 'fas fa-circle';
        }
    });
    
    const activeItem = document.querySelector(`[data-video="${videoId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        const status = activeItem.querySelector('.video-status i');
        status.className = 'fas fa-play-circle current';
    }
    
    // Carregar anotações existentes
    loadVideoNotes(videoId);
    
    // Scroll para o player
    videoPlayer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Marcar vídeo como concluído
function markVideoComplete() {
    if (!currentVideo) return;
    
    if (!completedVideos.includes(currentVideo)) {
        completedVideos.push(currentVideo);
        localStorage.setItem('completedVideos', JSON.stringify(completedVideos));
        
        // Atualizar interface
        const activeItem = document.querySelector(`[data-video="${currentVideo}"]`);
        if (activeItem) {
            const status = activeItem.querySelector('.video-status i');
            status.className = 'fas fa-check-circle completed';
        }
        
        updateProgress();
        showNotification('Aula marcada como concluída!', 'success');
        
        // Sugerir próxima aula
        suggestNextVideo();
    } else {
        showNotification('Esta aula já foi marcada como concluída.', 'info');
    }
}

// Carregar vídeos concluídos
function loadCompletedVideos() {
    completedVideos.forEach(videoId => {
        const item = document.querySelector(`[data-video="${videoId}"]`);
        if (item) {
            const status = item.querySelector('.video-status i');
            status.className = 'fas fa-check-circle completed';
        }
    });
}

// Atualizar progresso
function updateProgress() {
    const totalVideos = Object.keys(videoData).length;
    const completedCount = completedVideos.length;
    const progressPercentage = (completedCount / totalVideos) * 100;
    
    const progressFill = document.getElementById('overallProgress');
    const progressText = document.getElementById('progressText');
    
    progressFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `${Math.round(progressPercentage)}% concluído (${completedCount}/${totalVideos} aulas)`;
}

// Sugerir próxima aula
function suggestNextVideo() {
    const videoIds = Object.keys(videoData);
    const currentIndex = videoIds.indexOf(currentVideo);
    
    if (currentIndex < videoIds.length - 1) {
        const nextVideoId = videoIds[currentIndex + 1];
        const nextVideo = videoData[nextVideoId];
        
        setTimeout(() => {
            if (confirm(`Parabéns! Deseja assistir à próxima aula: "${nextVideo.title}"?`)) {
                playVideo(nextVideoId);
            }
        }, 1000);
    } else {
        setTimeout(() => {
            showNotification('Parabéns! Você concluiu todas as aulas!', 'success');
        }, 1000);
    }
}

// Mostrar seção de anotações
function showNotesSection() {
    if (!currentVideo) return;
    
    const notesSection = document.getElementById('notesSection');
    notesSection.style.display = 'block';
    notesSection.scrollIntoView({ behavior: 'smooth' });
    
    document.getElementById('notesTextarea').focus();
}

// Fechar seção de anotações
function closeNotes() {
    const notesSection = document.getElementById('notesSection');
    notesSection.style.display = 'none';
}

// Salvar anotações
function saveNotes() {
    if (!currentVideo) return;
    
    const notesTextarea = document.getElementById('notesTextarea');
    const noteText = notesTextarea.value.trim();
    
    if (!noteText) {
        showNotification('Digite uma anotação antes de salvar.', 'error');
        return;
    }
    
    if (!videoNotes[currentVideo]) {
        videoNotes[currentVideo] = [];
    }
    
    const note = {
        id: Date.now(),
        text: noteText,
        date: new Date().toLocaleString('pt-BR'),
        videoTitle: videoData[currentVideo].title
    };
    
    videoNotes[currentVideo].push(note);
    localStorage.setItem('videoNotes', JSON.stringify(videoNotes));
    
    notesTextarea.value = '';
    displayVideoNotes(currentVideo);
    showNotification('Anotação salva com sucesso!', 'success');
}

// Carregar anotações do vídeo
function loadVideoNotes(videoId) {
    displayVideoNotes(videoId);
}

// Exibir anotações do vídeo
function displayVideoNotes(videoId) {
    const savedNotesDiv = document.getElementById('savedNotes');
    const notes = videoNotes[videoId] || [];
    
    if (notes.length === 0) {
        savedNotesDiv.innerHTML = '<p style="color: var(--text-secondary); font-style: italic;">Nenhuma anotação para esta aula ainda.</p>';
        return;
    }
    
    savedNotesDiv.innerHTML = notes.map(note => `
        <div class="note-item">
            <div class="note-header">
                <span class="note-title">${note.videoTitle}</span>
                <span class="note-date">${note.date}</span>
            </div>
            <div class="note-content">${note.text}</div>
        </div>
    `).join('');
}

// Buscar aulas
function searchVideos(query) {
    const videoItems = document.querySelectorAll('.video-item');
    const searchQuery = query.toLowerCase();
    
    videoItems.forEach(item => {
        const title = item.querySelector('h5').textContent.toLowerCase();
        const videoId = item.getAttribute('data-video');
        const description = videoData[videoId]?.description.toLowerCase() || '';
        
        if (title.includes(searchQuery) || description.includes(searchQuery)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Filtrar por status
function filterByStatus(status) {
    const videoItems = document.querySelectorAll('.video-item');
    
    videoItems.forEach(item => {
        const videoId = item.getAttribute('data-video');
        const isCompleted = completedVideos.includes(videoId);
        
        switch(status) {
            case 'all':
                item.style.display = 'flex';
                break;
            case 'completed':
                item.style.display = isCompleted ? 'flex' : 'none';
                break;
            case 'pending':
                item.style.display = !isCompleted ? 'flex' : 'none';
                break;
        }
    });
}

// Exportar progresso
function exportProgress() {
    const progressData = {
        completedVideos: completedVideos,
        videoNotes: videoNotes,
        totalVideos: Object.keys(videoData).length,
        completionPercentage: Math.round((completedVideos.length / Object.keys(videoData).length) * 100),
        exportDate: new Date().toLocaleString('pt-BR')
    };
    
    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'progresso-video-aulas.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Progresso exportado com sucesso!', 'success');
}

// Resetar progresso
function resetProgress() {
    if (confirm('Tem certeza que deseja resetar todo o seu progresso? Esta ação não pode ser desfeita.')) {
        completedVideos = [];
        videoNotes = {};
        localStorage.removeItem('completedVideos');
        localStorage.removeItem('videoNotes');
        
        // Atualizar interface
        document.querySelectorAll('.video-item').forEach(item => {
            item.classList.remove('active');
            const status = item.querySelector('.video-status i');
            status.className = 'fas fa-circle';
        });
        
        updateProgress();
        document.getElementById('savedNotes').innerHTML = '';
        
        showNotification('Progresso resetado com sucesso!', 'success');
    }
}

