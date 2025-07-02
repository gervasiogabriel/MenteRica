// JavaScript específico para a página de simulações

// Variáveis globais para os gráficos
let investmentChart = null;
let financingChart = null;
let retirementChart = null;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar simuladores
    initializeSimulators();
    
    // Calcular valores iniciais
    calculateInvestment();
    
    // Event listeners para inputs
    addInputListeners();
});

// Inicializar simuladores
function initializeSimulators() {
    // Configurar Chart.js defaults
    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.color = '#6b7280';
}

// Adicionar listeners para inputs
function addInputListeners() {
    // Investment simulator inputs
    ['initialAmount', 'monthlyContribution', 'annualReturn', 'investmentPeriod'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', debounce(calculateInvestment, 500));
        }
    });
    
    // Financing simulator inputs
    ['propertyValue', 'downPayment', 'interestRate', 'financingPeriod'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', debounce(calculateFinancing, 500));
        }
    });
    
    // Retirement simulator inputs
    ['currentAge', 'retirementAge', 'currentSavings', 'desiredIncome', 'retirementReturn'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', debounce(calculateRetirement, 500));
        }
    });
}

// Mostrar simulador específico
function showSimulator(simulatorType) {
    // Remover classe active de todos os botões e conteúdos
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.simulator-content').forEach(content => content.classList.remove('active'));
    
    // Ativar botão e conteúdo selecionado
    event.target.classList.add('active');
    document.getElementById(`${simulatorType}-simulator`).classList.add('active');
    
    // Calcular valores para o simulador ativo
    switch(simulatorType) {
        case 'investment':
            calculateInvestment();
            break;
        case 'financing':
            calculateFinancing();
            break;
        case 'retirement':
            calculateRetirement();
            break;
    }
}

