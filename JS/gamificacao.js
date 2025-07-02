// JavaScript específico para a página de gamificação

// Sistema de gamificação
class GameSystem {
    constructor() {
        this.userData = this.loadUserData();
        this.achievements = this.initializeAchievements();
        this.leaderboard = this.loadLeaderboard();
        this.currentGame = null;
    }

    loadUserData() {
        const defaultData = {
            level: 1,
            xp: 0,
            points: 0,
            badges: 0,
            gamesPlayed: 0,
            totalScore: 0,
            achievements: [],
            lastPlayed: null
        };
        return JSON.parse(localStorage.getItem('gameUserData')) || defaultData;
    }

    saveUserData() {
        localStorage.setItem('gameUserData', JSON.stringify(this.userData));
        this.updateUI();
    }

    initializeAchievements() {
        return [
            {
                id: 'first_game',
                title: 'Primeiro Passo',
                description: 'Jogue seu primeiro jogo',
                icon: 'fas fa-baby',
                requirement: 1,
                type: 'games_played',
                unlocked: false
            },
            {
                id: 'quiz_master',
                title: 'Mestre do Quiz',
                description: 'Acerte 10 perguntas seguidas no quiz',
                icon: 'fas fa-brain',
                requirement: 10,
                type: 'quiz_streak',
                unlocked: false
            },
            {
                id: 'budget_expert',
                title: 'Expert em Orçamento',
                description: 'Complete 5 desafios de orçamento',
                icon: 'fas fa-calculator',
                requirement: 5,
                type: 'budget_completed',
                unlocked: false
            },
            {
                id: 'investor',
                title: 'Investidor Iniciante',
                description: 'Faça seu primeiro investimento virtual',
                icon: 'fas fa-chart-line',
                requirement: 1,
                type: 'investments_made',
                unlocked: false
            },
            {
                id: 'saver',
                title: 'Poupador',
                description: 'Economize R$ 10.000 no jogo de poupança',
                icon: 'fas fa-piggy-bank',
                requirement: 10000,
                type: 'money_saved',
                unlocked: false
            },
            {
                id: 'level_5',
                title: 'Nível 5',
                description: 'Alcance o nível 5',
                icon: 'fas fa-star',
                requirement: 5,
                type: 'level',
                unlocked: false
            },
            {
                id: 'points_1000',
                title: 'Milionário de Pontos',
                description: 'Acumule 1000 pontos',
                icon: 'fas fa-gem',
                requirement: 1000,
                type: 'points',
                unlocked: false
            },
            {
                id: 'daily_player',
                title: 'Jogador Diário',
                description: 'Jogue por 7 dias consecutivos',
                icon: 'fas fa-calendar-check',
                requirement: 7,
                type: 'daily_streak',
                unlocked: false
            }
        ];
    }

    loadLeaderboard() {
        const defaultLeaderboard = [
            { name: 'Ana Silva', level: 8, score: 2450 },
            { name: 'João Santos', level: 7, score: 2100 },
            { name: 'Maria Costa', level: 6, score: 1850 },
            { name: 'Pedro Lima', level: 6, score: 1720 },
            { name: 'Carla Souza', level: 5, score: 1500 },
            { name: 'Lucas Oliveira', level: 5, score: 1350 },
            { name: 'Fernanda Rocha', level: 4, score: 1200 },
            { name: 'Roberto Alves', level: 4, score: 1050 },
            { name: 'Juliana Mendes', level: 3, score: 900 },
            { name: 'Carlos Ferreira', level: 3, score: 750 }
        ];
        return JSON.parse(localStorage.getItem('gameLeaderboard')) || defaultLeaderboard;
    }

    addXP(amount) {
        this.userData.xp += amount;
        this.userData.points += amount;
        
        // Verificar se subiu de nível
        const newLevel = Math.floor(this.userData.xp / 100) + 1;
        if (newLevel > this.userData.level) {
            this.userData.level = newLevel;
            this.showLevelUp(newLevel);
        }
        
        this.checkAchievements();
        this.saveUserData();
    }

