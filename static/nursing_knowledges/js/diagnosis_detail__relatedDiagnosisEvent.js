const relatedDiagnosisEvent = () => {
    const allRelatedDiagnosisWrapper = document.querySelectorAll(".js-related_diagnosis");
    for (const wrapper of allRelatedDiagnosisWrapper) {
        wrapper.addEventListener("toggle", handleToggleWrapper);

        const editBtn = wrapper.querySelector(".js-intervention_edit_button");
        editBtn.addEventListener("click", handleClickInterventionEditBtn);

        const likeBtn = wrapper.querySelector(".js-intervention_like_button");
        likeBtn.addEventListener("click", handleClickLikeButton)
    }

    async function handleToggleWrapper(event){
        const wrapper = event.target;
        const summaryTitle = wrapper.querySelector(".js-related_diagnosis__summary__title");
        const arrowWrapper = wrapper.querySelector(".js-related_diagnosis_arrow_wrapper");
        const editBtn = wrapper.querySelector(".js-intervention_edit_button");
        const submitBtn = wrapper.querySelector(".js-intervention_edit_submit_button");

        if (wrapper.open) {
            /* the element was toggled open */
            wrapper.classList.add("border_pink");

            summaryTitle.classList.add("color_pink");
            
            arrowWrapper.innerHTML = '<i class="fas fa-chevron-up"></i>';
            arrowWrapper.classList.add("color_pink");
            
            if(wrapper.querySelector(".js-related_interventions_textarea")){
                submitBtn.classList.remove("display_none");                
            }
            else{
                editBtn.classList.remove("display_none");
            }
          } else {
            /* the element was toggled closed */
            wrapper.classList.remove("border_pink");

            summaryTitle.classList.remove("color_pink");

            arrowWrapper.innerHTML = '<i class="fas fa-chevron-down"></i>';
            arrowWrapper.classList.remove("color_pink");

            editBtn.classList.add("display_none");

            submitBtn.classList.add("display_none");
        }
    }

    function handleClickInterventionEditBtn(event){
        const wrapper = event.target.closest(".js-related_diagnosis");
        const relatedInterventionsList = wrapper.querySelector(".js-related_interventions");
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
        }

        const submitBtn = event.target;
        submitBtn.classList.add("display_none");

        const editBtn = wrapper.querySelector(".js-intervention_edit_button");
        editBtn.classList.remove("display_none");

        relatedInterventionsTextarea.remove();

        // --------------------------------------AJAX 통신부---------------------------------------
        const toDiagnosisPk = wrapper.dataset.id;
        const response = await fetch(`/knowledges/related-diagnosis/${toDiagnosisPk}/edit`, {
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
        const throughObjectPk = wrapper.dataset.through_object_id;

        if(likeBtn.classList.contains('already_like')){
            likeCount.innerText--;
        }else{
            likeCount.innerText++;
        }
        likeBtn.classList.toggle('already_like');
        
        const response = await fetch(`/knowledges/diagnosis-related-diagnoses/${throughObjectPk}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })

        // 좋아요를 눌러서 +1 된 경우
        // 좋아요를 취소해서 -1 된 경우
        if(response.status === 201 || response.status === 200){
        }
        else{
            alert("에러가 발생 했습니다.")
        }
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}

relatedDiagnosisEvent();