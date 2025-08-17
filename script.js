 // ====== ENHANCED GLOBAL VARIABLES ======
    let calculationCount = 0;
    let maxNum = 0;
    let calculationTimes = [];
    let calculationHistory = [];

    // ====== INITIALIZATION ======
    document.addEventListener('DOMContentLoaded', function() {
        updateTime();
        setInterval(updateTime, 1000);
        loadStoredData();
        
        // Enhanced event listeners
        const inputField = document.getElementById("inputNumbers");
        inputField.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                hitung();
            }
        });
        
        inputField.addEventListener("input", updateInputProgress);
    });

    // ====== ENHANCED TIME MANAGEMENT ======
    function updateTime() {
        const now = new Date();
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString('id-ID');
        }
    }

    // ====== INPUT PROGRESS ======
    function updateInputProgress() {
        const input = document.getElementById("inputNumbers").value.trim();
        const numbers = input.split(/[\s,]+/).filter(n => n && !isNaN(n) && Number(n) > 0);
        const progress = Math.min((numbers.length / 5) * 100, 100);
        document.getElementById("inputProgress").style.width = progress + "%";
    }

    // ====== QUICK INPUT FUNCTIONS ======
    function setQuickInput(numbers) {
        document.getElementById("inputNumbers").value = numbers;
        updateInputProgress();
        
        // Auto calculate after short delay
        setTimeout(() => {
            hitung();
        }, 500);
    }

    // ====== ENHANCED SIDEBAR MANAGEMENT ======
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
        if (n === 2) return true;
        if (n % 2 === 0) return false;
        for (let i = 3; i * i <= n; i += 2) {
            if (n % i === 0) return false;
        }
        return true;
    }

    function primeFactors(n) {
        const factors = [];
        let d = 2;
        while (d * d <= n) {
            while (n % d === 0) {
                factors.push(d);
                n /= d;
            }
            d++;
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

    // ====== ENHANCED FACTOR TREE LOGIC ======
    function buildFactorTree(n) {
        if (n === 1) return null;
        
        if (isPrime(n)) {
            return { value: n, children: [], isPrime: true };
        }

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
        const tooltip = node.isPrime ? 'Bilangan Prima' : 'Bilangan Komposit';
        
        let html = `<div class="tree" style="animation-delay: ${depth * 0.1}s">`;
        html += `<div class="node ${primeClass} tooltip" data-tooltip="${tooltip}">${node.value}</div>`;
        
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

    // ====== ENHANCED INPUT VALIDATION ======
    function validateInput(nums) {
        if (nums.length < 2) {
            showNotification("Masukkan minimal 2 angka positif!", "error");
            return false;
        }

        if (nums.some(n => n > 10000)) {
            showNotification("Gunakan angka yang lebih kecil (maksimal 10000) untuk performa optimal!", "warning");
            return false;
        }

        if (nums.some(n => n <= 0)) {
            showNotification("Gunakan hanya angka positif!", "error");
            return false;
        }

        return true;
    }

    // ====== ENHANCED NOTIFICATION SYSTEM ======
    function showNotification(message, type = "info") {
        const colors = {
            error: "bg-red-500",
            warning: "bg-yellow-500",
            success: "bg-green-500",
            info: "bg-blue-500"
        };
        
        const icons = {
            error: "❌",
            warning: "⚠️",
            success: "✅",
            info: "ℹ️"
        };

        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        toast.innerHTML = `
            <div class="flex items-center">
                <span class="text-xl mr-2">${icons[type]}</span>
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

    // ====== ENHANCED STATISTICS MANAGEMENT ======
    function updateStatistics(nums, calculationTime) {
        calculationCount++;
        maxNum = Math.max(maxNum, ...nums);
        calculationTimes.push(calculationTime);
        
        // Keep only last 10 calculation times
        if (calculationTimes.length > 10) {
            calculationTimes = calculationTimes.slice(-10);
        }
        
        const avgTime = calculationTimes.reduce((a, b) => a + b, 0) / calculationTimes.length;
        
        const totalCalcElement = document.getElementById('totalCalculations');
        const maxNumElement = document.getElementById('maxNumber');
        const avgTimeElement = document.getElementById('avgTime');
        
        if (totalCalcElement) totalCalcElement.textContent = calculationCount;
        if (maxNumElement) maxNumElement.textContent = maxNum;
        if (avgTimeElement) avgTimeElement.textContent = avgTime.toFixed(1) + 'ms';
        
        // Save to storage
        saveToStorage();
    }

    // ====== STORAGE MANAGEMENT ======
    function saveToStorage() {
        const data = {
            calculationCount,
            maxNum,
            calculationTimes,
            calculationHistory: calculationHistory.slice(-10) // Keep last 10
        };
        
        try {
            // Using variables instead of localStorage for Claude.ai compatibility
            window.mathDashData = data;
        } catch (error) {
            console.warn('Could not save data:', error);
        }
    }

    function loadStoredData() {
        try {
            const data = window.mathDashData || {
                calculationCount: 0,
                maxNum: 0,
                calculationTimes: [],
                calculationHistory: []
            };
            
            calculationCount = data.calculationCount || 0;
            maxNum = data.maxNum || 0;
            calculationTimes = data.calculationTimes || [];
            calculationHistory = data.calculationHistory || [];
            
            // Update UI
            updateStatisticsDisplay();
        } catch (error) {
            console.warn('Could not load stored data:', error);
        }
    }

    function updateStatisticsDisplay() {
        const totalCalcElement = document.getElementById('totalCalculations');
        const maxNumElement = document.getElementById('maxNumber');
        const avgTimeElement = document.getElementById('avgTime');
        
        if (totalCalcElement) totalCalcElement.textContent = calculationCount;
        if (maxNumElement) maxNumElement.textContent = maxNum || '-';
        
        if (avgTimeElement && calculationTimes.length > 0) {
            const avgTime = calculationTimes.reduce((a, b) => a + b, 0) / calculationTimes.length;
            avgTimeElement.textContent = avgTime.toFixed(1) + 'ms';
        }
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
            <div class="enhanced-card p-6 card-hover">
                <div class="flex items-center mb-3">
                    <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                        <span class="text-2xl">🎯</span>
                    </div>
                    <div>
                        <div class="text-sm text-gray-400">Faktor Persekutuan Terbesar</div>
                        <div class="text-3xl font-bold text-green-400">FPB = ${gcd}</div>
                    </div>
                </div>
                <div class="text-xs text-gray-500">Greatest Common Divisor</div>
            </div>
            
            <div class="enhanced-card p-6 card-hover">
                <div class="flex items-center mb-3">
                    <div class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-3">
                        <span class="text-2xl">⚡</span>
                    </div>
                    <div>
                        <div class="text-sm text-gray-400">Kelipatan Persekutuan Terkecil</div>
                        <div class="text-3xl font-bold text-yellow-400">KPK = ${lcm}</div>
                    </div>
                </div>
                <div class="text-xs text-gray-500">Least Common Multiple</div>
            </div>
            
            <div class="enhanced-card p-6 card-hover">
                <div class="flex items-center mb-3">
                    <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                        <span class="text-2xl">📊</span>
                    </div>
                    <div>
                        <div class="text-sm text-gray-400">Jumlah Angka</div>
                        <div class="text-3xl font-bold text-blue-400">${nums.length}</div>
                    </div>
                </div>
                <div class="text-xs text-gray-500">Input Numbers</div>
            </div>
            
            <div class="enhanced-card p-6 card-hover">
                <div class="flex items-center mb-3">
                    <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                        <span class="text-2xl">🔢</span>
                    </div>
                    <div>
                        <div class="text-sm text-gray-400">Rasio KPK/FPB</div>
                        <div class="text-3xl font-bold text-purple-400">${(lcm/gcd).toFixed(1)}</div>
                    </div>
                </div>
                <div class="text-xs text-gray-500">Mathematical Ratio</div>
            </div>
        `;
    }

    function generateDetailedResults(details) {
        let html = '';
        details.forEach((d, index) => {
            const primeCount = d.factors.filter(f => isPrime(f)).length;
            const compositeCount = d.factors.length - primeCount;
            
            html += `
                <div class="enhanced-card p-6 card-hover slide-in" style="animation-delay: ${index * 0.1}s">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-bold text-blue-300">Analisis Lengkap: ${d.num}</h3>
                        <div class="flex space-x-2">
                            <span class="text-sm px-2 py-1 bg-${isPrime(d.num) ? 'green' : 'blue'}-500/20 rounded-full">
                                ${isPrime(d.num) ? '🟢 Prima' : '🔵 Komposit'}
                            </span>
                            <span class="text-sm text-gray-400">#${index + 1}</span>
                        </div>
                    </div>
                    
                    <div class="grid lg:grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-semibold text-gray-300 mb-3">📋 Informasi Detail</h4>
                            <div class="space-y-3 text-sm">
                                <div class="enhanced-card p-3">
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Faktor Prima:</span>
                                        <span class="text-white font-mono">[${d.factors.join(", ")}]</span>
                                    </div>
                                </div>
                                <div class="enhanced-card p-3">
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Faktorisasi:</span>
                                        <span class="text-white">${formatFactorMap(d.map)}</span>
                                    </div>
                                </div>
                                <div class="enhanced-card p-3">
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Jumlah Faktor:</span>
                                        <span class="text-white">${d.factors.length}</span>
                                    </div>
                                </div>
                                <div class="enhanced-card p-3">
                                    <div class="flex justify-between">
                                        <span class="text-gray-400">Kompleksitas:</span>
                                        <span class="text-white">${d.factors.length > 3 ? 'Tinggi' : d.factors.length > 1 ? 'Sedang' : 'Rendah'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 class="font-semibold text-gray-300 mb-3">🌳 Pohon Faktor Interaktif</h4>
                            <div class="tree-container">
                                ${renderTree(d.tree)}
                            </div>
                            <div class="text-xs text-gray-400 text-center mt-2 space-x-4">
                                <span><span class="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>Komposit</span>
                                <span><span class="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>Prima</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Additional Analysis -->
                    <div class="mt-4 pt-4 border-t border-gray-600">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div class="enhanced-card p-3">
                                <div class="text-lg font-bold text-blue-400">${Math.floor(Math.log2(d.num))}</div>
                                <div class="text-xs text-gray-400">Bit Length</div>
                            </div>
                            <div class="enhanced-card p-3">
                                <div class="text-lg font-bold text-green-400">${d.factors.filter(f => f === 2).length}</div>
                                <div class="text-xs text-gray-400">Faktor 2</div>
                            </div>
                            <div class="enhanced-card p-3">
                                <div class="text-lg font-bold text-yellow-400">${d.num % 2 === 0 ? 'Genap' : 'Ganjil'}</div>
                                <div class="text-xs text-gray-400">Paritas</div>
                            </div>
                            <div class="enhanced-card p-3">
                                <div class="text-lg font-bold text-purple-400">${d.num.toString().length}</div>
                                <div class="text-xs text-gray-400">Digit</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        return html;
    }

    // ====== ENHANCED CHART VISUALIZATION ======
    function drawComparisonChart(nums, gcd, lcm) {
        const canvas = document.getElementById('comparisonCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Setup
        const maxValue = Math.max(...nums, lcm);
        const barWidth = width / (nums.length + 2) * 0.8;
        const spacing = width / (nums.length + 2);
        
        // Draw bars for input numbers
        nums.forEach((num, index) => {
            const barHeight = (num / maxValue) * (height - 40);
            const x = spacing * (index + 1) - barWidth / 2;
            const y = height - barHeight - 20;
            
            // Gradient
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, '#3b82f6');
            gradient.addColorStop(1, '#1d4ed8');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Label
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(num.toString(), spacing * (index + 1), height - 5);
        });
        
        // Draw GCD and LCM indicators
        const gcdY = height - (gcd / maxValue) * (height - 40) - 20;
        const lcmY = height - (lcm / maxValue) * (height - 40) - 20;
        
        // GCD line
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, gcdY);
        ctx.lineTo(width, gcdY);
        ctx.stroke();
        
        // LCM line
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(0, lcmY);
        ctx.lineTo(width, lcmY);
        ctx.stroke();
        
        // Reset line style
        ctx.setLineDash([]);
        
        // Legend
        ctx.font = '10px Arial';
        ctx.fillStyle = '#10b981';
        ctx.fillText(`FPB: ${gcd}`, 10, 15);
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`KPK: ${lcm}`, 10, 30);
    }

    // ====== MAIN CALCULATION FUNCTION ======
    function hitung() {
        const startTime = performance.now();
        
        try {
            // Get and parse input
            const input = document.getElementById("inputNumbers").value.trim();
            const nums = input.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n > 0);

            // Validate input
            if (!validateInput(nums)) {
                return;
            }

            // Calculate GCD and LCM
            const gcd = computeGCDMany(nums);
            const lcm = computeLCMMany(nums);
            
            const endTime = performance.now();
            const calculationTime = endTime - startTime;

            // Update statistics
            updateStatistics(nums, calculationTime);
            
            // Add to history
            calculationHistory.unshift({
                numbers: nums,
                gcd: gcd,
                lcm: lcm,
                timestamp: new Date().toISOString(),
                time: calculationTime
            });

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
            
            // Draw comparison chart
            setTimeout(() => drawComparisonChart(nums, gcd, lcm), 100);

            // Close sidebar on mobile after calculation
            if (window.innerWidth < 1024) {
                toggleSidebar();
            }

            // Show success notification
            showNotification(`Perhitungan selesai dalam ${calculationTime.toFixed(1)}ms!`, "success");

        } catch (error) {
            console.error('Error in calculation:', error);
            showNotification("Terjadi kesalahan dalam perhitungan. Silakan coba lagi.", "error");
        }
    }

    // ====== UTILITY FUNCTIONS ======
    function clearAll() {
        const inputElement = document.getElementById("inputNumbers");
        const welcomeCard = document.getElementById('welcomeCard');
        const resultsArea = document.getElementById('resultsArea');
        
        if (inputElement) {
            inputElement.value = "";
            inputElement.focus();
        }
        
        updateInputProgress();
        
        if (welcomeCard) welcomeCard.classList.remove('hidden');
        if (resultsArea) resultsArea.classList.add('hidden');
        
        showNotification("Input dibersihkan!", "info");
    }

    function exportResults() {
        if (calculationHistory.length === 0) {
            showNotification("Tidak ada hasil untuk diekspor!", "warning");
            return;
        }
        
        const latestResult = calculationHistory[0];
        const exportData = {
            numbers: latestResult.numbers,
            gcd: latestResult.gcd,
            lcm: latestResult.lcm,
            timestamp: latestResult.timestamp,
            calculationTime: latestResult.time
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `mathdash_result_${new Date().toISOString().slice(0,10)}.json`;
        link.click();
        
        showNotification("Hasil berhasil diekspor!", "success");
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
            clearAll();
        }
        
        // Ctrl/Cmd + E to export
        if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
            event.preventDefault();
            exportResults();
        }
    });

    // ====== RESPONSIVE UTILITIES ======
    function handleResize() {
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
        
        // Redraw chart if visible
        const canvas = document.getElementById('comparisonCanvas');
        if (canvas && !document.getElementById('resultsArea').classList.contains('hidden')) {
            if (calculationHistory.length > 0) {
                const latest = calculationHistory[0];
                setTimeout(() => drawComparisonChart(latest.numbers, latest.gcd, latest.lcm), 100);
            }
        }
    }

    window.addEventListener('resize', handleResize);

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

    // ====== PERFORMANCE MONITORING ======
    function measurePerformance(fn, label) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${label} took ${(end - start).toFixed(2)} milliseconds`);
        return result;
    }

    // ====== ENHANCED INITIALIZATION ======
    window.addEventListener('load', function() {
        // Preload animations
        document.body.classList.add('loaded');
        
        // Initialize tooltips
        initializeTooltips();
        
        // Show welcome message
        setTimeout(() => {
            showNotification("Selamat datang di MathDash Pro! 🎉", "success");
        }, 1000);
    });

    function initializeTooltips() {
        // Enhanced tooltip functionality is handled by CSS
        console.log("Tooltips initialized");
    }