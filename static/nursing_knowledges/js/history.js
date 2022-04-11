import {headerHeight} from "../../global/js/variables";

const historyWrapper = document.querySelector('.js-history_wrapper');
historyWrapper.style.top = `${headerHeight}px`;

const allVersionRollbackBtn = document.querySelectorAll('.js-version_rollback_btn');
for (const versionRollbackBtn of allVersionRollbackBtn) {
    versionRollbackBtn.addEventListener('click', (event) =>{
        event.preventDefault();

        const rollbackBtn = event.target;
        if(confirm('정말 되돌리시겠습니까?')){
            location.href = rollbackBtn.href;
        }
    })
}
