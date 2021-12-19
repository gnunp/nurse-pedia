import { cloneDeep } from "lodash";

const search = () => {
    const keyword = document.querySelector(".js-search_keyword");
    const resultWrapper = document.querySelector(".js-search_result_wrapper");
    
    let searchHistory = {};

    let beforeKeyword = "";

    keyword.addEventListener("input", handleChangeKeyword);


    //--------------------------------------- 함수 모음 -------------------------------------------

    // 검색어를 통해 Elastic Search API를 호출하여 결과를 HTML에 반환하는 함수
    async function handleChangeKeyword(event){
        const keyword = event.target.value;
        const lastLetter = keyword.charAt(keyword.length-1);

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

            const searchResultJSON = await searchResultJSONFor(keyword);
            searchHistory[keyword] = searchResultJSON;

            // 검색 결과가 없는 경우
            if(searchResultJSON.count < 1){
                if(beforeKeyword.length !== keyword.length){
                    resetSearchResultHTML();
                }
                beforeKeyword = keyword;
                return
            }
            // 있는 경우
            resetSearchResultHTML();
            setSearchResultHTML(searchResultJSON.results);
            beforeKeyword = keyword;
        }

        if(keyword === ""){
            resetSearchResultHTML();
        }
    }
    
    // 한글 글자(자음은 x)이면 true를 반환하는 함수
    function isKoreanLetter(string){
        const KoreanRegex = /[가-힣]/;
        return KoreanRegex.test(string);
    }

    async function searchResultJSONFor(keyword){
        let searchQuery;
        if(keyword.split(" ").length > 1){
            searchQuery = "search_multi_match";
        }
        else{
            searchQuery = "name__contains";
        }
        const response = await fetch(`/api/search/?${searchQuery}=${keyword}`);
        const json = await response.json();
        return json;
    }

    function resetSearchResultHTML(){
        resultWrapper.innerHTML = ""; 
    }

    function setSearchResultHTML(json){
        const jsonToSortedArray = sortSearchResult(json);
        const sliced5ElementArray = jsonToSortedArray.slice(0,5);
        sliced5ElementArray.forEach(data => {
            resultWrapper.insertAdjacentHTML(
                "beforeend",
                `
                <div class="firstpage_search_result" data-id="${data.id}">
                    <i class="fas fa-plus-circle"></i>
                    <span class="name">${data.name}</span>
                </div>
                `
                )
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
}

search();