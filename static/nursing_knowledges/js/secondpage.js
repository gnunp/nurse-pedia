import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';

cytoscape.use(coseBilkent);

import secondpage_css from '../css/secondpage.css'

class Secondpage{
    constructor(){
        
        //노드에 적용할 색깔
        this.globalColor ={
            pink:'#FF8080',
            dark_pink:'#D97096',

            purple:'#A6699D',
            dark_purple:'#716393',
            
            indigo:'#455879',
            dark_indigo:'#2F4858',
        };

        this.makedata = new MakeData();

        this.makepage();
    }


    async makepage(){
        this.data = [];

        this.largediseasedata = await this.makedata.getLargeDisease();
        this.middeldiseasedata = await this.makedata.getMiddleDisease();
        this.smalldiseasedata = await this.makedata.getSmallDisease();
        this.diagnosisdata = await this.makedata.getDiagnosis();
        this.connectLargetoMiddle = await this.makedata.getConnectLargeToMiddle();
        this.connectMiddletoSmall = await this.makedata.getConnectMiddleToSmall();
        this.connectDiagnosis = await this.makedata.getConnectdiagnosis();

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
    
    mindmap(){

        const minZoomlevel = 1; // 최소 축소 배율
        const maxzoomlevel = 5; // 최대 확대 배율

        //초기 노드 스타일
        const initNodeStyle = {
            bigNodeSize : 40,
            middleNodeSize : 28,
            smallNodeSize : 16,
            diagnosisNodeSize : 10,

            backgroundColor : this.globalColor.dark_indigo,

            bigFontSize : 16,
            middleFontSize : 14,
            smallFontSize : 12,
            diagnosisFontSize : 10,

            fontColor : this.globalColor.dark_indigo,
        };
        //초기 화살표 스타일
        const initEdgeStyle = {
            edgeWidth : '1px',
            arrowScale : 0.5,
            edgeColor : 'gray',
        };
        //초기 스타일 (초기 노드 스타일 & 초기 화살표 스타일 합친 것)
        const initStyle ={
            'background-color': initNodeStyle.backgroundColor,
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

            'color' : initNodeStyle.fontColor,
        }

        //마우스가 노드 위로 올라왔을 때, 스타일
        const ActiveStyle = {
            activeNodeColor : this.globalColor.pink,
            activeNodeSize : '40',
            activeFontSize : 16,
            activeFontColor : this.globalColor.pink,

            subActiveDiaNodeSize :'18',
            subActiveSmallNodeSize :'24',
            subActiveMiddleNodeSize : '34',

            closeNodeColor : this.globalColor.purple,
            closeArrowColor : this.globalColor.dark_purple,
            closeFontColor : this.globalColor.dark_purple,

            farNodeColor : this.globalColor.indigo,
            farArrowColor : this.globalColor.dark_indigo,
            farFontColor :  this.globalColor.dark_indigo,

            arrowActiveScale : 2.0,
            edgeActiveWidth :'4px',
        }

        const dimColor = this.globalColor.dark_indigo;//커서 노드위로 올렸을 때 주목받지 못한 노드&화살표 색


        //초기 MindMap 생성
        const cy = cytoscape({

            container: document.getElementById('cy'), 

            elements: this.data,

            style: [ // the stylesheet for the graph
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
                animate: false,
                graviyRangeCompound: 12,
                fit: true,
                tile : true,
                spacingFactor: 1.5,
                quality:'default',
                fit:true,
            }

        });

        //수정 필요: 이렇게 설정하면 두가지 줌 밖에 조정 안됨
        cy.minZoom(minZoomlevel); //최소 줌
        cy.maxZoom(maxzoomlevel); //최대 줌


        cy.autolock(false); // 노드 드래그로 움직이지 못하게 하는 것


        //투명도 주는 함수
        function setOpacityElement(target_element, degree){
            target_element.style('opacity', degree);
        }

        //마우스가 올라왔을 때 스타일 적용
        function setFocus(target_element, arrowScale){
            //마우스-오버된 노드 색 설정
            target_element.style('background-color', ActiveStyle.activeNodeColor);
            //마우스-오버된 폰트 색 설정
            target_element.style('color', ActiveStyle.activeFontColor);
            //마우스-오버된 화살표 크기
            target_element.style('arrow-scale', arrowScale);
            //크기 커지게함 ( activeNodeSize보다 큰 노드는 변화 없음)
            target_element.style('width', Math.max(parseFloat(target_element.style('width')), ActiveStyle.activeNodeSize));
            target_element.style('height', Math.max(parseFloat(target_element.style('height')), ActiveStyle.activeNodeSize));
            target_element.style('font-size', Math.max(parseFloat(target_element.style('font-size')), ActiveStyle.activeFontSize));
             
            //마우스-오버된 노드 윗노드 스타일 설정
            target_element.successors().each(function(e){
                e.style('background-color', ActiveStyle.farNodeColor);//노드색
                e.style('line-color', ActiveStyle.farArrowColor);//라인색
                e.style('color', ActiveStyle.farFontColor);//텍스트 색
                e.style('source-arrow-color', ActiveStyle.farArrowColor); //화살표 색
                setOpacityElement(e, 1); // 투명도
            });

            // 마우스-오버된 노드 아랫노드 스타일 지정
            target_element.predecessors().each(function(e){
                e.style('background-color', ActiveStyle.farNodeColor);//노드색
                e.style('line-color', ActiveStyle.farArrowColor);//라인색
                e.style('color', ActiveStyle.farFontColor);//텍스트 색
                e.style('source-arrow-color', ActiveStyle.farArrowColor); //화살표 색
                setOpacityElement(e, 1); // 투명도
            });

            //바로 아래 또는 바로 위는 투명도 없애기 + 크기 조정
            target_element.neighborhood().each(function(e){
                switch(e.data("type")){
                    case "middeldisease":
                        e.style('width',ActiveStyle.subActiveMiddleNodeSize);
                        e.style('height',ActiveStyle.subActiveMiddleNodeSize);
                        break;
                    case "smalldisease":
                        e.style('width',ActiveStyle.subActiveSmallNodeSize);
                        e.style('height',ActiveStyle.subActiveSmallNodeSize);
                        break;
                    case "diagnosis":
                        e.style('width',ActiveStyle.subActiveDiaNodeSize);
                        e.style('height',ActiveStyle.subActiveDiaNodeSize);
                        break;
                }
                e.style('background-color', ActiveStyle.closeNodeColor);//노드색
                e.style('line-color', ActiveStyle.closeArrowColor);//라인색
                e.style('color', ActiveStyle.closeFontColor);//텍스트 색
                e.style('source-arrow-color', ActiveStyle.closeArrowColor); //화살표 색
                setOpacityElement(e,1);
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
                target.style('background-color', initNodeStyle.backgroundColor);
                target.style('color', initNodeStyle.fontColor);
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
                target.style('height',function (ele) {
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
                target.style('font-size',function (ele) {
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
                'color': dimColor
            });

            //선택 된 노드 스타일
            setFocus(e.target, ActiveStyle.arrowActiveScale);
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

export class MakeData{ 
    /*
    APIView에서 데이터 가져옴
    -> cy에서 원하는 형태의 data로 가공 
    -> 배열에 넣어서 전달
    */

    //type = ['largedisease','middledisease','smalldease','diagnosis']
    /*
    id ={
        Large_Disease : largedisease<int:pk>,
        middle_disease : middledisease<int:pk>,
        small_disease : samlldisease<ink:pk>,
        diagnosis : diagnosis<int:pk>
    }
    */

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

            element.disease_small_categories.forEach(ele => {
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

export default Secondpage;