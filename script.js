// ====== GLOBAL VARIABLES ======
let calculationCount = 0;
let maxNum = 0;

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 1000);
    
    // Add event listeners
    document.getElementById("inputNumbers").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            hitung();
        }
    });
});

// ====== TIME MANAGEMENT ======
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('id-ID');
    }
}

// ====== SIDEBAR MANAGEMENT ======
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }
}

// ====== MATHEMATICAL UTILITIES ======
function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) return false;
    }
    return true;
}

function primeFactors(n) {
    const factors = [];
    let i = 2;
    while (i * i <= n) {
        while (n % i === 0) {
            factors.push(i);
            n = n / i;
        }
        i++;
    }
    if (n > 1) factors.push(n);
    return factors;
}

function getFactorMap(factors) {
    const map = {};
    for (const f of factors) {
        map[f] = (map[f] || 0) + 1;
    }
    return map;
}

function formatFactorMap(map) {
    return Object.entries(map)
        .map(([base, exp]) => exp > 1 ? `${base}<sup>${exp}</sup>` : base)
        .join(" × ");
}

function gcdTwo(a, b) {
    return b === 0 ? a : gcdTwo(b, a % b);
}

function lcmTwo(a, b) {
    return (a * b) / gcdTwo(a, b);
}

function computeGCDMany(numbers) {
    return numbers.reduce((acc, n) => gcdTwo(acc, n));
}

function computeLCMMany(numbers) {
    return numbers.reduce((acc, n) => lcmTwo(acc, n));
}

// ====== FACTOR TREE LOGIC ======
function buildFactorTree(n) {
    if (n === 1) return null;
    
    if (isPrime(n)) {
        return { value: n, children: [], isPrime: true };
    }

    // Find the smallest factor
    let smallestFactor = 2;
    while (smallestFactor <= n && n % smallestFactor !== 0) {
        smallestFactor++;
    }

    const otherFactor = n / smallestFactor;

    return {
        value: n,
        children: [
            buildFactorTree(smallestFactor),
            buildFactorTree(otherFactor)
        ].filter(child => child !== null),
        isPrime: false
    };
}

function renderTree(node, depth = 0) {
    if (!node) return "";

    const primeClass = node.isPrime ? 'prime' : '';
    let html = `<div class="tree" style="animation-delay: ${depth * 0.1}s">`;
    html += `<div class="node ${primeClass}" title="${node.isPrime ? 'Bilangan Prima' : 'Bilangan Komposit'}">${node.value}</div>`;
    
    if (node.children && node.children.length > 0) {
        html += `<div class="children">`;
        node.children.forEach(child => {
            html += renderTree(child, depth + 1);
        });
        html += `</div>`;
    }
    html += `</div>`;
    return html;
}

// ====== INPUT VALIDATION ======
function validateInput(nums) {
    if (nums.length < 2) {
        showError("Masukkan minimal 2 angka positif!");
        return false;
    }

    if (nums.some(n => n > 10000)) {
        showError("Gunakan angka yang lebih kecil (maksimal 10000) untuk visualisasi yang optimal!");
        return false;
    }

    if (nums.some(n => n <= 0)) {
        showError("Gunakan hanya angka positif!");
        return false;
    }

    return true;
}

