

// Grade point mapping
const gradePoints = {
    'A+': 4.00, 'A': 3.75, 'A-': 3.50,
    'B+': 3.25, 'B': 3.00, 'B-': 2.75,
    'C+': 2.50, 'C': 2.25, 'C-': 2.00,
    'F': 0.00
};

let courseCounter = 0;
let semesterCounter = 0;
let semesters = [];
let previousSemesterCount = 0;

// Initialize the calculator with first semester
function initializeCalculator() {
    semesters = [];
    semesterCounter = 0;
    document.getElementById('semestersContainer').innerHTML = '';
    addNewSemester();
}

// Add new semester
function addNewSemester() {
    semesterCounter++;
    const regularSemesterCount = semesters.filter(s => !s.isPrevious).length;
    const actualSemesterNumber = previousSemesterCount + regularSemesterCount + 1;
    const semester = {
        id: semesterCounter,
        name: `Semester ${actualSemesterNumber}`,
        courses: [],
        courseCounter: 0,
        isPrevious: false
    };
    
    semesters.push(semester);
    renderSemester(semester);
    
    // Add initial 4 course rows
    for (let i = 0; i < 4; i++) {
        addCourseRow(semester.id);
    }
}

// Render semester section
function renderSemester(semester) {
    const container = document.getElementById('semestersContainer');
    
    const semesterDiv = document.createElement('div');
    semesterDiv.className = 'semester-section';
    if (semester.isPrevious) {
        semesterDiv.classList.add('previous-semester-card');
    }
    semesterDiv.id = `semester-${semester.id}`;
    
    const deleteButton = '';
    
    if (semester.isPrevious) {
        semesterDiv.innerHTML = `
            <div class="semester-header">
                <div class="semester-title">${semester.name}</div>
                <div style="display: flex; align-items: center;">
                    <div class="semester-stats">
                        <div class="semester-stat">
                            <div class="semester-stat-value" id="semesterCGPA-${semester.id}">${semester.gradePoint.toFixed(2)}</div>
                            <div class="semester-stat-label">CGPA</div>
                        </div>
                        <div class="semester-stat">
                            <div class="semester-stat-value" id="semesterCredits-${semester.id}">${semester.credits.toFixed(1)}</div>
                            <div class="semester-stat-label">Credits</div>
                        </div>
                    </div>
                    ${deleteButton}
                </div>
            </div>
            <div style="text-align: center; padding: 20px; color: #666;">
                <p>📚 Previous academic record with ${semester.credits} credits and ${semester.gradePoint} average grade point</p>
            </div>
        `;
    } else {
        semesterDiv.innerHTML = `
            <div class="semester-header">
                <div class="semester-title">${semester.name}</div>
                <div style="display: flex; align-items: center;">
                    <div class="semester-stats">
                        <div class="semester-stat">
                            <div class="semester-stat-value" id="semesterCGPA-${semester.id}">0.00</div>
                            <div class="semester-stat-label">CGPA</div>
                        </div>
                        <div class="semester-stat">
                            <div class="semester-stat-value" id="semesterCredits-${semester.id}">0</div>
                            <div class="semester-stat-label">Credits</div>
                        </div>
                    </div>
                    ${deleteButton}
                </div>
            </div>
            <div class="course-input-section">
                <div id="courseRows-${semester.id}"></div>
                <button class="add-subject-btn" onclick="addCourseRow(${semester.id})">Add Course</button>
                <div style="text-align: center; margin-top: 20px;">
                </div>
            </div>
        `;
    }
    
    container.appendChild(semesterDiv);
}

