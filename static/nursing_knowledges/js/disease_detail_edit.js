const addDiagnosisBtn = document.querySelector(".js-add_diagnosis_btn");
const selectedDiagnosis = document.querySelector("#selected_diagnosis");
const checkboxList = document.querySelector(".js-diagnoses_list");

const handleClickAddDiagnosisBtn = (event) => {
    event.preventDefault();
    
    if(selectedDiagnosis.value.length){
        console.log(selectedDiagnosis.value);
        checkboxList.insertAdjacentHTML(
            "beforeend",
            `
            <div class="diagnosis_set">
            <input type="checkbox" id="${selectedDiagnosis.value}" name="added_${selectedDiagnosis.value}" checked>
            <label for="${selectedDiagnosis.value}">${selectedDiagnosis.value}</label>
        </div>
            `
        );
    }
}

addDiagnosisBtn.addEventListener("click", handleClickAddDiagnosisBtn);