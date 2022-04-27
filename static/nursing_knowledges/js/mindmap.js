import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';

cytoscape.use(coseBilkent);

import mindmap_css from '../css/mindmap.css';

class Mindmap{
    constructor(detailpage = false, findele = null){
        //로딩화면
        this.loading = true;

        //진단,질병 페이지 들어가면 해당 노드 표시
        this.isdetailpage = detailpage;
        this.targetNode = findele;

        //노드에 적용할 색깔
        this.globalColor ={
            pink:'#FF8080',
            dark_pink:'#D97096',

            purple:'#A6699D',
            dark_purple:'#716393',
            
            indigo:'#455879',
            dark_indigo:'#2F4858',
        };
        
        //디테일 페이지 id값
        if(detailpage){
            this.makeDetailpage(this.targetNode);
        }
        else{
            this.makedata = new MakeData();
            this.makepage();
        }
    }

    //데이터 세팅
    async makepage(){
        this.data = [];

        // 직렬 처리되던 api 호출을 한번에 병렬처리 하여 로딩속도 개선
        [
            this.largediseasedata,
            this.middeldiseasedata,
            this.smalldiseasedata,
            this.diagnosisdata,
            this.connectLargetoMiddle,
            this.connectMiddletoSmall,
            this.connectDiagnosis,
        ] = await Promise.all([
            this.makedata.getLargeDisease(),
            this.makedata.getMiddleDisease(),
            this.makedata.getSmallDisease(),
            this.makedata.getDiagnosis(),
            this.makedata.getConnectLargeToMiddle(),
            this.makedata.getConnectMiddleToSmall(),
            this.makedata.getConnectdiagnosis(),
        ]);
        
        await this.largediseasedata.forEach(element => {
            this.data.push(JSON.parse(element));
        });
        await this.middeldiseasedata.forEach(element => {
            this.data.push(JSON.parse(element));
        });
        await this.smalldiseasedata.forEach(element => {
            this.data.push(JSON.parse(element));
        });
        await this.diagnosisdata.forEach(element => {
            this.data.push(JSON.parse(element));
        });

        await this.connectLargetoMiddle.forEach(element => {
            this.data.push(JSON.parse(element));
        });
        await this.connectMiddletoSmall.forEach(element => {
            this.data.push(JSON.parse(element));
        });
        await this.connectDiagnosis.forEach(element => {
            this.data.push(JSON.parse(element));
        });
  
        this.mindmap();
    }

    //디테일 데이터 세팅
    async makeDetailpage(label){
        const address = window.location.href;
        const kind = /disease/.test(address) ? 'disease' : 'diagnosis';
        const idnum = /\d+$/.exec(address)[0];
        this.makedata = new MakeDetailData(kind, idnum, label);
        this.data = [];

        [
            this.database
        ] = await Promise.all([
            this.makedata.getData()
        ]);
        
        await this.database.forEach(element => {
            this.data.push(JSON.parse(element));
        });

    
        this.mindmap();
    }