// Add course row to semester
function addCourseRow(semesterId) {
    const semester = semesters.find(s => s.id === semesterId);
    if (!semester || semester.isPrevious) return;
    
    semester.courseCounter++;
    const container = document.getElementById(`courseRows-${semesterId}`);
    
    const row = document.createElement('div');
    row.className = 'course-row';
    row.id = `course-${semesterId}-${semester.courseCounter}`;
    
    row.innerHTML = `
        <div class="serial-number">${semester.courseCounter}</div>
        <div>
            <input type="text" placeholder="Course Name" onchange="calculateAllCGPA()">
            <div class="error-message">Please enter Course Name</div>
        </div>
        <div>
            <select onchange="handleCreditChange(this)" oninput="calculateAllCGPA()">
                <option value="">Credit</option>
                <option value="4">4</option>
                <option value="3.5">3.5</option>
                <option value="3">3</option>
                <option value="2.5">2.5</option>
                <option value="2">2</option>
                <option value="1.5">1.5</option>
                <option value="1">1</option>
                <option value="0.5">0.5</option>
                <option value="custom">Custom...</option>
            </select>
            <input type="text" placeholder="Enter custom credit" style="display: none; margin-top: 5px; width: 100%; box-sizing: border-box;" onchange="validateCustomCredit(this); calculateAllCGPA()" oninput="validateCustomCredit(this); calculateAllCGPA()" class="custom-credit-input">
            <div class="error-message">Please enter Course Credit</div>
        </div>
        <div>
            <select onchange="calculateAllCGPA()">
                <option value="">Grade</option>
                <option value="A+">A+ (4.00)</option>
                <option value="A">A (3.75)</option>
                <option value="A-">A- (3.50)</option>
                <option value="B+">B+ (3.25)</option>
                <option value="B">B (3.00)</option>
                <option value="B-">B- (2.75)</option>
                <option value="C+">C+ (2.50)</option>
                <option value="C">C (2.25)</option>
                <option value="C-">C- (2.00)</option>
                <option value="F">F (0.00)</option>
            </select>
            <div class="error-message">Please enter Grade</div>
        </div>
        <button class="delete-btn" onclick="deleteCourseRow(${semesterId}, ${semester.courseCounter})">Delete</button>
    `;
    
    container.appendChild(row);
}

// Delete course row
function deleteCourseRow(semesterId, courseId) {
    const row = document.getElementById(`course-${semesterId}-${courseId}`);
    if (row) {
        row.remove();
        updateSerialNumbers(semesterId);
        calculateAllCGPA();
    }
}

// Update serial numbers after deletion
function updateSerialNumbers(semesterId) {
    const container = document.getElementById(`courseRows-${semesterId}`);
    const rows = container.querySelectorAll('.course-row');
    
    rows.forEach((row, index) => {
        const serialNumber = row.querySelector('.serial-number');
        if (serialNumber) {
            serialNumber.textContent = index + 1;
        }
        
        row.id = `course-${semesterId}-${index + 1}`;
        
        const deleteBtn = row.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.setAttribute('onclick', `deleteCourseRow(${semesterId}, ${index + 1})`);
        }
    });
    
    const semester = semesters.find(s => s.id === semesterId);
    if (semester) {
        semester.courseCounter = rows.length;
    }
}

// Handle credit selection change
function handleCreditChange(selectElement) {
    const customInput = selectElement.parentElement.querySelector('.custom-credit-input');
    
    if (selectElement.value === 'custom') {
        customInput.style.display = 'block';
        customInput.focus();
    } else {
        customInput.style.display = 'none';
        customInput.value = '';
    }
    
    calculateAllCGPA();
}

// Validate custom credit input
function validateCustomCredit(inputElement) {
    const value = inputElement.value.trim();
    const errorElement = inputElement.parentElement.querySelector('.error-message');
    
    // Check if empty
    if (value === '') {
        errorElement.textContent = 'Please enter credit value';
        errorElement.style.display = 'block';
        return false;
    }
    
    // Check if it's a valid number
    if (isNaN(value) || value === '') {
        errorElement.textContent = 'Credit must be a valid number';
        errorElement.style.display = 'block';
        return false;
    }
    
    const numValue = parseFloat(value);
    
    // Check if it's within valid range
    if (numValue < 0 || numValue > 10) {
        errorElement.textContent = 'Credit must be between 0 and 10';
        errorElement.style.display = 'block';
        return false;
    }
    
    // Check if it's a valid decimal (0.5 increments)
    if ((numValue * 2) % 1 !== 0) {
        errorElement.textContent = 'Credit must be in 0.5 increments (e.g., 1, 1.5, 2, 2.5)';
        errorElement.style.display = 'block';
        return false;
    }
    
    // If all validations pass
    errorElement.style.display = 'none';
    return true;
}

