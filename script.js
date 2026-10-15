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
        resultDiv.innerHTML = `<p class="text-red-700 font-bold text-lg">You scored ${score}/10. You need at least 4/10 to pass. Please review the theory and refresh the page to try again.</p>`;
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
