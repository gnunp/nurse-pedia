import {getCookie} from "../../global/js/shortcuts";

export function handleHoverStarBtn(event){
    const starBtn = event.target;
    if(starBtn.classList.contains("far")){
        fillStarBtn(starBtn)
    }
    else{
        emptyStarBtn(starBtn)
    }
}

export function handleClickStarBtn(event){
    const starBtn = event.target;
    if(starBtn.classList.contains("js-clicked_star")){
        // 찜을 제거하는 코드
        starBtn.classList.remove("js-clicked_star")
        emptyStarBtn(starBtn)
        starBtn.addEventListener("mouseleave", handleMouseleaveStarBtn);
    }
    else{
        // 찜을 추가하는 코드
        starBtn.classList.add("js-clicked_star")
        fillStarBtn(starBtn)
        starBtn.removeEventListener("mouseover", handleHoverStarBtn);
        starBtn.removeEventListener("mouseout", handleHoverStarBtn);
    }
    toggleKnowledgeStarAtDB(
        document.querySelector(".js-knowledge_name").dataset.id,
        document.querySelector(".js-knowledge_name").dataset.knowledge_category
    );
}

function fillStarBtn(starBtn){
    starBtn.classList.remove("far");
    starBtn.classList.add("fas", "color_yellow");
}

function emptyStarBtn(starBtn){
    starBtn.classList.remove("fas", "color_yellow");
    starBtn.classList.add("far");
}

function handleMouseleaveStarBtn(event){
    const starBtn = event.target;
    starBtn.addEventListener("mouseover", handleHoverStarBtn);
    starBtn.addEventListener("mouseout", handleHoverStarBtn);

    starBtn.removeEventListener("mouseleave", handleMouseleaveStarBtn);
}

export async function toggleKnowledgeStarAtDB(id, knowledgeCategory){
    const response = await fetch('/knowledges/star/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'X-CSRFToken': getCookie('csrftoken')
          },
          body: JSON.stringify({
              id,
              knowledgeCategory
          })
    });

    if(response.status === 201){
        // 찜하기가 추가된 경우
    }
    else if(response.status === 200){
        // 찜하기가 제거된 경우
    }
    else if(response.status === 500){
        alert("에러가 발생 했습니다.");
    }
    else if(response.status === 401){
        alert("권한이 없습니다.");
    }
    else if(response.status === 404){
        alert("잘못된 접근입니다.");
    }
}