    mindmap(){
/*------------------------------------------- 초기 세팅 ------------------------------------- */
        const minZoomlevel = 0.05; // 최소 축소 배율
        const magnification = 3; // 마우스 올라갈때 변하는 비율

        //초기 노드 스타일
        const initNodeStyle = {
            bigNodeSize : 40 * (magnification - 0.5),
            middleNodeSize : 28 * (magnification - 0.5),
            smallNodeSize : 16 * (magnification - 0.5),
            diagnosisNodeSize : 10 * (magnification - 0.5),

            bigNodeColor : '#B06E9E',
            middleNodeColor : '#FF9B7E',
            smallNodeColor :'#FFC66A',
            diagnosisNodeColor :'#F9F871',

            bigFontSize : 24 * (magnification - 0.5),
            middleFontSize : 20 * (magnification - 0.5),
            smallFontSize : 18 * (magnification - 0.5),
            diagnosisFontSize : 16 * (magnification - 0.5),

            fontColor : this.globalColor.dark_indigo,
        };
        //초기 화살표 스타일
        const initEdgeStyle = {
            edgeWidth : `${2 * magnification}px`,
            arrowScale : 2,
            edgeColor : '#e0e0e0',
        };
        //초기 스타일 (초기 노드 스타일 & 초기 화살표 스타일 합친 것)
        const initStyle ={
            'background-color' : function (ele) {
                if(ele.data("type") == "largedisease"){
                    return initNodeStyle.bigNodeColor;
                }
                else if(ele.data("type") == "middledisease"){
                    return initNodeStyle.middleNodeColor;
                }
                else if(ele.data("type") == "smalldisease"){
                    return initNodeStyle.smallNodeColor;
                }
                else{
                    return initNodeStyle.diagnosisNodeColor;
                }
            },
            'label': 'data(label)',
            
            'width': function (ele) {
                if(ele.data("type") == "largedisease"){
                    return initNodeStyle.bigNodeSize;
                }
                else if(ele.data("type") == "middledisease"){
                    return initNodeStyle.middleNodeSize;
                }
                else if(ele.data("type") == "smalldisease"){
                    return initNodeStyle.smallNodeSize;
                }
                else{
                    return initNodeStyle.diagnosisNodeSize;
                }
            },
            'height': function (ele) {
                if(ele.data("type") == "largedisease"){
                    return initNodeStyle.bigNodeSize;
                }
                else if(ele.data("type") == "middledisease"){
                    return initNodeStyle.middleNodeSize;
                }
                else if(ele.data("type") == "smalldisease"){
                    return initNodeStyle.smallNodeSize;
                }
                else{
                    return initNodeStyle.diagnosisNodeSize;
                }
            },
            'font-size': function (ele) {
                if(ele.data("type") == "largedisease"){
                    return initNodeStyle.bigFontSize;
                }
                else if(ele.data("type") == "middledisease"){
                    return initNodeStyle.middleFontSize;
                }
                else if(ele.data("type") == "smalldisease"){
                    return initNodeStyle.smallFontSize;
                }
                else{
                    return initNodeStyle.diagnosisFontSize;
                }
            },

            'fontweight' : initNodeStyle.fontWeight,
        }

        //마우스가 노드 위로 올라왔을 때, 스타일
        const  ActiveStyle = {
            selectNodeSize : initNodeStyle.bigNodeSize * (magnification - 0.5),
            neighborNodeSize : initNodeStyle.middleNodeSize * (magnification - 0.5),
            farNodeSize : initNodeStyle.smallNodeSize * (magnification - 0.5),

            selectFontSize : initNodeStyle.bigFontSize * (magnification - 1),
            neighborFontSize : initNodeStyle.middleFontSize * (magnification - 1),
            farFontSize : initNodeStyle.smallFontSize * (magnification - 1),

            edgeWidth : `${4 * magnification}px`,
            arrowScale : 2,
            edgeColor : 'red',
            arrowColor : 'red',
            
            color : 'black',
        }

        //커서 노드위로 올렸을 때 주목받지 못한 노드&화살표 색
        const dimColor = this.globalColor.dark_indigo;

        //초기 MindMap 생성
        const cy = cytoscape({
            container: document.getElementById('cy'), 

            elements: this.data,

            style: [ 
                {
                    selector: 'node',
                    style: initStyle,
                },

                {
                    selector: 'edge',
                    style: {
                        'width': initEdgeStyle.edgeWidth,
                        'curve-style' : 'bezier',
                        'line-color': initEdgeStyle.edgeColor,
                        'source-arrow-color': initEdgeStyle.edgeColor,
                        'source-arrow-shape': 'vee',
                        'arrow-scale': initEdgeStyle.arrowScale,
                    }
                }
            ],

            layout: {
                name: 'cose-bilkent',

                fit: true,             
                padding: 30,            
                randomize: true,     
                nodeRepulsion: 200000,   
                idealEdgeLength: 600,    
                edgeElasticity: 0.9,       
                nestingFactor: 0.9,        
                gravity: 0.1,             
                numIter: 2500,        
                tile: true,                
                animate: true,             
                tilingPaddingVertical: 80,  
                tilingPaddingHorizontal: 80,
                minNodeSpacing:100,
            },
            wheelSensitivity : 0.1,
        });

        //로딩 끝
        setTimeout(()=>{
            document.querySelector('.loadingio-spinner-rolling-mth6byn47dp').classList.add('disappear');
        },500);

        cy.minZoom(minZoomlevel); //최소 줌
        cy.autolock(false); // 노드 드래그로 움직이지 못하게 하는 것

        //디테일 페이지 들어갔을 때 해당 페이지 노드 표시
        if(this.isdetailpage){
            this.isinitset = true;
            searchNode(this.targetNode);
        }
/*------------------------------------------- 여러가지 함수들 ------------------------------------- */
        //투명도 주는 함수
        function setOpacityElement(target_element, degree){
            target_element.style('opacity', degree);
        }

        //검색해서 Active되는 노드 스타일 설정 함수
        function setSearchFocus(target_element){
            target_element.style('background-color',function(ele){
                if(ele.data("type") == "largedisease"){
                    return initNodeStyle.bigNodeColor;
                }
                else if(ele.data("type") == "middledisease"){
                    return initNodeStyle.middleNodeColor;
                }
                else if(ele.data("type") == "smalldisease"){
                    return initNodeStyle.smallNodeColor;
                }
                else{
                    return initNodeStyle.diagnosisNodeColor;
                }
            });

            target_element.style('width', ActiveStyle.selectNodeSize);
            target_element.style('height',ActiveStyle.selectNodeSize);
            target_element.style('font-size', ActiveStyle.selectFontSize);
            target_element.style('color', ActiveStyle.color);

            setOpacityElement(target_element, 1);
        }
        //마우스가 올라왔을 때 스타일 적용
        function setFocus(target_element){
            target_element.style('background-color',function(ele){
                if(ele.data("type") == "largedisease"){
                    return initNodeStyle.bigNodeColor;
                }
                else if(ele.data("type") == "middledisease"){
                    return initNodeStyle.middleNodeColor;
                }
                else if(ele.data("type") == "smalldisease"){
                    return initNodeStyle.smallNodeColor;
                }
                else{
                    return initNodeStyle.diagnosisNodeColor;
                }
            });

            //크기 커지게함 ( activeNodeSize보다 큰 노드는 변화 없음)
            target_element.style('width', ActiveStyle.selectNodeSize);
            target_element.style('height',ActiveStyle.selectNodeSize);
            target_element.style('font-size', ActiveStyle.selectFontSize);
            target_element.style('color', ActiveStyle.color);

            setOpacityElement(target_element, 1);
             
            //마우스-오버된 노드 윗노드 스타일 설정
            target_element.successors().each(function(e){

                e.style('width', ActiveStyle.farNodeSize);
                e.style('height', ActiveStyle.farNodeSize);
                e.style('font-size', ActiveStyle.farFontSize);
                e.style('color', ActiveStyle.color);

                if(e.isEdge()){
                    e.style('width', ActiveStyle.edgeWidth);
                    e.style('arrow-scale',ActiveStyle.arrowScale);
                    e.style('line-color', ActiveStyle.edgeColor);
                    e.style('source-arrow-color', ActiveStyle.arrowColor);
                }
                e.style('background-color',function(ele){
                    if(ele.data("type") == "largedisease"){
                        return initNodeStyle.bigNodeColor;
                    }
                    else if(ele.data("type") == "middledisease"){
                        return initNodeStyle.middleNodeColor;
                    }
                    else if(ele.data("type") == "smalldisease"){
                        return initNodeStyle.smallNodeColor;
                    }
                    else{
                        return initNodeStyle.diagnosisNodeColor;
                    }
                });
                setOpacityElement(e, 1); // 투명도
            });

            // 마우스-오버된 노드 아랫노드 스타일 지정
            target_element.predecessors().each(function(e){
                
                e.style('width', ActiveStyle.farNodeSize);
                e.style('height', ActiveStyle.farNodeSize);
                e.style('font-size', ActiveStyle.farFontSize);
                e.style('color', ActiveStyle.color);

                if(e.isEdge()){
                    e.style('width', ActiveStyle.edgeWidth);
                    e.style('arrow-scale',ActiveStyle.arrowScale);
                    e.style('line-color', ActiveStyle.edgeColor);
                    e.style('source-arrow-color', ActiveStyle.arrowColor);
                }

                e.style('background-color',function(ele){
                    if(ele.data("type") == "largedisease"){
                        return initNodeStyle.bigNodeColor;
                    }
                    else if(ele.data("type") == "middledisease"){
                        return initNodeStyle.middleNodeColor;
                    }
                    else if(ele.data("type") == "smalldisease"){
                        return initNodeStyle.smallNodeColor;
                    }
                    else{
                        return initNodeStyle.diagnosisNodeColor;
                    }
                });
                setOpacityElement(e, 1); // 투명도
            });

            //바로 아래 또는 바로 위는 투명도 없애기 + 크기 조정
            target_element.neighborhood().each(function(e){
                
                e.style('width', ActiveStyle.neighborNodeSize);
                e.style('height', ActiveStyle.neighborNodeSize);
                e.style('font-size', ActiveStyle.neighborFontSize);
                e.style('color', ActiveStyle.color);

                if(e.isEdge()){
                    e.style('width', ActiveStyle.edgeWidth);
                    e.style('arrow-scale',ActiveStyle.arrowScale);
                    e.style('line-color', ActiveStyle.edgeColor);
                    e.style('source-arrow-color', ActiveStyle.arrowColor);
                }

                e.style('background-color',function(ele){
                    if(ele.data("type") == "largedisease"){
                        return initNodeStyle.bigNodeColor;
                    }
                    else if(ele.data("type") == "middledisease"){
                        return initNodeStyle.middleNodeColor;
                    }
                    else if(ele.data("type") == "smalldisease"){
                        return initNodeStyle.smallNodeColor;
                    }
                    else{
                        return initNodeStyle.diagnosisNodeColor;
                    }
                });
                setOpacityElement(e, 1); // 투명도
            });
        }
        //마우스 올라왔을 때 주목 못받는 노드들 스타일
        function setDimStyle(target_cy, style){
            target_cy.nodes().forEach(function(target){
                target.style(style);
                setOpacityElement(target,0.3);
            });
            target_cy.edges().forEach(function(target){
                target.style(style);
                setOpacityElement(target,0.3);
            });
        }

        //마우스 밖으로 나갔을 때 스타일 적용
        function setRestFocus(target_cy){
            //노드 스타일
            target_cy.nodes().forEach(function(target){
                setOpacityElement(target,1);
                target.style('background-color', function(ele){
                    if(ele.data("type") == "largedisease"){
                        return initNodeStyle.bigNodeColor;
                    }
                    else if(ele.data("type") == "middledisease"){
                        return initNodeStyle.middleNodeColor;
                    }
                    else if(ele.data("type") == "smalldisease"){
                        return initNodeStyle.smallNodeColor;
                    }
                    else{
                        return initNodeStyle.diagnosisNodeColor;
                    }
                });
                target.style('width',function(ele){
                    if(ele.data("type") == "largedisease"){
                        return initNodeStyle.bigNodeSize;
                    }
                    else if(ele.data("type") == "middledisease"){
                        return initNodeStyle.middleNodeSize;
                    }
                    else if(ele.data("type") == "smalldisease"){
                        return initNodeStyle.smallNodeSize;
                    }
                    else{
                        return initNodeStyle.diagnosisNodeSize;
                    }
                });
                target.style('height',function(ele) {
                    if(ele.data("type") == "largedisease"){
                        return initNodeStyle.bigNodeSize;
                    }
                    else if(ele.data("type") == "middledisease"){
                        return initNodeStyle.middleNodeSize;
                    }
                    else if(ele.data("type") == "smalldisease"){
                        return initNodeStyle.smallNodeSize;
                    }
                    else{
                        return initNodeStyle.diagnosisNodeSize;
                    }
                });
                target.style('font-size',function(ele) {
                    if(ele.data("type") == "largedisease"){
                        return initNodeStyle.bigFontSize;
                    }
                    else if(ele.data("type") == "middledisease"){
                        return initNodeStyle.middleFontSize;
                    }
                    else if(ele.data("type") == "smalldisease"){
                        return initNodeStyle.smallFontSize;
                    }
                    else{
                        return initNodeStyle.diagnosisFontSize;
                    }
                });
                target.style('color', initNodeStyle.fontColor);
                
            });
            
            //화살표 스타일
            target_cy.edges().forEach(function(target){ 
                setOpacityElement(target,1);               
                target.style('line-color', initEdgeStyle.edgeColor);
                target.style('source-arrow-color', initEdgeStyle.edgeColor);
                target.style('width', initEdgeStyle.edgeWidth);
                target.style('arrow-scale', initEdgeStyle.arrowScale);
                target.style('opacity', 1);
            });
        }

        //mindmap 검색창에 검색시 노드 반짝
        function searchNode(target, searching = false){
            let target_label = target.replaceAll(' ','');
            let targetNodeArr =[];
            
            cy.filter(function(ele){
                if(ele.isNode()){
                    //띄어쓰기 무시
                    let node_label = ele.data('label').replaceAll(' ','');

                    //몇 글자만 적어도 관련 노드 번쩍 거릴 수 있게
                    if(searching){
                        let textlength = target_label.length;
                        
                        let lastchar = target_label.charAt(textlength-1);
                        if(lastchar < "가" || lastchar>"힣"){
                            textlength -= 1;
                        }

                        node_label = node_label.substr(0,textlength);
                    }

                    if(node_label === target_label){
                        targetNodeArr.push(ele);
                    }
                }
            });
    
            setDimStyle(cy, {
                'background-color' : dimColor,
                'line-color':dimColor,
                'source-arrow-color': dimColor,
                'color': dimColor,
            });
   
            targetNodeArr.forEach(element => {
                if(searching){
                    setSearchFocus(element);
                }
                else{
                    setFocus(element);
                }
            });
        }

/*--------------------------------------------이벤트 발생시 함수 적용--------------------------------------- */
        // node 하이퍼 링크
        cy.on('tap', function(e){
            const url = e.target.data('url');
            if (url && url != '' && url !='#'){
                window.open(url,"_self");
                // window.location.href = url;
            }
        });
    
        //노드위에 커서 올렸을 때
        cy.on('tapstart mouseover', 'node', function(e){
            //선택 제외 나머지 노드&화살표 연하게 처리
            setDimStyle(cy, {
                'background-color' : dimColor,
                'line-color':dimColor,
                'source-arrow-color': dimColor,
                'color': dimColor,
            });

            //선택 된 노드 스타일
            setFocus(e.target);
        });

        // 마우스 내렸을 때
        cy.on('tapend mouseout', 'node', async function(e){
            setRestFocus(e.cy);
        });

        //resize Event
        let resizeTimer;
        window.addEventListener('resize', function(){
            this.clearTimeout(resizeTimer);
            resizeTimer = this.setTimeout(function(){
                cy.fit();
            },200);
        });
    }
}