    showLevelUp(level) {
        showNotification(`Parabéns! Você alcançou o nível ${level}!`, 'success');
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && this.checkAchievementRequirement(achievement)) {
                this.unlockAchievement(achievement);
            }
        });
    }

    checkAchievementRequirement(achievement) {
        switch(achievement.type) {
            case 'games_played':
                return this.userData.gamesPlayed >= achievement.requirement;
            case 'level':
                return this.userData.level >= achievement.requirement;
            case 'points':
                return this.userData.points >= achievement.requirement;
            default:
                return false;
        }
    }

    unlockAchievement(achievement) {
        achievement.unlocked = true;
        this.userData.achievements.push(achievement.id);
        this.userData.badges++;
        this.showAchievementUnlocked(achievement);
        this.saveUserData();
    }

    showAchievementUnlocked(achievement) {
        const modal = document.getElementById('achievementModal');
        const text = document.getElementById('achievementText');
        text.textContent = `Você desbloqueou: ${achievement.title}!`;
        modal.classList.add('active');
    }

    updateUI() {
        // Atualizar estatísticas do usuário
        document.getElementById('userLevel').textContent = this.userData.level;
        document.getElementById('userPoints').textContent = this.userData.points;
        document.getElementById('userBadges').textContent = this.userData.badges;
        
        // Atualizar barra de progresso
        document.getElementById('currentLevel').textContent = this.userData.level;
        document.getElementById('currentXP').textContent = this.userData.xp % 100;
        document.getElementById('nextLevelXP').textContent = 100;
        
        const progressPercentage = (this.userData.xp % 100);
        document.getElementById('xpProgress').style.width = `${progressPercentage}%`;
        
        // Atualizar conquistas
        this.renderAchievements();
        this.renderLeaderboard();
    }

    renderAchievements() {
        const grid = document.getElementById('achievementsGrid');
        grid.innerHTML = this.achievements.map(achievement => `
            <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">
                    <i class="${achievement.icon}"></i>
                </div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-description">${achievement.description}</div>
                ${!achievement.unlocked ? `<div class="achievement-progress">Progresso: ${this.getAchievementProgress(achievement)}</div>` : ''}
            </div>
        `).join('');
    }

    getAchievementProgress(achievement) {
        let current = 0;
        switch(achievement.type) {
            case 'games_played':
                current = this.userData.gamesPlayed;
                break;
            case 'level':
                current = this.userData.level;
                break;
            case 'points':
                current = this.userData.points;
                break;
        }
        return `${Math.min(current, achievement.requirement)}/${achievement.requirement}`;
    }

    renderLeaderboard() {
        const list = document.getElementById('leaderboardList');
        list.innerHTML = this.leaderboard.map((player, index) => {
            const rank = index + 1;
            let rankClass = 'other';
            if (rank === 1) rankClass = 'gold';
            else if (rank === 2) rankClass = 'silver';
            else if (rank === 3) rankClass = 'bronze';
            
            return `
                <div class="leaderboard-item">
                    <div class="rank ${rankClass}">${rank}</div>
                    <div class="player-info">
                        <div class="player-name">${player.name}</div>
                        <div class="player-level">Nível ${player.level}</div>
                    </div>
                    <div class="player-score">${player.score}</div>
                </div>
            `;
        }).join('');
    }
}

// Jogos
class QuizGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.questions = [
            {
                question: "Qual é a regra básica para uma reserva de emergência?",
                options: ["1-2 meses de gastos", "3-6 meses de gastos", "1 ano de gastos", "Não é necessária"],
                correct: 1
            },
            {
                question: "O que significa diversificação de investimentos?",
                options: ["Investir tudo em uma única aplicação", "Espalhar investimentos em diferentes tipos", "Investir apenas em poupança", "Não investir"],
                correct: 1
            },
            {
                question: "Qual é a principal vantagem dos juros compostos?",
                options: ["Rendimento sobre o rendimento", "Menor risco", "Maior liquidez", "Isenção de impostos"],
                correct: 0
            },
            {
                question: "O que é inflação?",
                options: ["Aumento dos preços", "Diminuição dos preços", "Estabilidade dos preços", "Variação cambial"],
                correct: 0
            },
            {
                question: "Qual é o primeiro passo para organizar as finanças?",
                options: ["Investir", "Fazer um orçamento", "Pedir empréstimo", "Comprar seguros"],
                correct: 1
            }
        ];
        this.currentQuestion = 0;
        this.score = 0;
        this.streak = 0;
    }

    start() {
        this.currentQuestion = 0;
        this.score = 0;
        this.streak = 0;
        this.showQuestion();
    }

    showQuestion() {
        const question = this.questions[this.currentQuestion];
        const content = `
            <div class="quiz-container">
                <div class="quiz-header">
                    <h4>Pergunta ${this.currentQuestion + 1} de ${this.questions.length}</h4>
                    <div class="quiz-score">Pontuação: ${this.score}</div>
                </div>
                <div class="quiz-question">
                    <h3>${question.question}</h3>
                </div>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <button class="quiz-option" onclick="gameSystem.currentGame.answerQuestion(${index})">
                            ${option}
                        </button>
                    `).join('')}
                </div>
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((this.currentQuestion) / this.questions.length) * 100}%"></div>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('gameContent').innerHTML = content;
    }

    answerQuestion(selectedIndex) {
        const question = this.questions[this.currentQuestion];
        const isCorrect = selectedIndex === question.correct;
        
        if (isCorrect) {
            this.score += 20;
            this.streak++;
            showNotification('Resposta correta! +20 pontos', 'success');
        } else {
            this.streak = 0;
            showNotification('Resposta incorreta!', 'error');
        }
        
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            setTimeout(() => this.showQuestion(), 1500);
        } else {
            setTimeout(() => this.endGame(), 1500);
        }
    }

    endGame() {
        this.gameSystem.userData.gamesPlayed++;
        this.gameSystem.addXP(this.score);
        
        const content = `
            <div class="game-result">
                <h3>Quiz Finalizado!</h3>
                <div class="result-stats">
                    <div class="stat-item">
                        <span class="stat-label">Pontuação Final:</span>
                        <span class="stat-value">${this.score}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Acertos:</span>
                        <span class="stat-value">${this.score / 20} de ${this.questions.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">XP Ganho:</span>
                        <span class="stat-value">+${this.score}</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-primary" onclick="gameSystem.currentGame.start()">Jogar Novamente</button>
                    <button class="btn btn-secondary" onclick="closeGame()">Fechar</button>
                </div>
            </div>
        `;
        document.getElementById('gameContent').innerHTML = content;
    }
}

