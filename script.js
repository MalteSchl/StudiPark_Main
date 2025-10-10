// Animation für Zahlencounter
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 1500;
    const start = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing-Funktion für smoothe Animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Erweiterte Chart-Initialisierung für überlappende Balken
function initializeChart() {
    const chartBars = document.querySelectorAll('.chart-bar');
    const tooltip = document.getElementById('chart-tooltip');
    
    chartBars.forEach(bar => {
        const normalValue = parseInt(bar.getAttribute('data-normal'));
        const currentValue = parseInt(bar.getAttribute('data-current'));
        const time = bar.getAttribute('data-time');
        
        const normalBar = bar.querySelector('.normal-bar');
        const currentBar = bar.querySelector('.current-bar');
        
        // Animierte Balken-Höhen mit Verzögerung
        setTimeout(() => {
            normalBar.style.height = `${(normalValue * 1.8)}px`;
            currentBar.style.height = `${(currentValue * 1.8)}px`;
        }, 300);
        
        // Erweiterte Hover-Effekte
        bar.addEventListener('mouseenter', (e) => {
            const rect = bar.getBoundingClientRect();
            const chartRect = document.querySelector('.chart-container').getBoundingClientRect();
            
            const difference = currentValue - normalValue;
            const trend = difference > 0 ? '📈 Höher' : difference < 0 ? '📉 Niedriger' : '➡️ Normal';
            
            tooltip.innerHTML = `
                <div class="tooltip-content">
                    <strong>🕐 ${time}</strong><br>
                    <div class="tooltip-row">
                        <span class="current">Aktuell: ${currentValue}%</span>
                        <span class="normal">Üblich: ${normalValue}%</span>
                    </div>
                    <div class="tooltip-trend">${trend} als üblich (${Math.abs(difference)}%)</div>
                </div>
            `;
            
            tooltip.style.left = (rect.left - chartRect.left + rect.width/2) + 'px';
            tooltip.style.top = (rect.top - chartRect.top - 80) + 'px';
            tooltip.style.opacity = '1';
            
            // Erweiterte Hover-Animation
            normalBar.style.animation = 'barPulse 0.6s ease-in-out';
            currentBar.style.animation = 'barGlow 0.6s ease-in-out';
        });
        
        bar.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            normalBar.style.animation = '';
            currentBar.style.animation = '';
        });
        
        // Click-Effekt
        bar.addEventListener('click', () => {
            bar.style.animation = 'bounce 0.6s ease';
            setTimeout(() => {
                bar.style.animation = '';
            }, 600);
        });
    });
}

// Scroll-Indikator für Modal
function addScrollIndicator() {
    const modalBody = document.getElementById('modal-body');
    const modalContent = document.querySelector('.modal-content');
    
    if (modalBody && modalContent) {
        modalBody.addEventListener('scroll', function() {
            if (this.scrollTop > 20) {
                modalContent.classList.add('scrolled');
            } else {
                modalContent.classList.remove('scrolled');
            }
        });
    }
}

