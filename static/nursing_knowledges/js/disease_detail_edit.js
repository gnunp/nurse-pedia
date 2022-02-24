const addDiagnosisBtn = document.querySelector(".js-add_diagnosis_btn");
const selectedDiagnosis = document.querySelector("#selected_diagnosis");
const checkboxList = document.querySelector(".js-diagnoses_list");
const textareas = document.querySelectorAll("textarea");

const handleClickAddDiagnosisBtn = (event) => {
    event.preventDefault();
    
    if(selectedDiagnosis.value.length){
        checkboxList.insertAdjacentHTML(
            "beforeend",
            `
            <div class="diagnosis_set">
                <input type="checkbox" id="${selectedDiagnosis.value}" name="added_${selectedDiagnosis.value}" checked>
                <label for="${selectedDiagnosis.value}">${selectedDiagnosis.value}</label>
                <input type="hidden" name="is_edited" value="${selectedDiagnosis.value}">
            </div>
            `
        );
    }
}

addDiagnosisBtn.addEventListener("click", handleClickAddDiagnosisBtn);

const allTextareaBlur = () => {
    for (const textarea of textareas) {
        textarea.blur();
    }
}

window.addEventListener("scroll", allTextareaBlur);