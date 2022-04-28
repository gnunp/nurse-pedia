const diagnosisDetailEdit = () => {
    applyTextareaBlur();

    const addDiagnosisBtn = document.querySelector(".js-add_diagnosis_btn");
    addDiagnosisBtn.addEventListener("click", handleClickAddDiagnosisBtn);

    // 관련 진단 삭제 버튼 클릭 관련 코드
    const relatedDiagnoses = document.querySelectorAll(".js-related_diagnosis");
    for (const relatedDiagnosis of relatedDiagnoses) {
        const deleteBtn = relatedDiagnosis.querySelector(".js-related_diagnosis_delete_btn");
        deleteBtn.addEventListener("click", (event) => {
           if(confirm("정말 삭제하시겠습니까?")){
               relatedDiagnosis.remove();
           }
        });
    }

    function applyTextareaBlur(){
        const textareas = document.querySelectorAll("textarea");

        window.addEventListener("scroll", () => {
            for (const textarea of textareas) {
                textarea.blur();
            }
        });
    }

    function handleClickAddDiagnosisBtn(event){
        event.preventDefault();
        const relatedDiagnosesWrapper = document.querySelector(".js-knowledge_info__related_diagnoses");
        relatedDiagnosesWrapper.insertAdjacentHTML(
            "beforeend",
            `
            <div class="related_diagnosis js-related_diagnosis border_gray">
                <div class="related_diagnosis__summary">
                    <input type="text"
                           class="related_diagnosis__summary__title js-related_diagnosis__summary__title border_gray"
                           name="relation_diagnosis_name"
                           placeholder="관련 요인"
                           required
                    >
                    <i class="fas fa-times related_diagnosis__summary__delete_btn js-related_diagnosis_delete_btn"></i>
                </div>
                <textarea class="related_interventions_textarea js-related_interventions_textarea border_gray"
                          name="relation_diagnosis_intervention_content"
                          placeholder="세부 간호 중재"
                ></textarea>
            </div>
            `
        );
        const newRelatedDiagnosis = relatedDiagnosesWrapper.lastElementChild;
        const deleteBtn = newRelatedDiagnosis.querySelector(".js-related_diagnosis_delete_btn");
        deleteBtn.addEventListener("click", (event) => {
           if(confirm("정말 삭제하시겠습니까?")){
               newRelatedDiagnosis.remove();
           }
        });
    }
}

diagnosisDetailEdit()