//데이터 가져오기
export class MakeData{ 
    async getLargeDisease(){
        let id, url, label, item;
        let resultArr = [];

        const databaseData = await fetch('/api/knowledges/disease-large-categories/');
        const jsonData = await databaseData.json();

        jsonData.forEach(element => {
            id = "largedisease"+(element.id);
            url = '#';
            label = element.name;

            item = JSON.stringify({
                "data":{
                    "id":  id,
                    "url": url,
                    "label": label,
                    "type":"largedisease",
                }
            });
            resultArr.push(item);
        });

        return resultArr;
    }

    async getMiddleDisease(){
        let id, url, label, item;
        let resultArr = [];

        const databaseData = await fetch('/api/knowledges/disease-medium-categories/');
        const jsonData = await databaseData.json();

        jsonData.forEach(element => {
            id = "middledisease"+(element.id).toString();
            url = '#';
            label = element.name;

            item = JSON.stringify({
                "data":{
                    "id":  id,
                    "url": url,
                    "label": label,
                    "type":"middledisease",
                }
            });
            resultArr.push(item);
        });

        return resultArr;
    }

    async getSmallDisease(){
        let id, url, label, item;
        let resultArr = [];

        const databaseData = await fetch('/api/knowledges/disease-small-categories/');
        const jsonData = await databaseData.json();

        jsonData.forEach(element => {
          
            id = "smalldisease"+(element.id).toString();
            url = "/knowledges/disease/"+(element.id).toString();
            label = element.name;

            item = JSON.stringify({
                "data":{
                    "id":  id,
                    "url": url,
                    "label": label,
                    "type":"smalldisease",
                }
            });
            resultArr.push(item);
        });

        return resultArr;
    }