// Get credit value from either select or custom input
function getCreditValue(row) {
    const select = row.querySelector('select');
    const customInput = row.querySelector('.custom-credit-input');
    
    if (select.value === 'custom') {
        const value = customInput.value.trim();
        if (value === '' || isNaN(value)) {
            return 0;
        }
        const numValue = parseFloat(value);
        // Only return valid values
        if (numValue >= 0 && numValue <= 10 && (numValue * 2) % 1 === 0) {
            return numValue;
        }
        return 0;
    } else {
        return parseFloat(select.value) || 0;
    }
}

// Calculate CGPA for all semesters
function calculateAllCGPA() {
    let overallTotalPoints = 0;
    let overallTotalCredits = 0;

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.style.display = 'none';
    });

    semesters.forEach(semester => {
        if (semester.isPrevious) {
            // Handle previous semester data
            overallTotalCredits += semester.credits;
            overallTotalPoints += semester.credits * semester.gradePoint;
        } else {
            // Handle regular semester data
            const rows = document.querySelectorAll(`#semester-${semester.id} .course-row`);
            let semesterPoints = 0;
            let semesterCredits = 0;

            rows.forEach(row => {
                const courseName = row.querySelector('input').value.trim();
                const credit = getCreditValue(row);
                const gradeSelect = row.querySelectorAll('select')[1];
                const grade = gradeSelect ? gradeSelect.value : '';

                // Validation
                if (courseName && (!credit || !grade)) {
                    if (!credit) {
                        row.querySelectorAll('.error-message')[1].style.display = 'block';
                    }
                    if (!grade) {
                        row.querySelectorAll('.error-message')[2].style.display = 'block';
                    }
                } else if ((!courseName) && (credit || grade)) {
                    row.querySelectorAll('.error-message')[0].style.display = 'block';
                }

                // Calculate if all fields are filled
                if (courseName && credit && grade) {
                    semesterCredits += credit;
                    semesterPoints += credit * gradePoints[grade];
                }
            });

            const semesterCGPA = semesterCredits > 0 ? (semesterPoints / semesterCredits) : 0;
            
            const cgpaElement = document.getElementById(`semesterCGPA-${semester.id}`);
            const creditsElement = document.getElementById(`semesterCredits-${semester.id}`);
            
            if (cgpaElement) cgpaElement.textContent = semesterCGPA.toFixed(2);
            if (creditsElement) creditsElement.textContent = semesterCredits.toFixed(1);

            overallTotalCredits += semesterCredits;
            overallTotalPoints += semesterPoints;
        }
    });

    const overallCGPA = overallTotalCredits > 0 ? (overallTotalPoints / overallTotalCredits) : 0;
    
    document.getElementById('overallCGPA').textContent = overallCGPA.toFixed(2);
    document.getElementById('totalCredits').textContent = overallTotalCredits.toFixed(1);
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        // Clear the container
        document.getElementById('semestersContainer').innerHTML = '';
        
        // Reset variables
        semesters = [];
        semesterCounter = 0;
        courseCounter = 0;
        previousSemesterCount = 0;
        
        // Reset overall stats
        document.getElementById('overallCGPA').textContent = '0.00';
        document.getElementById('totalCredits').textContent = '0';
        
        // Add first semester
        addNewSemester();
    }
}

// Clear all courses in a specific semester
function clearSemesterCourses(semesterId) {
    if (confirm('Are you sure you want to clear all courses in this semester? This action cannot be undone.')) {
        const container = document.getElementById(`courseRows-${semesterId}`);
        if (container) {
            // Remove all course rows
            container.innerHTML = '';
            
            // Reset semester course counter
            const semester = semesters.find(s => s.id === semesterId);
            if (semester) {
                semester.courseCounter = 0;
            }
            
            // Add 4 new empty course rows
            for (let i = 0; i < 4; i++) {
                addCourseRow(semesterId);
            }
            
            // Recalculate CGPA
            calculateAllCGPA();
        }
    }
}

