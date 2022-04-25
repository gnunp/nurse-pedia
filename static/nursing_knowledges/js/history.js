import {headerHeight} from "../../global/js/variables";
import {getCookie, toastMessage} from "../../global/js/shortcuts";

const historyInit = () => {
    const historyWrapper = document.querySelector('.js-history_wrapper');
    historyWrapper.style.top = `${headerHeight}px`;

    const allVersionRollbackBtn = document.querySelectorAll('.js-version_rollback_btn');
    for (const versionRollbackBtn of allVersionRollbackBtn) {
        versionRollbackBtn.addEventListener('click', (event) =>{
            event.preventDefault();

            const rollbackBtnElement = event.target;
            if(confirm('정말 되돌리시겠습니까?')){
                location.href = rollbackBtnElement.href;
            }
        })
    }

    const allUserReportBtn = document.querySelectorAll('.js-report_user_btn');
    for (const userReportBtn of allUserReportBtn) {
        userReportBtn.addEventListener('click', handleClickUserReportBtn);
    }

    async function handleClickUserReportBtn(event){
        event.preventDefault();

        const reportBtnElement = event.target;
        if(confirm('정말 신고하시겠습니까?\n(악의적 편집의 경우 조치가 취해질 수 있습니다.)')){
            const historyListItem = reportBtnElement.closest('.js-history__list__item');
            const knowledgeType = historyListItem.dataset.knowledge_type;
            const historyID = historyListItem.dataset.history_id;
            await reportUser(knowledgeType, historyID);
        }
    }

    async function reportUser(knowledgeType, historyID){
        const response = await fetch(`/knowledges/report/${historyID}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json;charset=utf-8',
                  'X-CSRFToken': getCookie('csrftoken')
              },
              body: JSON.stringify({
                  knowledgeType,
              })
        });

        if(response.status === 200){
            // 신고가 완료된 경우
            const responseData = await response.json();
            if(responseData.is_already_reported){
                toastMessage("이미 처리된 신고입니다.", "toast__fail");
            }
            else{
                toastMessage("신고가 완료되었습니다.");
            }
        }
        else if(response.status === 500){
            alert("에러가 발생 했습니다.");
        }
        else if(response.status === 400){
            alert("잘못된 요청입니다.");
        }
        else if(response.status === 401){
            alert("권한이 없습니다.");
        }
        else if(response.status === 404){
            alert("잘못된 접근입니다.");
        }
    }
}

historyInit();