    async getDiagnosis(){
        let id, url, label, item;
        let resultArr = [];

        const databaseData = await fetch('/api/knowledges/diagnoses/');
        const jsonData = await databaseData.json();

        jsonData.forEach(element => {
            id = "diagnosis"+(element.id).toString();
            url = '/knowledges/diagnosis/'+(element.id).toString();
            label = element.name;

            item = JSON.stringify({
                "data":{
                    "id": id,
                    "url": url,
                    "label": label,
                    "type":"diagnosis",
                }
            });
            resultArr.push(item);
        });

        return resultArr;
    }

    async getConnectLargeToMiddle(){
        let id, source, target, item;
        let resultArr = [];

        const databaseData = await fetch('/api/knowledges/disease-large-to-medium/');
        const jsonData = await databaseData.json();

        jsonData.forEach(element => {
            target = "largedisease"+(element.disease_large_category).toString();

            element.disease_medium_categories.forEach(ele => {
                source = "middledisease"+ (ele).toString();
                id = source + "->" + target;
    
                item = JSON.stringify({
                    "data":{
                        "id": id,
                        "source": source,
                        "target": target
                    }
                });
                resultArr.push(item); 
            });
        });

        return resultArr;
    }

    async getConnectMiddleToSmall(){
        let id, source, target, item;
        let resultArr = [];

        const databaseData = await fetch('/api/knowledges/disease-medium-to-small/');
        const jsonData = await databaseData.json();

        jsonData.forEach(element => {
            target = "middledisease"+(element.disease_medium_category).toString();

            element.disease_small_categories_by_medium.forEach(ele => {
                source = "smalldisease"+ (ele).toString();
                id = source + "->" + target;
    
                item = JSON.stringify({
                    "data":{
                        "id": id,
                        "source": source,
                        "target": target
                    }
                });
                resultArr.push(item); 
            });               
            
        });

        return resultArr;
    }

