import { disassemble, isConsonant } from 'hangul-js';
import {getCookie} from "../../global/js/shortcuts";

const relatedDiagnosisEvent = () => {
    const allRelatedDiagnosisWrapper = document.querySelectorAll(".js-related_diagnosis");
    for (const wrapper of allRelatedDiagnosisWrapper) {
        wrapper.addEventListener("toggle", handleToggleWrapper);

        if(userIsAuthenticated && !isBeforeVersion){
            const editBtn = wrapper.querySelector(".js-intervention_edit_button");
            editBtn.addEventListener("click", handleClickInterventionEditBtn);

            const likeBtn = wrapper.querySelector(".js-intervention_like_button");
            likeBtn.addEventListener("click", handleClickLikeButton);
        }

        const relatedDiagnosisTitleElement = wrapper.querySelector(".js-related_diagnosis__summary__title");
        const knowledgeName = document.querySelector(".js-knowledge_name");
        const word = relatedDiagnosisTitleElement.innerText;


        relatedDiagnosisTitleElement.innerText = `${getAdverbAddedWord(word)} 관련된 ${knowledgeName.innerText}`
    }

    // 연관 간호 진단이 없을때
    const diagnosis_ifNoHaveRelatedDiagnosis = document.querySelector(".js-related_diagnosis__no_exist__diagnosis_name");
    if(diagnosis_ifNoHaveRelatedDiagnosis){
        diagnosis_ifNoHaveRelatedDiagnosis.innerText = getAdverbAddedWord(diagnosis_ifNoHaveRelatedDiagnosis.innerText);
    }



    async function handleToggleWrapper(event){
        const wrapper = event.target;
        const summaryTitle = wrapper.querySelector(".js-related_diagnosis__summary__title");
        const arrowWrapper = wrapper.querySelector(".js-related_diagnosis_arrow_wrapper");
        let editBtn;
        let submitBtn;
        if(userIsAuthenticated && !isBeforeVersion) {
            editBtn = wrapper.querySelector(".js-intervention_edit_button");
            submitBtn = wrapper.querySelector(".js-intervention_edit_submit_button");
        }

        if (wrapper.open) {
            /* the element was toggled open */
            wrapper.classList.add("border_pink");

            summaryTitle.classList.add("color_pink");
            
            arrowWrapper.innerHTML = '<i class="fas fa-chevron-up"></i>';
            arrowWrapper.classList.add("color_pink");
            if(userIsAuthenticated && !isBeforeVersion) {
                if (wrapper.querySelector(".js-related_interventions_textarea")) {
                    submitBtn.classList.remove("display_none");
                } else {
                    editBtn.classList.remove("display_none");
                }
            }
          } else {
            /* the element was toggled closed */
            wrapper.classList.remove("border_pink");

            summaryTitle.classList.remove("color_pink");

            arrowWrapper.innerHTML = '<i class="fas fa-chevron-down"></i>';
            arrowWrapper.classList.remove("color_pink");
            if(userIsAuthenticated && !isBeforeVersion) {
                editBtn.classList.add("display_none");
                submitBtn.classList.add("display_none");
            }
        }
    }

    function handleClickInterventionEditBtn(event){
        const wrapper = event.target.closest(".js-related_diagnosis");
        const relatedInterventionsList = wrapper.querySelector(".js-related_interventions");

        // 내용 없음 문구 element 제거
        const knowledgeContentEmptyElement = relatedInterventionsList.querySelector(".js-knowledge_content_empty");
        if(knowledgeContentEmptyElement){
            knowledgeContentEmptyElement.remove();
        }

        const interventionsText = relatedInterventionsList.innerText;
        relatedInterventionsList.classList.add("display_none");


        const editBtn = event.target;
        editBtn.classList.add("display_none");

        const submitBtn = wrapper.querySelector(".js-intervention_edit_submit_button");
        submitBtn.classList.remove("display_none"); 
        submitBtn.addEventListener("click", handleSubmitEditedInterventions)

        wrapper.insertAdjacentHTML(
            "beforeend",
            `
            <textarea class="related_interventions_textarea js-related_interventions_textarea" placeholder="관련 대표 중재">${interventionsText}</textarea>
            `
        )
    }

    async function handleSubmitEditedInterventions(event){
        const wrapper = event.target.closest(".js-related_diagnosis");
        const relatedInterventionsTextarea = wrapper.querySelector(".js-related_interventions_textarea");
        const resultEditedTextValue = relatedInterventionsTextarea.value.trim();
        const relatedInterventionsList = wrapper.querySelector(".js-related_interventions");
        relatedInterventionsList.innerHTML = "";
        relatedInterventionsList.classList.remove("display_none");
        for (const intervention of resultEditedTextValue.split("\n")) {
            if(intervention.length > 0){
                relatedInterventionsList.insertAdjacentHTML(
                    "beforeend",
                    `
                    <li>${intervention}</li>
                    `
                )
            }
            else{
                relatedInterventionsList.insertAdjacentHTML(
                    "beforeend",
                    `
                    <div class="knowledge_info__content knowledge_info__no_content js-knowledge_content_empty block_dragging">중재</div>
                    `
                )
            }
        }

        const submitBtn = event.target;
        submitBtn.classList.add("display_none");

        const editBtn = wrapper.querySelector(".js-intervention_edit_button");
        editBtn.classList.remove("display_none");

        relatedInterventionsTextarea.remove();

        // --------------------------------------AJAX 통신부---------------------------------------
        const relatedDiagnosisId = wrapper.dataset.related_diagnosis_id;
        const response = await fetch(`/knowledges/related-diagnosis/${relatedDiagnosisId}/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({editedText: resultEditedTextValue}),
        })
        if(response.status === 200){
        }else{
            alert("에러가 발생 했습니다.")
        }
        // ----------------------------------------------------------------------------------------
    }

    async function handleClickLikeButton(event){
        const wrapper = event.target.closest(".js-related_diagnosis");
        const likeBtn = event.target.closest(".js-intervention_like_button");
        const likeCount = likeBtn.querySelector(".js-intervention_like_count");
        const relatedDiagnosisId = wrapper.dataset.related_diagnosis_id;

        if(likeBtn.classList.contains('already_like')){
            likeCount.innerText--;
        }else{
            likeCount.innerText++;
        }
        likeBtn.classList.toggle('already_like');
        
        const response = await fetch(`/knowledges/diagnosis-related-diagnoses/${relatedDiagnosisId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })

        const knowledgeStarBtn = document.querySelector((".js-knowledge_star_btn"));
        if(response.status === 201) {
            // 좋아요를 눌러서 +1 된 경우, 진단 찜하기
            if(!knowledgeStarBtn.classList.contains("js-clicked_star")){
                knowledgeStarBtn.click();
            }
        }
        else if(response.status === 200){
            // 좋아요를 취소해서 -1 된 경우
        }
        else{
            alert("에러가 발생 했습니다.")
        }
    }

    function getAdverbAddedWord(word){
        const lastChar = disassemble(word).pop();
        const adverb = isConsonant(lastChar) ? "과" : "와";

        return word + adverb;
    }
}

relatedDiagnosisEvent();