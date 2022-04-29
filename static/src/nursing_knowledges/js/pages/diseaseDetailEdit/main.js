const diseaseDetailEdit = () => {
    const addDiagnosisBtn = document.querySelector(".js-add_diagnosis_btn");
    const selectedDiagnosis = document.querySelector("#selected_diagnosis");
    const checkboxList = document.querySelector(".js-diagnoses_list");
    const textareas = document.querySelectorAll("textarea");
    const form = document.querySelector("#edit_form");

    addDiagnosisBtn.addEventListener("click", handleClickAddDiagnosisBtn);

    const isMobileDevice = /Mobi/i.test(window.navigator.userAgent)
    if(!isMobileDevice){
        window.addEventListener("scroll", applyTextareaBlur);
    }


    function handleClickAddDiagnosisBtn(event) {
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

    function applyTextareaBlur() {
        for (const textarea of textareas) {
            textarea.blur();
        }
    }
}

diseaseDetailEdit();