    async getConnectdiagnosis(){
        let id, source, target, item;
        let resultArr = [];

        const databaseData = await fetch('/api/knowledges/diagnosis-to-other/');
        const jsonData = await databaseData.json();

        jsonData.forEach(element => {
            if(element.disease_medium_category){
                target = "middledisease"+ (element.disease_medium_category).toString();
            }
            else{
                target = "smalldisease"+ (element.disease_small_category).toString();
            }

            source = "diagnosis"+(element.diagnosis).toString();
            id = source + "->" + target;
            item = JSON.stringify({
                "data":{
                    "id": id,
                    "source": source,
                    "target": target
                }
            });
            resultArr.push(item); 
        });

        return resultArr;
    }
}

//디테일 페이지 데이터 가져오기
export class MakeDetailData{ 
    constructor(targetkind, targetid, name){
        this.targetkind = targetkind
        this.targetid = targetid;
        this.targetname = name;
    }

    async getData(){
            const subaddress =  this.targetkind == 'disease'? `disease_small_category_id=${this.targetid}` : `diagnosis_small_category_id=${this.targetid}`;
            const address = '/api/knowledges/detail-mindmap-data/?' + subaddress;
            let result =[];
    
            const database = await fetch(address);
            const jsonData = await database.json();
            console.log(jsonData);
    
            let source, target;
    
            //대분류 추가
            let id, url, label, item;
    
            id = "largedisease" + (jsonData.disease_large_category.id).toString();
            url ='#';
            label = jsonData.disease_large_category.name;
    
            item = JSON.stringify({
                "data":{
                    "id":  id,
                    "url": url,
                    "label": label,
                    "type":"largedisease",
                }
            });
            result.push(item);
    
            //대분류-소분류 관계 추가
            if(jsonData.disease_large_category.disease_small_categories){
                let largetarget = "largedisease" +(jsonData.disease_large_category.id).toString();
            
                jsonData.disease_large_category.disease_small_categories.forEach(ele =>{
                    let largesource = "smalldisease"+(ele.id);
                    let largeconnectid = largesource +"-> "+ largetarget;
        
                    let largeconnectitem = JSON.stringify({
                        "data":{
                            "id": largeconnectid,
                            "source": largesource,
                            "target": largetarget
                        }
                    });
        
                    result.push(largeconnectitem);
        
                    //소분류 추가
                    let largetosmallid = "smalldisease"+(ele.id).toString();
                    let largetosmallurl = "/knowledges/disease/"+(ele.id).toString();
                    let largetosmalllabel = ele.name;
            
                    let largetosmallitem = JSON.stringify({
                        "data":{
                            "id":  largetosmallid,
                            "url": largetosmallurl,
                            "label": largetosmalllabel,
                            "type":"smalldisease",
                        }
                    });
        
                    result.push(largetosmallitem);
        
                    //소분류-진단 관계 추가
                    let smalltodiatarget = largetosmallid;
        
                    ele.diagnoses.forEach(el=>{
                        let smalltodiasource = "diagnosis" +(el.id).toString(); 
                        let smalltodiaid = smalltodiasource + "->" + smalltodiatarget;
                        let smalltodiaitem = JSON.stringify({
                            "data":{
                                "id": smalltodiaid,
                                "source": smalltodiasource,
                                "target": smalltodiatarget
                            }
                        });
        
                        result.push(smalltodiaitem);
        
                        //진단 추가
                        let dia_id = "diagnosis"+(el.id).toString();
                        let dia_url = '/knowledges/diagnosis/'+(el.id).toString();
                        let dia_label = el.name;
            
                        let dia_item = JSON.stringify({
                            "data":{
                                "id": dia_id,
                                "url": dia_url,
                                "label": dia_label,
                                "type":"diagnosis",
                            }
                        });
                        result.push(dia_item);
                    })
                })
            }
            
            //대분류-중분류 관계 추가
            target = "largedisease" +(jsonData.disease_large_category.id).toString();

            jsonData.disease_medium_categories.forEach(element => {
                source = "middledisease"+(element.id).toString();
                id = source + "->" + target;

                item = JSON.stringify({
                    "data":{
                        "id": id,
                        "source": source,
                        "target": target
                    }
                });

                result.push(item);

                //중분류 추가
                let midid = "middledisease"+(element.id).toString();
                let midurl ="#";
                let midlabel = element.name;

                let miditem = JSON.stringify({
                    "data":{
                        "id":  midid,
                        "url": midurl,
                        "label": midlabel,
                        "type":"middledisease",
                    }
                });

                result.push(miditem);

                //중분류-소분류 관계 추가
                let midtarget = midid;
                element.disease_small_categories.forEach(ele =>{
                    let midsource = "smalldisease" + (ele.id).toString();
                    let connectid = midsource + "->" + midtarget;

                    let connectitem = JSON.stringify({
                        "data":{
                            "id": connectid,
                            "source": midsource,
                            "target": midtarget
                        }
                    });
                    result.push(connectitem);

                    //소분류 추가
                    let smallid = "smalldisease"+(ele.id).toString();
                    let smallurl = "/knowledges/disease/"+(ele.id).toString();
                    let smalllabel = ele.name;
        
                    let smallitem = JSON.stringify({
                        "data":{
                            "id":  smallid,
                            "url": smallurl,
                            "label": smalllabel,
                            "type":"smalldisease",
                        }
                    });

                    result.push(smallitem);

                    //소분류-진단 관계 추가
                    let dtarget = "smalldisease"+(ele.id).toString();
                    ele.diagnoses.forEach(el =>{
                        let dsource = "diagnosis" +(el.id).toString(); 
                        let did = dsource + "->" + dtarget;
                        let ditem = JSON.stringify({
                            "data":{
                                "id": did,
                                "source": dsource,
                                "target": dtarget
                            }
                        });

                        result.push(ditem);

                        //진단 추가
                        let diaid = "diagnosis"+(el.id).toString();
                        let diaurl = '/knowledges/diagnosis/'+(el.id).toString();
                        let dialabel = el.name;
            
                        let diaitem = JSON.stringify({
                            "data":{
                                "id": diaid,
                                "url": diaurl,
                                "label": dialabel,
                                "type":"diagnosis",
                            }
                        });
                        result.push(diaitem);
                    });
                });
            });
   
            /*
            let ex_dia_id = "diagnosis"+(this.targetid).toString();
            let ex_dia_url = '/knowledges/diagnosis/'+(this.targetid).toString();
            let ex_dia_label = this.targetname;

            let ex_dia_item = JSON.stringify({
                "data":{
                    "id": ex_dia_id,
                    "url": ex_dia_url,
                    "label": ex_dia_label,
                    "type":"diagnosis",
                }
            });
            result.push(ex_dia_item);
            */
  
            return result;
    }
}
export class MakeFullData{
    constructor(targetkind, targetid, name){
        this.targetkind = targetkind
        this.targetid = targetid;
        this.targetname = name;
    }