// Erweiterte Modal-Funktionalität mit auslastungsabhängigen Farben
function showDetails(area) {
    const modal = document.getElementById('detail-modal');
    const title = document.getElementById('modal-title');
    
    title.textContent = `Parkplatz ${area.charAt(0).toUpperCase() + area.slice(1)} - Detailansicht`;
    
    // Neue Bereichsaufteilung
    const detailData = {
        ost: [
            { name: 'Bereich A (ganz links)', occupied: 45, total: 60 },
            { name: 'Bereich B (zweite von links)', occupied: 52, total: 60 },
            { name: 'Bereich C (Mitte)', occupied: 38, total: 60 },
            { name: 'Bereich D (zweite von rechts)', occupied: 41, total: 60 },
            { name: 'Bereich E (ganz rechts)', occupied: 39, total: 60 }
        ],
        west: [
            { name: 'Bereich A (ganz links)', occupied: 42, total: 50 },
            { name: 'Bereich B (zweite von links)', occupied: 48, total: 50 },
            { name: 'Bereich C (zweite von rechts)', occupied: 45, total: 50 },
            { name: 'Bereich D (ganz rechts)', occupied: 40, total: 50 }
        ]
    };
    
    const sections = detailData[area];
    const modalBody = document.getElementById('modal-body');
    
    // Funktion zur Bestimmung der Auslastungsfarbe
    function getOccupancyColor(percentage) {
        if (percentage <= 30) {
            return '#28a745'; // Grün für wenig Auslastung
        } else if (percentage <= 50) {
            return '#20c997'; // Teal für niedrig-mittlere Auslastung
        } else if (percentage <= 70) {
            return '#ffc107'; // Gelb für mittlere Auslastung
        } else if (percentage <= 85) {
            return '#fd7e14'; // Orange für hohe Auslastung
        } else {
            return '#dc3545'; // Rot für sehr hohe Auslastung
        }
    }
    
    // Funktion zur Bestimmung des Gradienten
    function getOccupancyGradient(percentage) {
        const color = getOccupancyColor(percentage);
        if (percentage <= 30) {
            return `linear-gradient(90deg, #28a745, #20c997)`;
        } else if (percentage <= 50) {
            return `linear-gradient(90deg, #20c997, #17a2b8)`;
        } else if (percentage <= 70) {
            return `linear-gradient(90deg, #ffc107, #e0a800)`;
        } else if (percentage <= 85) {
            return `linear-gradient(90deg, #fd7e14, #e8590c)`;
        } else {
            return `linear-gradient(90deg, #dc3545, #b02a37)`;
        }
    }
    
    modalBody.innerHTML = `
        <div class="detail-sections">
            <div class="area-info">
                <h3>📊 Übersicht ${area.charAt(0).toUpperCase() + area.slice(1)}</h3>
                <p>${sections.length} Bereiche • Gesamt: ${sections.reduce((sum, s) => sum + s.total, 0)} Plätze</p>
                ${sections.length > 4 ? '<small style="color: var(--light-gray);">💡 Scrollen für alle Bereiche</small>' : ''}
            </div>
            ${sections.map((section, index) => {
                const percentage = Math.round((section.occupied / section.total) * 100);
                const gradient = getOccupancyGradient(percentage);
                
                return `
                    <div class="section" style="animation-delay: ${index * 0.1}s">
                        <h4>${section.name}</h4>
                        <div class="occupancy-bar">
                            <div class="occupied" 
                                 style="width: ${percentage}%; background: ${gradient};" 
                                 data-width="${percentage}"
                                 data-percentage="${percentage}">
                            </div>
                            <span>${section.occupied}/${section.total} belegt (${percentage}%)</span>
                        </div>
                        <div class="section-status ${percentage > 80 ? 'busy' : percentage > 60 ? 'medium' : 'available'}">
                            ${percentage > 85 ? '🔴 Sehr voll' : 
                              percentage > 70 ? '🟠 Fast voll' : 
                              percentage > 50 ? '🟡 Teilweise belegt' : 
                              percentage > 30 ? '🟢 Verfügbar' : '✅ Gut verfügbar'}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Scroll-Indikator hinzufügen
    setTimeout(() => {
        addScrollIndicator();
    }, 100);
    
    // Animiere die Balken im Modal mit auslastungsabhängigen Farben
    setTimeout(() => {
        const occupiedBars = modal.querySelectorAll('.occupied');
        occupiedBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                const percentage = parseFloat(bar.getAttribute('data-percentage'));
                const gradient = getOccupancyGradient(percentage);
                
                bar.style.width = '0%';
                bar.style.background = gradient;
                
                setTimeout(() => {
                    bar.style.width = width + '%';
                    bar.style.transition = 'width 1s ease-out';
                }, 50);
            }, index * 150);
        });
    }, 200);
}


function closeModal() {
    const modal = document.getElementById('detail-modal');
    modal.style.display = 'none';
}

// Zeit-Update
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('de-DE', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    document.getElementById('current-time').textContent = timeString;
    document.getElementById('time-ost').textContent = timeString;
    document.getElementById('time-west').textContent = timeString;
}

// Smooth Scroll für interne Links
function initSmoothScroll() {
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
}

// CSS-Animationen für neue Effekte
const additionalStyle = document.createElement('style');
additionalStyle.textContent = `
    @keyframes barPulse {
        0%, 100% { transform: scaleX(1) translateX(0); }
        50% { transform: scaleX(1.1) translateX(-2px); }
    }
    
    @keyframes barGlow {
        0%, 100% { 
            transform: scaleX(1) translateX(0);
            box-shadow: 0 4px 8px rgba(226, 0, 26, 0.3);
        }
        50% { 
            transform: scaleX(1.1) translateX(2px);
            box-shadow: 0 8px 20px rgba(226, 0, 26, 0.6);
        }
    }
    
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .tooltip-content {
        text-align: center;
    }
    
    .tooltip-row {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin: 0.5rem 0;
    }
    
    .tooltip-trend {
        font-size: 0.85rem;
        margin-top: 0.3rem;
        font-weight: bold;
    }
    
    .details-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(additionalStyle);

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    // Counter-Animation starten
    const counters = document.querySelectorAll('.count');
    
    // Intersection Observer für Counter-Animation
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.animated) {
                animateCounter(entry.target);
                entry.target.animated = true;
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // Chart initialisieren
    initializeChart();
    
    // Zeit aktualisieren
    updateTime();
    setInterval(updateTime, 60000); // Jede Minute
    
    // Smooth Scroll initialisieren
    initSmoothScroll();
    
    // Details-Button Effekte
    const detailsButtons = document.querySelectorAll('.details-btn');
    
    detailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ripple-Effekt
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Modal bei Klick außerhalb schließen
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('detail-modal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard-Support für Modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
});

// Error Handling für fehlende Elemente
function safeQuery(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element nicht gefunden: ${selector}`);
    }
    return element;
}

// Performance-optimierte Scroll-Events
let ticking = false;

function updateScrollEffects() {
    // Hier könnten weitere Scroll-basierte Animationen hinzugefügt werden
    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

window.addEventListener('scroll', requestScrollUpdate);

document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept-btn');

  // Prüfen, ob Cookie-Einwilligung bereits existiert
  if (localStorage.getItem('cookieAccepted') === 'true') {
    banner.classList.add('hidden');
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieAccepted', 'true');
    banner.classList.add('hidden');
  });
});

