// ==========================================
// ROUTER & INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the Simulator page
    if (document.getElementById('process-tbody')) {
        initSimulator();
    }
    // Check if we are on the Theory page
    if (document.getElementById('quiz-form')) {
        initQuiz();
    }
});

// ==========================================
// SIMULATOR LOGIC (simulator.html)
// ==========================================
let currentMode = 'non-preemptive';
let processCounter = 1;
let processes = [];

// Defined fully for Tailwind CDN to pick them up correctly
const processColors = [
    { bg: 'bg-blue-400', border: 'border-blue-400', text: 'text-blue-600' },
    { bg: 'bg-red-400', border: 'border-red-400', text: 'text-red-600' },
    { bg: 'bg-emerald-400', border: 'border-emerald-400', text: 'text-emerald-600' },
    { bg: 'bg-amber-400', border: 'border-amber-400', text: 'text-amber-600' },
    { bg: 'bg-purple-400', border: 'border-purple-400', text: 'text-purple-600' },
    { bg: 'bg-pink-400', border: 'border-pink-400', text: 'text-pink-600' },
    { bg: 'bg-cyan-400', border: 'border-cyan-400', text: 'text-cyan-600' },
    { bg: 'bg-orange-400', border: 'border-orange-400', text: 'text-orange-600' },
    { bg: 'bg-indigo-400', border: 'border-indigo-400', text: 'text-indigo-600' }
];

function initSimulator() {
    resetSimulator();
}

function setMode(mode) {
    currentMode = mode;
    const nonPreBtn = document.getElementById('mode-non-preemptive');
    const preBtn = document.getElementById('mode-preemptive');

    if (mode === 'non-preemptive') {
        nonPreBtn.className = "px-4 py-2 text-sm font-medium rounded-md transition-colors bg-indigo-600 text-white shadow-sm";
        preBtn.className = "px-4 py-2 text-sm font-medium rounded-md transition-colors text-slate-600 hover:bg-slate-100";
    } else {
        preBtn.className = "px-4 py-2 text-sm font-medium rounded-md transition-colors bg-indigo-600 text-white shadow-sm";
        nonPreBtn.className = "px-4 py-2 text-sm font-medium rounded-md transition-colors text-slate-600 hover:bg-slate-100";
    }
    document.getElementById('results-section').classList.add('hidden');
}