    async getData(){
            const subaddress =  this.targetkind == 'disease'? `disease_small_category_id=${this.targetid}` : `diagnosis_small_category_id=${this.targetid}`;
            const address = '/api/knowledges/detail-mindmap-data/?' + subaddress;
            let result =[];
    
            const database = await fetch(address);
            const jsonData = await database.json();
            console.log(jsonData);
    
            let source, target;
    
            //대분류 추가
            let id, url, label, item;
    
            id = "largedisease" + (jsonData.disease_large_category.id).toString();
            url ='#';
            label = jsonData.disease_large_category.name;
    
            item = JSON.stringify({
                "data":{
                    "id":  id,
                    "url": url,
                    "label": label,
                    "type":"largedisease",
                }
            });
            result.push(item);
    
            //대분류-소분류 관계 추가
            if(jsonData.disease_large_category.disease_small_categories){
                let largetarget = "largedisease" +(jsonData.disease_large_category.id).toString();
            
                jsonData.disease_large_category.disease_small_categories.forEach(ele =>{
                    let largesource = "smalldisease"+(ele.id);
                    let largeconnectid = largesource +"-> "+ largetarget;
        
                    let largeconnectitem = JSON.stringify({
                        "data":{
                            "id": largeconnectid,
                            "source": largesource,
                            "target": largetarget
                        }
                    });
        
                    result.push(largeconnectitem);
        
                    //소분류 추가
                    let largetosmallid = "smalldisease"+(ele.id).toString();
                    let largetosmallurl = "/knowledges/disease/"+(ele.id).toString();
                    let largetosmalllabel = ele.name;
            
                    let largetosmallitem = JSON.stringify({
                        "data":{
                            "id":  largetosmallid,
                            "url": largetosmallurl,
                            "label": largetosmalllabel,
                            "type":"smalldisease",
                        }
                    });
        
                    result.push(largetosmallitem);
        
                    //소분류-진단 관계 추가
                    let smalltodiatarget = largetosmallid;
        
                    ele.diagnoses.forEach(el=>{
                        let smalltodiasource = "diagnosis" +(el.id).toString(); 
                        let smalltodiaid = smalltodiasource + "->" + smalltodiatarget;
                        let smalltodiaitem = JSON.stringify({
                            "data":{
                                "id": smalltodiaid,
                                "source": smalltodiasource,
                                "target": smalltodiatarget
                            }
                        });
        
                        result.push(smalltodiaitem);
        
                        //진단 추가
                        let dia_id = "diagnosis"+(el.id).toString();
                        let dia_url = '/knowledges/diagnosis/'+(el.id).toString();
                        let dia_label = el.name;
            
                        let dia_item = JSON.stringify({
                            "data":{
                                "id": dia_id,
                                "url": dia_url,
                                "label": dia_label,
                                "type":"diagnosis",
                            }
                        });
                        result.push(dia_item);
                    })
                })
            }
            
            //대분류-중분류 관계 추가
            target = "largedisease" +(jsonData.disease_large_category.id).toString();

            jsonData.disease_medium_categories.forEach(element => {
                source = "middledisease"+(element.id).toString();
                id = source + "->" + target;

                item = JSON.stringify({
                    "data":{
                        "id": id,
                        "source": source,
                        "target": target
                    }
                });

                result.push(item);

                //중분류 추가
                let midid = "middledisease"+(element.id).toString();
                let midurl ="#";
                let midlabel = element.name;

                let miditem = JSON.stringify({
                    "data":{
                        "id":  midid,
                        "url": midurl,
                        "label": midlabel,
                        "type":"middledisease",
                    }
                });

                result.push(miditem);

                //중분류-소분류 관계 추가
                let midtarget = midid;
                element.disease_small_categories.forEach(ele =>{
                    let midsource = "smalldisease" + (ele.id).toString();
                    let connectid = midsource + "->" + midtarget;

                    let connectitem = JSON.stringify({
                        "data":{
                            "id": connectid,
                            "source": midsource,
                            "target": midtarget
                        }
                    });
                    result.push(connectitem);

                    //소분류 추가
                    let smallid = "smalldisease"+(ele.id).toString();
                    let smallurl = "/knowledges/disease/"+(ele.id).toString();
                    let smalllabel = ele.name;
        
                    let smallitem = JSON.stringify({
                        "data":{
                            "id":  smallid,
                            "url": smallurl,
                            "label": smalllabel,
                            "type":"smalldisease",
                        }
                    });

                    result.push(smallitem);

                    //소분류-진단 관계 추가
                    let dtarget = "smalldisease"+(ele.id).toString();
                    ele.diagnoses.forEach(el =>{
                        let dsource = "diagnosis" +(el.id).toString(); 
                        let did = dsource + "->" + dtarget;
                        let ditem = JSON.stringify({
                            "data":{
                                "id": did,
                                "source": dsource,
                                "target": dtarget
                            }
                        });

                        result.push(ditem);

                        //진단 추가
                        let diaid = "diagnosis"+(el.id).toString();
                        let diaurl = '/knowledges/diagnosis/'+(el.id).toString();
                        let dialabel = el.name;
            
                        let diaitem = JSON.stringify({
                            "data":{
                                "id": diaid,
                                "url": diaurl,
                                "label": dialabel,
                                "type":"diagnosis",
                            }
                        });
                        result.push(diaitem);
                    });
                });
            });
   
            /*
            let ex_dia_id = "diagnosis"+(this.targetid).toString();
            let ex_dia_url = '/knowledges/diagnosis/'+(this.targetid).toString();
            let ex_dia_label = this.targetname;

            let ex_dia_item = JSON.stringify({
                "data":{
                    "id": ex_dia_id,
                    "url": ex_dia_url,
                    "label": ex_dia_label,
                    "type":"diagnosis",
                }
            });
            result.push(ex_dia_item);
            */
  
            return result;
    }
}
export default Mindmap;