// Calculadora de Investimentos
function calculateInvestment() {
    const initialAmount = parseFloat(document.getElementById('initialAmount').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const annualReturn = parseFloat(document.getElementById('annualReturn').value) || 0;
    const period = parseInt(document.getElementById('investmentPeriod').value) || 0;
    
    if (period <= 0) return;
    
    const monthlyReturn = annualReturn / 100 / 12;
    const months = period * 12;
    
    // Cálculo do valor futuro com aportes mensais
    let futureValue = initialAmount;
    let totalInvested = initialAmount;
    const monthlyData = [];
    
    for (let month = 1; month <= months; month++) {
        futureValue = futureValue * (1 + monthlyReturn) + monthlyContribution;
        totalInvested += monthlyContribution;
        
        if (month % 12 === 0) {
            monthlyData.push({
                year: month / 12,
                invested: totalInvested,
                value: futureValue
            });
        }
    }
    
    const totalReturn = futureValue - totalInvested;
    const totalPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
    
    // Atualizar resultados
    updateResult('finalAmount', futureValue);
    updateResult('totalInvested', totalInvested);
    updateResult('totalReturn', totalReturn);
    document.getElementById('totalPercentage').textContent = `${totalPercentage.toFixed(1)}%`;
    
    // Atualizar gráfico
    updateInvestmentChart(monthlyData);
}

// Calculadora de Financiamentos
function calculateFinancing() {
    const propertyValue = parseFloat(document.getElementById('propertyValue').value) || 0;
    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    const annualRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const period = parseInt(document.getElementById('financingPeriod').value) || 0;
    
    if (period <= 0 || propertyValue <= downPayment) return;
    
    const financedAmount = propertyValue - downPayment;
    const monthlyRate = annualRate / 100 / 12;
    const months = period * 12;
    
    // Cálculo da parcela usando a fórmula do SAC (Sistema de Amortização Constante)
    const monthlyPayment = financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - financedAmount;
    
    // Atualizar resultados
    updateResult('financedAmount', financedAmount);
    updateResult('monthlyPayment', monthlyPayment);
    updateResult('totalPayment', totalPayment);
    updateResult('totalInterest', totalInterest);
    
    // Dados para o gráfico
    const chartData = [];
    let remainingBalance = financedAmount;
    
    for (let month = 1; month <= Math.min(months, 360); month += 12) {
        const interestPayment = remainingBalance * monthlyRate * 12;
        const principalPayment = (monthlyPayment * 12) - interestPayment;
        remainingBalance -= principalPayment;
        
        chartData.push({
            year: month / 12,
            principal: principalPayment,
            interest: interestPayment,
            balance: Math.max(0, remainingBalance)
        });
    }
    
    // Atualizar gráfico
    updateFinancingChart(chartData);
}

// Planejador de Aposentadoria
function calculateRetirement() {
    const currentAge = parseInt(document.getElementById('currentAge').value) || 0;
    const retirementAge = parseInt(document.getElementById('retirementAge').value) || 0;
    const currentSavings = parseFloat(document.getElementById('currentSavings').value) || 0;
    const desiredIncome = parseFloat(document.getElementById('desiredIncome').value) || 0;
    const retirementReturn = parseFloat(document.getElementById('retirementReturn').value) || 0;
    
    if (retirementAge <= currentAge) return;
    
    const yearsToRetirement = retirementAge - currentAge;
    const monthlyReturn = retirementReturn / 100 / 12;
    
    // Valor necessário para gerar a renda desejada (considerando 25 anos de aposentadoria)
    const requiredAmount = (desiredIncome * 12 * 25) / (retirementReturn / 100);
    
    // Valor futuro das economias atuais
    const futureCurrentSavings = currentSavings * Math.pow(1 + retirementReturn / 100, yearsToRetirement);
    
    // Quanto ainda precisa poupar
    const stillNeed = Math.max(0, requiredAmount - futureCurrentSavings);
    
    // Poupança mensal necessária
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlySavings = stillNeed > 0 ? 
        stillNeed / (((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn) * (1 + monthlyReturn)) : 0;
    
    // Atualizar resultados
    document.getElementById('yearsToRetirement').textContent = `${yearsToRetirement} anos`;
    updateResult('requiredAmount', requiredAmount);
    updateResult('stillNeed', stillNeed);
    updateResult('monthlySavings', monthlySavings);
    
    // Dados para o gráfico
    const chartData = [];
    let accumulated = currentSavings;
    
    for (let year = 0; year <= yearsToRetirement; year++) {
        chartData.push({
            year: currentAge + year,
            accumulated: accumulated,
            target: requiredAmount
        });
        
        if (year < yearsToRetirement) {
            accumulated = accumulated * (1 + retirementReturn / 100) + (monthlySavings * 12);
        }
    }
    
    // Atualizar gráfico
    updateRetirementChart(chartData);
}

// Atualizar resultado com formatação de moeda
function updateResult(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = formatCurrency(value);
        element.classList.add('updated');
        setTimeout(() => element.classList.remove('updated'), 300);
    }
}

// Atualizar gráfico de investimentos
function updateInvestmentChart(data) {
    const ctx = document.getElementById('investmentChart');
    if (!ctx) return;
    
    if (investmentChart) {
        investmentChart.destroy();
    }
    
    investmentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => `Ano ${d.year}`),
            datasets: [
                {
                    label: 'Valor Investido',
                    data: data.map(d => d.invested),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true
                },
                {
                    label: 'Valor Total',
                    data: data.map(d => d.value),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Evolução do Investimento'
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Atualizar gráfico de financiamento
function updateFinancingChart(data) {
    const ctx = document.getElementById('financingChart');
    if (!ctx) return;
    
    if (financingChart) {
        financingChart.destroy();
    }
    
    financingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => `Ano ${Math.round(d.year)}`),
            datasets: [
                {
                    label: 'Amortização',
                    data: data.map(d => d.principal),
                    backgroundColor: '#10b981'
                },
                {
                    label: 'Juros',
                    data: data.map(d => d.interest),
                    backgroundColor: '#ef4444'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Composição das Parcelas Anuais'
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Atualizar gráfico de aposentadoria
function updateRetirementChart(data) {
    const ctx = document.getElementById('retirementChart');
    if (!ctx) return;
    
    if (retirementChart) {
        retirementChart.destroy();
    }
    
    retirementChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => `${d.year} anos`),
            datasets: [
                {
                    label: 'Valor Acumulado',
                    data: data.map(d => d.accumulated),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true
                },
                {
                    label: 'Meta',
                    data: data.map(d => d.target),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderDash: [5, 5],
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Evolução da Poupança para Aposentadoria'
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Validar inputs
function validateInput(inputId, min = 0, max = Infinity) {
    const input = document.getElementById(inputId);
    const value = parseFloat(input.value);
    
    if (isNaN(value) || value < min || value > max) {
        input.classList.add('error');
        return false;
    } else {
        input.classList.remove('error');
        return true;
    }
}

// Salvar simulação
function saveSimulation(type) {
    const simulations = JSON.parse(localStorage.getItem('savedSimulations')) || [];
    let simulationData = {};
    
    switch(type) {
        case 'investment':
            simulationData = {
                type: 'investment',
                name: `Investimento - ${new Date().toLocaleDateString()}`,
                data: {
                    initialAmount: document.getElementById('initialAmount').value,
                    monthlyContribution: document.getElementById('monthlyContribution').value,
                    annualReturn: document.getElementById('annualReturn').value,
                    period: document.getElementById('investmentPeriod').value
                },
                results: {
                    finalAmount: document.getElementById('finalAmount').textContent,
                    totalInvested: document.getElementById('totalInvested').textContent,
                    totalReturn: document.getElementById('totalReturn').textContent
                },
                date: new Date().toISOString()
            };
            break;
        case 'financing':
            simulationData = {
                type: 'financing',
                name: `Financiamento - ${new Date().toLocaleDateString()}`,
                data: {
                    propertyValue: document.getElementById('propertyValue').value,
                    downPayment: document.getElementById('downPayment').value,
                    interestRate: document.getElementById('interestRate').value,
                    period: document.getElementById('financingPeriod').value
                },
                results: {
                    financedAmount: document.getElementById('financedAmount').textContent,
                    monthlyPayment: document.getElementById('monthlyPayment').textContent,
                    totalPayment: document.getElementById('totalPayment').textContent
                },
                date: new Date().toISOString()
            };
            break;
        case 'retirement':
            simulationData = {
                type: 'retirement',
                name: `Aposentadoria - ${new Date().toLocaleDateString()}`,
                data: {
                    currentAge: document.getElementById('currentAge').value,
                    retirementAge: document.getElementById('retirementAge').value,
                    currentSavings: document.getElementById('currentSavings').value,
                    desiredIncome: document.getElementById('desiredIncome').value
                },
                results: {
                    requiredAmount: document.getElementById('requiredAmount').textContent,
                    monthlySavings: document.getElementById('monthlySavings').textContent
                },
                date: new Date().toISOString()
            };
            break;
    }
    
    simulations.push(simulationData);
    localStorage.setItem('savedSimulations', JSON.stringify(simulations));
    showNotification('Simulação salva com sucesso!', 'success');
}

// Carregar simulação salva
function loadSimulation(simulationId) {
    const simulations = JSON.parse(localStorage.getItem('savedSimulations')) || [];
    const simulation = simulations[simulationId];
    
    if (!simulation) return;
    
    // Mostrar o simulador correto
    showSimulator(simulation.type);
    
    // Preencher os campos
    Object.keys(simulation.data).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            input.value = simulation.data[key];
        }
    });
    
    // Recalcular
    switch(simulation.type) {
        case 'investment':
            calculateInvestment();
            break;
        case 'financing':
            calculateFinancing();
            break;
        case 'retirement':
            calculateRetirement();
            break;
    }
    
    showNotification('Simulação carregada!', 'success');
}

// Comparar simulações
function compareSimulations() {
    const simulations = JSON.parse(localStorage.getItem('savedSimulations')) || [];
    
    if (simulations.length < 2) {
        showNotification('Você precisa ter pelo menos 2 simulações salvas para comparar.', 'info');
        return;
    }
    
    // Implementar interface de comparação
    // Esta funcionalidade pode ser expandida conforme necessário
    showNotification('Funcionalidade de comparação em desenvolvimento.', 'info');
}

// Exportar simulação para PDF
function exportToPDF(type) {
    // Esta funcionalidade requer uma biblioteca adicional como jsPDF
    showNotification('Funcionalidade de exportação em desenvolvimento.', 'info');
}

