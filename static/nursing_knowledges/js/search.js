import { cloneDeep } from "lodash";

const search = async () => {
    const keyword = document.querySelector(".js-search_keyword");
    const resultWrapper = document.querySelector(".js-search_result_wrapper");
    const searchForm = document.querySelector(".js-search_form");
    
    let searchHistory = {};

    let beforeKeyword = "";

    let arrowFirstCount = 0;
    let resultIndex = -1;

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

    // 검색어를 통해 Elastic Search API를 호출하여 결과를 HTML에 반환하는 함수
    async function handleChangeKeyword(event){
        const keyword = event.target.value;
        const lastLetter = keyword.charAt(keyword.length-1);
        
        if(beforeKeyword === keyword){
            return
        }

        // 검색어의 마지막이 글자이면(자음x)
        if(isKoreanLetter(lastLetter)){

            // searchHistory 조회해서 있다면 그대로 출력
            if(searchHistory[keyword]){
                // 검색결과가 없었으면 pass
                if (searchHistory[keyword].count === 0){
                    if(beforeKeyword.length !== keyword.length){
                        resetSearchResultHTML();
                    }
                    beforeKeyword = keyword;
                    return
                }

                resetSearchResultHTML();
                setSearchResultHTML(searchHistory[keyword].results);
                beforeKeyword = keyword;
                return
            }


            const filteredDiseases = diseaseList.filter(elem => elem["name"].includes(keyword) === true);
            const filteredDiagnosis = diagnosisList.filter(elem => elem["name"].includes(keyword) === true);

            // 질병인지 진단인지 type 추가
            for (const elem of filteredDiseases) {
                elem["type"] = "disease";
            }
            for (const elem of filteredDiagnosis) {
                elem["type"] = "diagnosis";
            }

            const searchResult__count = filteredDiseases.length + filteredDiagnosis.length;
            const searchResult__results = [...filteredDiseases, ...filteredDiagnosis];
            searchHistory[keyword] = {count: searchResult__count, results: searchResult__results};

            // 검색 결과가 없는 경우
            if(searchResult__count < 1){
                if(beforeKeyword.length !== keyword.length){
                    resetSearchResultHTML();
                }
                beforeKeyword = keyword;
                return
            }
            // 있는 경우
            resetSearchResultHTML();
            setSearchResultHTML(searchResult__results);
            beforeKeyword = keyword;
        }

        if(keyword === ""){
            beforeKeyword = keyword;
            resetSearchResultHTML();
        }
    }
    
    // 한글 글자(자음은 x)이면 true를 반환하는 함수
    function isKoreanLetter(string){
        const KoreanRegex = /[가-힣]/;
        return KoreanRegex.test(string);
    }

    // async function searchResultJSONFor(keyword, url){
        //let searchQuery;
        // if(keyword.split(" ").length > 1){
        //     searchQuery = "search_multi_match";
        // }
        // else{
        //     searchQuery = "name__contains";
        // }
        // const response = await fetch(`${url}/?${searchQuery}=${keyword}`);
        // const json = await response.json();
        // return json
    // }
    
    async function fetchAPIData(url){
        const response = await fetch(url);
        const result = await response.json();
        return result
    }

    function resetSearchResultHTML(){
        resultWrapper.innerHTML = ""; 
        arrowFirstCount = 0;
        resultIndex = -1;
    }

    function setSearchResultHTML(json){
        const jsonToSortedArray = sortSearchResult(json);
        const sliced5ElementArray = jsonToSortedArray.slice(0,5);
        let index = 0;
        sliced5ElementArray.forEach(data => {
            resultWrapper.insertAdjacentHTML(
                "beforeend",
                `
                <div class="firstpage_search_result" data-id="${data.id}" data-type="${data.type}" data-index="${index++}">
                    <i class="fas fa-plus-circle"></i>
                    <span class="name">${data.name}</span>
                </div>
                `
            )
        })
        arrowFirstCount = 0;
        keyword.addEventListener("keydown", handleKeydownInput);
        resultWrapper.querySelectorAll(".firstpage_search_result").forEach(result => {
            result.addEventListener("click", handleClickResult);
            result.addEventListener("mouseover", handleMouseoverResult);
            result.addEventListener("mouseout", handleMouseOutResult);
            result.addEventListener("mousemove", handleMousemoveResult);
        })


    }

    function sortSearchResult(json){
        const result = []
        const copiedJSON = cloneDeep(json);
        for (const [key, data] of Object.entries(copiedJSON)) {
            if(data.name.charAt(0) === keyword.value.charAt(0)){
                result.push(data);
                delete copiedJSON[key];
            }
        }
        for (const data of copiedJSON) {
            if(data){
                result.push(data);
            }
        }
        return result;
    }

    function handleKeydownInput(event){
        const results = resultWrapper.querySelectorAll(".firstpage_search_result");
        if(event.code === "ArrowDown"){
            // 맨처음 밑 화살표가 두번되는 에러 방지
            if(arrowFirstCount < 1){
                arrowFirstCount++;
                return
            }
            resultIndex++;
            if(resultIndex >= results.length){
                resultIndex = 0;
            }
            focusResult(results[resultIndex]);
            return setTimeout(() => keyword.setSelectionRange(999,999), 1);
        }
        else if(event.code === "ArrowUp"){
            // 맨처음 위 화살표가 두번되는 에러 방지
            if(arrowFirstCount < 1){
                arrowFirstCount++;
                return
            }
            resultIndex--;
            if(resultIndex < 0){
                resultIndex = results.length - 1;
            }
            focusResult(results[resultIndex]);
            return setTimeout(() => keyword.setSelectionRange(999,999), 1);
        }
    }

    function focusResult(result){
        const results = resultWrapper.querySelectorAll(".firstpage_search_result");
        results.forEach(result => {
            result.classList.remove("js-result_selected");
        })
        result.classList.add("js-result_selected");

        keyword.value = result.querySelector(".name").innerText;
    }

    function handleClickResult(event){
        const id = event.target.dataset.id;
        const type = event.target.dataset.type;
        if(type === "disease"){
            location.href = `/knowledges/disease/${id}`;
        }
        else{
            location.href = `/knowledges/diagnosis/${id}`;
        }
    }

    function handleMouseoverResult(event){
        const result = event.target.closest(".firstpage_search_result");
        resultIndex = result.dataset.index;
        const results = resultWrapper.querySelectorAll(".firstpage_search_result");
        results.forEach(result => {
            result.classList.remove("js-result_selected");
        })
        result.classList.add("js-result_selected");
    }

    function handleMouseOutResult(event){
        const results = resultWrapper.querySelectorAll(".firstpage_search_result");
        results.forEach(result => {
            result.classList.remove("js-result_selected");
        })
        resultIndex = -1;

    }

    function handleMousemoveResult(event){
        const result = event.target.closest(".firstpage_search_result");
        resultIndex = result.dataset.index;
        const results = resultWrapper.querySelectorAll(".firstpage_search_result");
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

search();