// Delete semester
function deleteSemester(semesterId) {
    const regularSemesters = semesters.filter(s => !s.isPrevious);
    const semester = semesters.find(s => s.id === semesterId);
    
    if (regularSemesters.length <= 1 && !semester.isPrevious) {
        alert('You must have at least one semester.');
        return;
    }
    
    if (confirm('Are you sure you want to delete this entire semester? This action cannot be undone.')) {
        // Remove from DOM
        const semesterElement = document.getElementById(`semester-${semesterId}`);
        if (semesterElement) {
            semesterElement.remove();
        }
        
        // Remove from semesters array
        semesters = semesters.filter(s => s.id !== semesterId);
        
        // Recalculate CGPA
        calculateAllCGPA();
    }
}

// Show previous CGPA modal
function showPreviousCGPAModal() {
    document.getElementById('previousCGPAModal').style.display = 'block';
}

// Close previous CGPA modal
function closePreviousCGPAModal() {
    document.getElementById('previousCGPAModal').style.display = 'none';
    document.getElementById('prevSemesterCount').value = '';
    document.getElementById('prevCredits').value = '';
    document.getElementById('prevGradePoint').value = '';
    document.getElementById('semesterCountError').style.display = 'none';
    document.getElementById('creditsError').style.display = 'none';
    document.getElementById('gradePointError').style.display = 'none';
}

// Validate previous CGPA inputs
function validatePreviousInputs() {
    const semesterCountInput = document.getElementById('prevSemesterCount');
    const creditsInput = document.getElementById('prevCredits');
    const gradePointInput = document.getElementById('prevGradePoint');
    const semesterCountError = document.getElementById('semesterCountError');
    const creditsError = document.getElementById('creditsError');
    const gradePointError = document.getElementById('gradePointError');
    
    let isValid = true;
    
    // Validate semester count
    const semesterCountValue = semesterCountInput.value.trim();
    if (semesterCountValue === '' || isNaN(semesterCountValue) || parseInt(semesterCountValue) < 1 || parseInt(semesterCountValue) > 20) {
        semesterCountError.style.display = 'block';
        isValid = false;
    } else {
        semesterCountError.style.display = 'none';
    }
    
    // Validate credits
    const creditsValue = creditsInput.value.trim();
    if (creditsValue === '' || isNaN(creditsValue) || parseFloat(creditsValue) <= 0) {
        creditsError.style.display = 'block';
        isValid = false;
    } else {
        creditsError.style.display = 'none';
    }
    
    // Validate grade point
    const gradePointValue = gradePointInput.value.trim();
    if (gradePointValue === '' || isNaN(gradePointValue) || parseFloat(gradePointValue) < 2 || parseFloat(gradePointValue) > 4) {
        gradePointError.style.display = 'block';
        isValid = false;
    } else {
        gradePointError.style.display = 'none';
    }
    
    return isValid;
}

// Add previous CGPA data
function addPreviousCGPAData() {
    // Validate inputs first
    if (!validatePreviousInputs()) {
        return;
    }
    
    const semesterCount = parseInt(document.getElementById('prevSemesterCount').value);
    const credits = parseFloat(document.getElementById('prevCredits').value);
    const gradePoint = parseFloat(document.getElementById('prevGradePoint').value);
    
    // Update global previous semester count
    previousSemesterCount = semesterCount;
    
    // Update existing semester names
    const regularSemesters = semesters.filter(s => !s.isPrevious);
    regularSemesters.forEach((semester, index) => {
        const actualSemesterNumber = previousSemesterCount + index + 1;
        semester.name = `Semester ${actualSemesterNumber}`;
        const titleElement = document.querySelector(`#semester-${semester.id} .semester-title`);
        if (titleElement) {
            titleElement.textContent = semester.name;
        }
    });
    
    // Create a special previous semester entry
    semesterCounter++;
    const semester = {
        id: semesterCounter,
        name: `Previous Semesters (1-${semesterCount})`,
        credits: credits,
        gradePoint: gradePoint,
        isPrevious: true
    };
    
    // Add to beginning of semesters array
    semesters.unshift(semester);
    
    // Render at the beginning
    const container = document.getElementById('semestersContainer');
    const tempDiv = document.createElement('div');
    renderSemester(semester);
    const newSemesterElement = document.getElementById(`semester-${semester.id}`);
    container.insertBefore(newSemesterElement, container.firstChild);
    
    calculateAllCGPA();
    closePreviousCGPAModal();
}

// Initialize calculator on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
});