export const setSearchEvent = async () => {
    const keyword = document.querySelector(".js-search_keyword");
    const resultWrapper = document.querySelector(".js-search_result_wrapper");
    const searchForm = document.querySelector(".js-search_form");


    let diseaseList;
    let diagnosisList;
    [diseaseList, diagnosisList] = await Promise.all([
        fetchAPIData("/api/knowledges/disease-small-categories/"),
        fetchAPIData("/api/knowledges/diagnoses/"),
    ]);

    keyword.addEventListener("input", handleChangeKeyword);
    document.body.addEventListener("click", handleClickBody);
    keyword.addEventListener("click", handleClickKeyword);

    searchForm.addEventListener("submit", handleSubmitSearchForm);


    //--------------------------------------- 함수 모음 -------------------------------------------

    async function handleChangeKeyword(event){
        const keywordString = event.target.value;
        const lastLetter = keywordString.charAt(keywordString.length-1);
        
        // 검색어가 공백일때 검색결과를 reset시키고 함수 종료
        if(keywordString === ""){
            resetSearchResultHTML();
            return
        }

        // 마지막 글자가 음운(자음,모음)와 같이 글자(가~힣)가 아니면 함수 종료
        if(!isKoreanLetter(lastLetter)){
            return
        }

        // 키워드가 들어가는 질병,진단 데이터만 Array로 검색결과 반환
        const searchResult = filterSearchDatas(diseaseList, diagnosisList, keywordString);

        // 검색 결과가 없으면 함수 종료
        if(searchResult.length < 1){
            return
        }

        resetSearchResultHTML();
        setSearchResultHTML(sortSearchResultArray(searchResult, keywordString));
    }
    
    // 한글 글자(자음은 x)이면 true를 반환하는 함수
    function isKoreanLetter(string){
        const KoreanRegex = /[가-힣]/;
        return KoreanRegex.test(string);
    }

    function resetSearchResultHTML(){
        resultWrapper.innerHTML = ""; 
        resultIndex = -1;
    }

    function setSearchResultHTML(json){
        const sliced5ElementArray = json.slice(0,5);
        let index = 0;
        sliced5ElementArray.forEach(data => {
            resultWrapper.insertAdjacentHTML(
                "beforeend",
                `
                <div class="search_result" data-id="${data.id}" data-type="${data.type}" data-index="${index++}">
                    <i class="fas fa-plus-circle ${data.type === 'diagnosis' ? 'js-diagnosis_icon_color' : ''}"></i>
                    <span class="name">${data.name}</span>
                </div>
                `
            )
        })
        keyword.addEventListener("keydown", handleKeydownInput);
        resultWrapper.querySelectorAll(".search_result").forEach(result => {
            result.addEventListener("click", handleClickResult);
            result.addEventListener("mouseover", handleMouseoverResult);
            result.addEventListener("mouseout", handleMouseOutResult);
            result.addEventListener("mousemove", handleMousemoveResult);
        })


    }



    let resultIndex = -1;
    function handleKeydownInput(event){
        const results = resultWrapper.querySelectorAll(".search_result");
        if(event.key === "ArrowDown"){

            resultIndex++;
            if(resultIndex >= results.length){
                resultIndex = 0;
            }
            focusResult(results[resultIndex]);
            return setTimeout(() => keyword.setSelectionRange(999,999), 0.01);
        }
        else if(event.key === "ArrowUp") {

            resultIndex--;
            if (resultIndex < 0) {
                resultIndex = results.length - 1;
            }
            focusResult(results[resultIndex]);
            return setTimeout(() => keyword.setSelectionRange(999, 999), 0.01);
        }
        else if(event.key === "Escape"){
            event.target.value = "";
            resultWrapper.innerHTML = "";
        }
    }

    function focusResult(result){
        const results = resultWrapper.querySelectorAll(".search_result");
        results.forEach(result => {
            result.classList.remove("js-result_selected");
        })
        result.classList.add("js-result_selected");

        keyword.value = result.querySelector(".name").innerText;
    }

    function handleClickResult(event){
        const result = event.target.closest(".search_result");
        const id = result.dataset.id;
        const type = result.dataset.type;
        if(type === "disease"){
            location.href = `/knowledges/disease/${id}`;
        }
        else{
            location.href = `/knowledges/diagnosis/${id}`;
        }
    }

    function handleMouseoverResult(event){
        const result = event.target.closest(".search_result");
        resultIndex = result.dataset.index;
        const results = resultWrapper.querySelectorAll(".search_result");
        results.forEach(result => {
            result.classList.remove("js-result_selected");
        })
        result.classList.add("js-result_selected");
    }

    function handleMouseOutResult(event){
        const results = resultWrapper.querySelectorAll(".search_result");
        results.forEach(result => {
            result.classList.remove("js-result_selected");
        })
        resultIndex = -1;

    }

    function handleMousemoveResult(event){
        const result = event.target.closest(".search_result");
        resultIndex = result.dataset.index;
        const results = resultWrapper.querySelectorAll(".search_result");
        results.forEach(result => {
            result.classList.remove("js-result_selected");
        })
        result.classList.add("js-result_selected");
    }

    function handleClickBody(event){
        const searchWrapper = document.querySelector(".js-search_wrapper");
        if(!searchWrapper.contains(event.target) && resultWrapper.children.length > 0){
            resultWrapper.classList.add("js-display_none");
        }
    }

    function handleClickKeyword(event){
        if(resultWrapper.classList.contains("js-display_none")){
            resultWrapper.classList.remove("js-display_none");
        }
    }

    function handleSubmitSearchForm(event){
        event.preventDefault();
        let isCorrect = false;
        for (const result of resultWrapper.children) {
            const name = result.querySelector(".name").innerText;
            if(name === keyword.value){
                result.click();
                isCorrect = true;
                break;
            }
        }
        if(!isCorrect){
            event.target.submit();
        }
    }
}

/*
------------------------다른 페이지에서도 사용하는 함수 따로 추출---------------------------------
*/
export async function fetchAPIData(url){
    const response = await fetch(url);
    const result = await response.json();
    return result
}

export async function getSortedSearchDatas(diseaseList, diagnosisList, keyword){
    // 키워드가 들어가는 질병,진단 데이터만 Array로 검색결과 반환
    const searchResult = filterSearchDatas(diseaseList, diagnosisList, keyword);

    // 오름차순으로 정렬해서 값 반환
    return sortSearchResultArray(searchResult, keyword);
}


function filterSearchDatas(diseaseList, diagnosisList, keyword){
    // 검색어를 포함시키는 질병,진단들만 리스트에 포함
    const filteredDiseases = diseaseList.filter(elem => elem["name"].includes(keyword) === true);
    const filteredDiagnosis = diagnosisList.filter(elem => elem["name"].includes(keyword) === true);

    // 질병인지 진단인지 type 추가
    for (const elem of filteredDiseases) {
        elem["type"] = "disease";
    }
    for (const elem of filteredDiagnosis) {
        elem["type"] = "diagnosis";
    }

    return [...filteredDiseases, ...filteredDiagnosis];
}

function sortSearchResultArray(array, keyword){
    const result = []
    const copiedArray = JSON.parse(JSON.stringify(array));
    for (const [key, data] of Object.entries(copiedArray)) {
        if(data.name.charAt(0) === keyword.charAt(0)){
            result.push(data);
            delete copiedArray[key];
        }
    }
    for (const data of copiedArray) {
        if(data){
            result.push(data);
        }
    }
    return result;
}