class BudgetGame {
    constructor(gameSystem) {
        this.gameSystem = gameSystem;
        this.salary = 5000;
        this.expenses = {
            housing: 0,
            food: 0,
            transport: 0,
            entertainment: 0,
            savings: 0
        };
        this.month = 1;
        this.score = 0;
    }

    start() {
        this.month = 1;
        this.score = 0;
        this.salary = 5000;
        this.resetExpenses();
        this.showBudgetInterface();
    }

    resetExpenses() {
        this.expenses = {
            housing: 0,
            food: 0,
            transport: 0,
            entertainment: 0,
            savings: 0
        };
    }

    showBudgetInterface() {
        const content = `
            <div class="budget-game">
                <div class="budget-header">
                    <h4>Desafio do Orçamento - Mês ${this.month}</h4>
                    <div class="budget-info">
                        <span>Salário: ${formatCurrency(this.salary)}</span>
                        <span>Pontuação: ${this.score}</span>
                    </div>
                </div>
                <div class="budget-categories">
                    ${Object.keys(this.expenses).map(category => `
                        <div class="budget-category">
                            <label>${this.getCategoryName(category)}:</label>
                            <input type="range" min="0" max="${this.salary}" value="${this.expenses[category]}" 
                                   oninput="gameSystem.currentGame.updateExpense('${category}', this.value)">
                            <span class="expense-value">${formatCurrency(this.expenses[category])}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="budget-summary">
                    <div class="summary-item">
                        <span>Total Gastos:</span>
                        <span>${formatCurrency(this.getTotalExpenses())}</span>
                    </div>
                    <div class="summary-item">
                        <span>Restante:</span>
                        <span class="${this.getRemaining() < 0 ? 'negative' : 'positive'}">
                            ${formatCurrency(this.getRemaining())}
                        </span>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="gameSystem.currentGame.submitBudget()" 
                        ${this.getRemaining() < 0 ? 'disabled' : ''}>
                    Confirmar Orçamento
                </button>
            </div>
        `;
        document.getElementById('gameContent').innerHTML = content;
    }

    getCategoryName(category) {
        const names = {
            housing: 'Moradia',
            food: 'Alimentação',
            transport: 'Transporte',
            entertainment: 'Entretenimento',
            savings: 'Poupança'
        };
        return names[category];
    }

    updateExpense(category, value) {
        this.expenses[category] = parseInt(value);
        this.showBudgetInterface();
    }

    getTotalExpenses() {
        return Object.values(this.expenses).reduce((sum, expense) => sum + expense, 0);
    }

    getRemaining() {
        return this.salary - this.getTotalExpenses();
    }

    submitBudget() {
        if (this.getRemaining() < 0) return;
        
        let monthScore = 0;
        
        // Avaliar orçamento
        if (this.expenses.savings >= this.salary * 0.2) monthScore += 30; // 20% poupança
        if (this.expenses.housing <= this.salary * 0.3) monthScore += 20; // Moradia até 30%
        if (this.expenses.food <= this.salary * 0.15) monthScore += 15; // Alimentação até 15%
        if (this.getRemaining() >= 0) monthScore += 10; // Não gastou mais que ganha
        
        this.score += monthScore;
        this.month++;
        
        if (this.month <= 3) {
            showNotification(`Mês ${this.month - 1} concluído! +${monthScore} pontos`, 'success');
            this.salary += 200; // Aumento salarial
            this.resetExpenses();
            setTimeout(() => this.showBudgetInterface(), 1500);
        } else {
            this.endGame();
        }
    }

    endGame() {
        this.gameSystem.userData.gamesPlayed++;
        this.gameSystem.addXP(this.score);
        
        const content = `
            <div class="game-result">
                <h3>Desafio Concluído!</h3>
                <div class="result-stats">
                    <div class="stat-item">
                        <span class="stat-label">Pontuação Final:</span>
                        <span class="stat-value">${this.score}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Meses Completados:</span>
                        <span class="stat-value">3</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">XP Ganho:</span>
                        <span class="stat-value">+${this.score}</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-primary" onclick="gameSystem.currentGame.start()">Jogar Novamente</button>
                    <button class="btn btn-secondary" onclick="closeGame()">Fechar</button>
                </div>
            </div>
        `;
        document.getElementById('gameContent').innerHTML = content;
    }
}

// Instância global do sistema de jogos
let gameSystem;

document.addEventListener('DOMContentLoaded', function() {
    gameSystem = new GameSystem();
    gameSystem.updateUI();
});

// Funções globais
function startGame(gameType) {
    const modal = document.getElementById('gameModal');
    const title = document.getElementById('gameTitle');
    
    switch(gameType) {
        case 'quiz':
            title.textContent = 'Quiz Financeiro';
            gameSystem.currentGame = new QuizGame(gameSystem);
            break;
        case 'budget':
            title.textContent = 'Desafio do Orçamento';
            gameSystem.currentGame = new BudgetGame(gameSystem);
            break;
        case 'investment':
            title.textContent = 'Simulador de Investimentos';
            showNotification('Jogo em desenvolvimento!', 'info');
            return;
        case 'savings':
            title.textContent = 'Corrida da Poupança';
            showNotification('Jogo em desenvolvimento!', 'info');
            return;
    }
    
    modal.classList.add('active');
    gameSystem.currentGame.start();
}

function closeGame() {
    const modal = document.getElementById('gameModal');
    modal.classList.remove('active');
    gameSystem.currentGame = null;
}

function closeAchievementModal() {
    const modal = document.getElementById('achievementModal');
    modal.classList.remove('active');
}

function showLeaderboard(period) {
    // Remover classe active de todos os botões
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    // Adicionar classe active ao botão clicado
    event.target.classList.add('active');
    
    // Aqui você pode implementar diferentes períodos
    gameSystem.renderLeaderboard();
}

// Estilos CSS adicionais para os jogos
const gameStyles = document.createElement('style');
gameStyles.textContent = `
    .quiz-container {
        text-align: center;
    }
    
    .quiz-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--border-color);
    }
    
    .quiz-question h3 {
        font-size: 1.3rem;
        margin-bottom: 2rem;
        color: var(--text-primary);
    }
    
    .quiz-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .quiz-option {
        padding: 1rem;
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: var(--transition);
        font-size: 1rem;
    }
    
    .quiz-option:hover {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }
    
    .budget-game {
        max-width: 600px;
        margin: 0 auto;
    }
    
    .budget-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .budget-info {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
        font-weight: 600;
    }
    
    .budget-categories {
        margin-bottom: 2rem;
    }
    
    .budget-category {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        background: var(--bg-secondary);
        border-radius: var(--border-radius);
    }
    
    .budget-category label {
        min-width: 120px;
        font-weight: 500;
    }
    
    .budget-category input[type="range"] {
        flex: 1;
    }
    
    .expense-value {
        min-width: 100px;
        text-align: right;
        font-weight: 600;
        color: var(--primary-color);
    }
    
    .budget-summary {
        background: var(--bg-secondary);
        padding: 1rem;
        border-radius: var(--border-radius);
        margin-bottom: 2rem;
    }
    
    .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .negative {
        color: #ef4444;
    }
    
    .positive {
        color: var(--secondary-color);
    }
    
    .game-result {
        text-align: center;
    }
    
    .result-stats {
        background: var(--bg-secondary);
        padding: 2rem;
        border-radius: var(--border-radius);
        margin: 2rem 0;
    }
    
    .stat-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }
    
    .stat-value {
        font-weight: 700;
        color: var(--primary-color);
    }
    
    .result-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
`;
document.head.appendChild(gameStyles);