function showError(message) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.remove('translate-x-full'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// ====== STATISTICS MANAGEMENT ======
function updateStatistics(nums) {
    calculationCount++;
    maxNum = Math.max(maxNum, ...nums);
    
    const totalCalcElement = document.getElementById('totalCalculations');
    const maxNumElement = document.getElementById('maxNumber');
    
    if (totalCalcElement) totalCalcElement.textContent = calculationCount;
    if (maxNumElement) maxNumElement.textContent = maxNum;
}

// ====== UI UPDATES ======
function showResults() {
    const welcomeCard = document.getElementById('welcomeCard');
    const resultsArea = document.getElementById('resultsArea');
    
    if (welcomeCard) welcomeCard.classList.add('hidden');
    if (resultsArea) resultsArea.classList.remove('hidden');
}

function generateSummaryCards(gcd, lcm, nums) {
    return `
        <div class="glass-effect rounded-xl p-6 card-hover">
            <div class="flex items-center mb-3">
                <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                    <span class="text-2xl">🎯</span>
                </div>
                <div>
                    <div class="text-sm text-gray-400">Faktor Persekutuan Terbesar</div>
                    <div class="text-2xl font-bold text-green-400">FPB = ${gcd}</div>
                </div>
            </div>
        </div>
        
        <div class="glass-effect rounded-xl p-6 card-hover">
            <div class="flex items-center mb-3">
                <div class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-3">
                    <span class="text-2xl">⚡</span>
                </div>
                <div>
                    <div class="text-sm text-gray-400">Kelipatan Persekutuan Terkecil</div>
                    <div class="text-2xl font-bold text-yellow-400">KPK = ${lcm}</div>
                </div>
            </div>
        </div>
        
        <div class="glass-effect rounded-xl p-6 card-hover">
            <div class="flex items-center mb-3">
                <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                    <span class="text-2xl">📊</span>
                </div>
                <div>
                    <div class="text-sm text-gray-400">Jumlah Angka</div>
                    <div class="text-2xl font-bold text-blue-400">${nums.length}</div>
                </div>
            </div>
        </div>
        
        <div class="glass-effect rounded-xl p-6 card-hover">
            <div class="flex items-center mb-3">
                <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                    <span class="text-2xl">🔢</span>
                </div>
                <div>
                    <div class="text-sm text-gray-400">Angka Terbesar</div>
                    <div class="text-2xl font-bold text-purple-400">${Math.max(...nums)}</div>
                </div>
            </div>
        </div>
    `;
}

function generateDetailedResults(details) {
    let html = '';
    details.forEach((d, index) => {
        html += `
            <div class="glass-effect rounded-xl p-6 card-hover slide-in" style="animation-delay: ${index * 0.1}s">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-blue-300">Analisis: ${d.num}</h3>
                    <span class="text-sm text-gray-400">#${index + 1}</span>
                </div>
                
                <div class="grid lg:grid-cols-2 gap-6">
                    <div>
                        <h4 class="font-semibold text-gray-300 mb-3">📋 Informasi Faktor</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Faktor Prima:</span>
                                <span class="text-white">${d.factors.join(" × ")}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Faktorisasi:</span>
                                <span class="text-white">${formatFactorMap(d.map)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Tipe:</span>
                                <span class="text-white">${isPrime(d.num) ? '🟢 Prima' : '🔵 Komposit'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="font-semibold text-gray-300 mb-3">🌳 Pohon Faktor</h4>
                        <div class="tree-container">
                            ${renderTree(d.tree)}
                        </div>
                        <div class="text-xs text-gray-400 text-center mt-2">
                            <span class="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span>Komposit
                            <span class="ml-3 inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>Prima
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    return html;
}

// ====== MAIN CALCULATION FUNCTION ======
function hitung() {
    try {
        // Get and parse input
        const input = document.getElementById("inputNumbers").value.trim();
        const nums = input.split(/\s+/).map(Number).filter(n => !isNaN(n) && n > 0);

        // Validate input
        if (!validateInput(nums)) {
            return;
        }

        // Calculate GCD and LCM
        const gcd = computeGCDMany(nums);
        const lcm = computeLCMMany(nums);

        // Update statistics
        updateStatistics(nums);

        // Show results area
        showResults();

        // Generate detailed analysis
        const details = nums.map(num => {
            const factors = primeFactors(num);
            const map = getFactorMap(factors);
            return {
                num,
                factors,
                map,
                tree: buildFactorTree(num)
            };
        });

        // Update UI with results
        const summaryCards = document.getElementById('summaryCards');
        const detailedResults = document.getElementById('detailedResults');

        if (summaryCards) {
            summaryCards.innerHTML = generateSummaryCards(gcd, lcm, nums);
        }

        if (detailedResults) {
            detailedResults.innerHTML = generateDetailedResults(details);
        }

        // Close sidebar on mobile after calculation
        if (window.innerWidth < 1024) {
            toggleSidebar();
        }

        // Show success notification
        showSuccessNotification("Perhitungan berhasil!");

    } catch (error) {
        console.error('Error in calculation:', error);
        showError("Terjadi kesalahan dalam perhitungan. Silakan coba lagi.");
    }
}

// ====== NOTIFICATION SYSTEM ======
function showSuccessNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    toast.innerHTML = `
        <div class="flex items-center">
            <span class="text-xl mr-2">✅</span>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.remove('translate-x-full'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ====== UTILITY FUNCTIONS ======
function clearResults() {
    const welcomeCard = document.getElementById('welcomeCard');
    const resultsArea = document.getElementById('resultsArea');
    
    if (welcomeCard) welcomeCard.classList.remove('hidden');
    if (resultsArea) resultsArea.classList.add('hidden');
}

function resetInput() {
    const inputElement = document.getElementById("inputNumbers");
    if (inputElement) {
        inputElement.value = "";
        inputElement.focus();
    }
}

function exportResults() {
    // This function could be extended to export results as PDF or image
    console.log("Export functionality could be implemented here");
}

// ====== KEYBOARD SHORTCUTS ======
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter to calculate
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        hitung();
    }
    
    // Escape to close sidebar on mobile
    if (event.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
            toggleSidebar();
        }
    }
    
    // Ctrl/Cmd + R to reset
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        resetInput();
        clearResults();
    }
});

// ====== RESPONSIVE UTILITIES ======
function handleResize() {
    // Auto-close sidebar on desktop
    if (window.innerWidth >= 1024) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        if (sidebar && sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.remove('-translate-x-full');
        }
        if (overlay && !overlay.classList.contains('hidden')) {
            overlay.classList.add('hidden');
        }
    }
}

window.addEventListener('resize', handleResize);

// ====== PERFORMANCE MONITORING ======
function measurePerformance(fn, label) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${label} took ${(end - start).toFixed(2)} milliseconds`);
    return result;
}

// ====== ACCESSIBILITY IMPROVEMENTS ======
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        if (document.body.contains(announcement)) {
            document.body.removeChild(announcement);
        }
    }, 1000);
}

// ====== THEME MANAGEMENT ======
function initializeTheme() {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ====== LOCAL STORAGE UTILITIES ======
function saveCalculationHistory(nums, gcd, lcm) {
    try {
        const history = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
        const newEntry = {
            numbers: nums,
            gcd: gcd,
            lcm: lcm,
            timestamp: new Date().toISOString()
        };
        
        history.unshift(newEntry);
        
        // Keep only last 10 calculations
        if (history.length > 10) {
            history.splice(10);
        }
        
        localStorage.setItem('calculationHistory', JSON.stringify(history));
    } catch (error) {
        console.warn('Could not save calculation history:', error);
    }
}

function loadCalculationHistory() {
    try {
        return JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    } catch (error) {
        console.warn('Could not load calculation history:', error);
        return [];
    }
}