function renderInputTable() {
    const tbody = document.getElementById('process-tbody');
    if(!tbody) return;
    tbody.innerHTML = '';
    
    processes.forEach((p, index) => {
        const pColor = processColors[index % processColors.length];
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition-colors';
        tr.innerHTML = `
            <td class="p-3 font-semibold text-slate-700 border-l-4 ${pColor.border}">${p.name}</td>
            <td class="p-3"><input type="number" min="0" class="w-full max-w-[100px] border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" value="${p.at}" onchange="updateProcess(${p.id}, 'at', this.value)"></td>
            <td class="p-3"><input type="number" min="1" class="w-full max-w-[100px] border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" value="${p.bt}" onchange="updateProcess(${p.id}, 'bt', this.value)"></td>
            <td class="p-3"><input type="number" min="0" class="w-full max-w-[100px] border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500" value="${p.priority}" onchange="updateProcess(${p.id}, 'priority', this.value)"></td>
            <td class="p-3 text-center">
                <button onclick="removeProcess(${p.id})" class="text-slate-400 hover:text-red-500 transition-colors p-1" title="Remove Process">
                    <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateProcess(id, field, value) {
    const numVal = parseInt(value);
    const proc = processes.find(p => p.id === id);
    if(proc && !isNaN(numVal)) {
        proc[field] = numVal >= 0 ? numVal : 0;
    }
    document.getElementById('results-section').classList.add('hidden');
}

function addProcess() {
    processes.push({ id: processCounter, name: `P${processCounter}`, at: 0, bt: 1, priority: 1 });
    processCounter++;
    renderInputTable();
    document.getElementById('results-section').classList.add('hidden');
}

function removeProcess(id) {
    if(processes.length <= 1) {
        alert("You must have at least one process.");
        return;
    }
    processes = processes.filter(p => p.id !== id);
    renderInputTable();
    document.getElementById('results-section').classList.add('hidden');
}

function resetSimulator() {
    processes = [
        { id: 1, name: 'P1', at: 0, bt: 5, priority: 2 },
        { id: 2, name: 'P2', at: 1, bt: 4, priority: 1 },
        { id: 3, name: 'P3', at: 2, bt: 2, priority: 3 },
        { id: 4, name: 'P4', at: 4, bt: 1, priority: 4 }
    ];
    processCounter = 5;
    renderInputTable();
    document.getElementById('results-section').classList.add('hidden');
}

function runSimulation() {
    if (processes.length === 0) return;

    let valid = true;
    processes.forEach(p => {
        if (p.bt <= 0) {
            alert(`Process ${p.name} must have a Burst Time greater than 0.`);
            valid = false;
        }
    });
    if(!valid) return;

    let results = currentMode === 'non-preemptive' ? simulateNonPreemptive(processes) : simulatePreemptive(processes);

    renderResultsTable(results.calculatedProcesses);
    renderGanttChart(results.ganttChart);
    
    const resultsSection = document.getElementById('results-section');
    resultsSection.classList.remove('hidden');
    setTimeout(() => { resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
}

function simulateNonPreemptive(inputProcesses) {
    let n = inputProcesses.length;
    let pList = inputProcesses.map(p => ({...p, isCompleted: false}));
    let currentTime = 0, completed = 0;
    let gantt = [];

    while(completed < n) {
        let available = pList.filter(p => p.at <= currentTime && !p.isCompleted);

        if (available.length === 0) {
            let nextArrivals = pList.filter(p => !p.isCompleted).map(p => p.at);
            let nextArrival = Math.min(...nextArrivals);
            gantt.push({name: 'IDLE', start: currentTime, end: nextArrival, isIdle: true});
            currentTime = nextArrival;
            continue;
        }

        available.sort((a, b) => a.priority === b.priority ? a.at - b.at : a.priority - b.priority);

        let currentProc = available[0];
        gantt.push({ name: currentProc.name, id: currentProc.id, start: currentTime, end: currentTime + currentProc.bt });
        
        currentTime += currentProc.bt;

        let index = pList.findIndex(p => p.id === currentProc.id);
        pList[index].isCompleted = true;
        pList[index].ct = currentTime;
        pList[index].tat = pList[index].ct - pList[index].at;
        pList[index].wt = pList[index].tat - pList[index].bt;
        completed++;
    }

    pList.sort((a, b) => a.name.localeCompare(b.name));
    return { calculatedProcesses: pList, ganttChart: gantt };
}

function simulatePreemptive(inputProcesses) {
    let n = inputProcesses.length;
    let pList = inputProcesses.map(p => ({...p, rt: p.bt, isCompleted: false})); 
    let currentTime = 0, completed = 0;
    
    let prevProcId = null;
    let blockStart = 0;
    let gantt = [];

    while(completed < n) {
        let available = pList.filter(p => p.at <= currentTime && !p.isCompleted);

        if (available.length === 0) {
            if (prevProcId !== 'IDLE') {
                if (prevProcId !== null) gantt.push({name: getProcName(prevProcId, pList), id: prevProcId, start: blockStart, end: currentTime, isIdle: prevProcId === 'IDLE'});
                prevProcId = 'IDLE';
                blockStart = currentTime;
            }
            currentTime++;
            continue;
        }

        available.sort((a, b) => a.priority === b.priority ? a.at - b.at : a.priority - b.priority);
        let currentProc = available[0];

        if (prevProcId !== currentProc.id) {
            if (prevProcId !== null) {
                gantt.push({ name: getProcName(prevProcId, pList), id: prevProcId, start: blockStart, end: currentTime, isIdle: prevProcId === 'IDLE' });
            }
            prevProcId = currentProc.id;
            blockStart = currentTime;
        }

        let pIndex = pList.findIndex(p => p.id === currentProc.id);
        pList[pIndex].rt--;
        currentTime++;

        if (pList[pIndex].rt === 0) {
            pList[pIndex].isCompleted = true;
            pList[pIndex].ct = currentTime;
            pList[pIndex].tat = pList[pIndex].ct - pList[pIndex].at;
            pList[pIndex].wt = pList[pIndex].tat - pList[pIndex].bt;
            completed++;
        }
    }

    if (prevProcId !== null) {
        gantt.push({ name: getProcName(prevProcId, pList), id: prevProcId, start: blockStart, end: currentTime, isIdle: prevProcId === 'IDLE' });
    }

    pList.sort((a, b) => a.name.localeCompare(b.name));
    return { calculatedProcesses: pList, ganttChart: gantt };
}

function getProcName(id, pList) {
    if (id === 'IDLE') return 'IDLE';
    const proc = pList.find(p => p.id === id);
    return proc ? proc.name : 'Unknown';
}

function renderResultsTable(calcData) {
    const tbody = document.getElementById('results-tbody');
    tbody.innerHTML = '';
    let totalTat = 0, totalWt = 0;

    calcData.forEach(p => {
        totalTat += p.tat;
        totalWt += p.wt;
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition-colors';
        
        const originalIndex = processes.findIndex(op => op.id === p.id);
        const textColorClass = originalIndex !== -1 ? processColors[originalIndex % processColors.length].text : 'text-slate-800';

        tr.innerHTML = `
            <td class="p-3 font-bold ${textColorClass}">${p.name}</td>
            <td class="p-3">${p.at}</td>
            <td class="p-3">${p.bt}</td>
            <td class="p-3 font-medium text-slate-500">${p.priority}</td>
            <td class="p-3 bg-indigo-50/50 font-semibold text-slate-800">${p.ct}</td>
            <td class="p-3 bg-indigo-50/50 font-semibold text-indigo-700">${p.tat}</td>
            <td class="p-3 bg-indigo-50/50 font-semibold text-indigo-700">${p.wt}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('avg-tat').innerText = (totalTat / calcData.length).toFixed(2);
    document.getElementById('avg-wt').innerText = (totalWt / calcData.length).toFixed(2);
}

function renderGanttChart(ganttData) {
    const chartContainer = document.getElementById('gantt-chart');
    const labelsContainer = document.getElementById('gantt-labels');
    chartContainer.innerHTML = '';
    labelsContainer.innerHTML = '';

    if (ganttData.length === 0) return;

    const totalTime = ganttData[ganttData.length - 1].end - ganttData[0].start;

    if (ganttData[0].start > 0) {
        const startLabel = document.createElement('div');
        startLabel.className = 'absolute bottom-0 -ml-1 text-slate-500 font-medium text-xs';
        startLabel.style.left = '0%';
        startLabel.innerText = '0';
        labelsContainer.appendChild(startLabel);
    }

    ganttData.forEach((block, index) => {
        const widthPercent = ((block.end - block.start) / totalTime) * 100;
        const div = document.createElement('div');
        
        if (block.isIdle) {
            div.className = `gantt-block h-full flex items-center justify-center font-semibold text-slate-500 border-r border-slate-300 bg-slate-200 text-xs`;
        } else {
            const originalIndex = processes.findIndex(p => p.id === block.id);
            const bgColorClass = originalIndex !== -1 ? processColors[originalIndex % processColors.length].bg : 'bg-gray-400';
            div.className = `gantt-block h-full flex items-center justify-center font-bold text-white border-r border-white/30 ${bgColorClass} text-sm cursor-default`;
        }
        
        div.style.width = `${widthPercent}%`;
        div.innerText = block.name;
        chartContainer.appendChild(div);

        const endPos = ((block.end - ganttData[0].start) / totalTime) * 100;
        const label = document.createElement('div');
        label.className = 'absolute top-0 text-slate-800 font-bold';
        if(endPos >= 99) label.style.right = '0';
        else label.style.left = `calc(${endPos}% - 0.5rem)`;
        
        label.innerText = block.end;
        labelsContainer.appendChild(label);
        
        if (index === 0) {
            const startLabel = document.createElement('div');
            startLabel.className = 'absolute top-0 text-slate-800 font-bold';
            startLabel.style.left = '0';
            startLabel.innerText = block.start;
            labelsContainer.appendChild(startLabel);
        }
    });
}

// ==========================================
// QUIZ & CERTIFICATE LOGIC (theory.html)
// ==========================================
const quizQuestions = [
    // 4 Easy
    { q: "1. What dictates the order of execution in Priority Scheduling?", options: ["Arrival Time", "Burst Time", "Assigned Priority Number", "Time Quantum"], ans: 2 },
    { q: "2. In standard simulators (like ours), a lower priority number represents:", options: ["Higher priority", "Lower priority", "Longer burst time", "Error"], ans: 0 },
    { q: "3. If two processes have the exact same priority, how is the tie typically broken?", options: ["Randomly", "Shortest Job First", "Last-In First-Out", "First-Come, First-Served"], ans: 3 },
    { q: "4. In 'Non-Preemptive' scheduling, a running process...", options: ["Is interrupted by higher priority processes", "Keeps the CPU until it completes or waits", "Runs for a specific time quantum", "Changes its own priority"], ans: 1 },
    // 6 Very Difficult
    { q: "5. What is the fundamental issue caused by a strict priority scheduling algorithm in a heavily loaded system?", options: ["Deadlock", "Thrashing", "Starvation (Indefinite Blocking)", "Priority Inversion"], ans: 2 },
    { q: "6. How does the 'Aging' technique mathematically resolve starvation?", options: ["By monotonically decreasing the priority number of waiting processes at regular intervals.", "By killing low priority processes after a timeout.", "By allocating multiple CPUs.", "By increasing the burst time of waiting processes."], ans: 0 },
    { q: "7. Priority Inversion occurs when:", options: ["A low-priority process executes before a high-priority process purely due to arrival time.", "A lower priority process holds a resource/lock needed by a higher priority process.", "The scheduler reverses all priorities dynamically.", "Process priorities are calculated inversely to their burst times."], ans: 1 },
    { q: "8. If Priority is dynamically set to P = 1 / (Burst Time), Priority Scheduling degrades into which algorithm?", options: ["Round Robin", "First Come First Serve", "Shortest Job First", "Multilevel Queue"], ans: 2 },
    { q: "9. If the ready queue is implemented using a Max-Heap data structure based on priority, what is the time complexity to extract the highest priority process?", options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], ans: 1 },
    { q: "10. In a purely preemptive priority system, what dictates the theoretical maximum number of context switches?", options: ["The sum of all burst times.", "The time quantum size.", "The arrival rate of strictly higher-priority processes.", "The degree of multiprogramming."], ans: 2 }
];

function initQuiz() {
    const container = document.getElementById('quiz-questions');
    if(!container) return; // Exit if not on theory page
    
    quizQuestions.forEach((item, index) => {
        let optionsHtml = item.options.map((opt, i) => `
            <label class="block mt-2 text-slate-700 cursor-pointer p-2 rounded transition-colors" id="label-q${index}-o${i}">
                <input type="radio" name="q${index}" value="${i}" class="mr-2 accent-indigo-600"> <span>${opt}</span>
            </label>
        `).join('');
        container.innerHTML += `
            <div class="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200 transition-colors" id="question-container-${index}">
                <p class="font-bold text-slate-800">${item.q}</p>
                ${optionsHtml}
            </div>
        `;
    });
}

function submitQuiz() {
    let score = 0;
    
    quizQuestions.forEach((item, index) => {
        const container = document.getElementById(`question-container-${index}`);
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const selectedValue = selected ? parseInt(selected.value) : -1;
        const allRadios = document.querySelectorAll(`input[name="q${index}"]`);
        
        // Disable inputs so user can't change answers after submission
        allRadios.forEach(radio => radio.disabled = true);

        // Grade the question
        if (selectedValue === item.ans) {
            score++;
            container.classList.replace('bg-slate-50', 'bg-emerald-50');
            container.classList.replace('border-slate-200', 'border-emerald-300');
        } else {
            container.classList.replace('bg-slate-50', 'bg-red-50');
            container.classList.replace('border-slate-200', 'border-red-300');
        }

        // Highlight correct and incorrect answers
        item.options.forEach((opt, i) => {
            const label = document.getElementById(`label-q${index}-o${i}`);
            
            if (i === item.ans) {
                // Correct answer gets green bold text and a checkmark
                label.classList.add('text-emerald-700', 'font-bold', 'bg-emerald-100');
                label.querySelector('span').innerHTML += ' <span class="ml-2">✅</span>';
            } else if (i === selectedValue) {
                // Selected but wrong answer gets red text and a cross
                label.classList.add('text-red-600', 'font-bold', 'bg-red-100');
                label.querySelector('span').innerHTML += ' <span class="ml-2">❌</span>';
            }
        });
    });

    const resultDiv = document.getElementById('quiz-result');
    resultDiv.classList.remove('hidden');

    if (score >= 4) {
        resultDiv.className = 'mt-6 p-4 rounded border bg-emerald-50 border-emerald-300';
        resultDiv.innerHTML = `<p class="text-emerald-700 font-bold text-lg">Congratulations! You scored ${score}/10 and passed the test.</p>`;
        document.getElementById('certificate-section').classList.remove('hidden');
    } else {
        resultDiv.className = 'mt-6 p-4 rounded border bg-red-50 border-red-300';
        resultDiv.innerHTML = `<p class="text-red-700 font-bold text-lg">You scored ${score}/10. You need at least 4/10 to pass. Please refresh the page to try again.</p>`;
        document.getElementById('certificate-section').classList.add('hidden');
    }

    // Hide the submit button to prevent re-submission confusion
    document.getElementById('submit-test-btn').classList.add('hidden');
}

function generateCertificate() {
    const name = document.getElementById('learner-name').value.trim();
    if (!name) {
        alert("Please enter your name to generate the certificate.");
        return;
    }
    
    // Update certificate text
    document.getElementById('cert-name-display').innerText = name;
    
    // Set dynamic date
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('cert-date').innerText = date;
    
    // Switch UI views
    document.getElementById('name-input-form').classList.add('hidden');
    document.getElementById('certificate-display').classList.remove('hidden');
    document.getElementById('cert-actions').classList.remove('hidden');
}

function downloadCertificate() {
    const certElement = document.getElementById('certificate-display');
    const buttonElement = document.querySelector('#cert-actions button');
    const originalText = buttonElement.innerHTML;
    
    // Temporary loading state
    buttonElement.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...`;
    
    html2canvas(certElement, {
        scale: 2, // High resolution
        backgroundColor: "#ffffff",
        logging: false
    }).then(canvas => {
        // Create an image URL from the canvas
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.download = 'OS_AlgoLearn_Certificate.jpg';
        link.href = imgData;
        link.click();
        
        // Reset button
        buttonElement.innerHTML = originalText;
    }).catch(err => {
        console.error("Error generating certificate: ", err);
        buttonElement.innerHTML = originalText;
        alert("Failed to download certificate. Please try again.");
    });
}
