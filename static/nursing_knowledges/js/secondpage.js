import secondpage_css from "../css/secondpage.css";
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';

cytoscape.use(coseBilkent);

export class Secondpage{
    constructor(){
        this.mindmap();
        const makedata = new MakeData();
        this.data = makedata.data;

        const test = document.querySelector('.test')
        test.textContent = this.data;
    }
    
    mindmap(){
// webpack으로 묶어줘야 하니 css파일을 진입점인 index.js 에 import 합니다
        const data =this.data;
              
        const cy_for_rank = cytoscape({
            elements: data
        });
        // rank를 활용하기 위해 data만 입력한 cytoscape 객체입니다

        const pageRank = cy_for_rank.elements().pageRank();
        // elements들의 rank들입니다.

        const nodeMaxSize = 50;
        const nodeMinSize = 5;
        const fontMaxSize = 8;
        const fontMinSize = 5;
        // 아래는 공식 사이트에 올라와 있는 예제 코드입니다
        const cy = cytoscape({

            container: document.getElementById('cy'), // container to render in

            elements: data,

            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        'background-color': '#666',
                        'label': 'data(label)',
                        
                        'width': function (ele) {
                            return nodeMaxSize *  pageRank.rank('#' + ele.id())  + nodeMinSize;
                        },
                        'height': function (ele) {
                            return nodeMaxSize *  pageRank.rank('#' + ele.id()) + nodeMinSize;
                        },
                        'font-size': function (ele) {
                            return fontMaxSize *   pageRank.rank('#' + ele.id()) + fontMinSize;
                        }
                    }
                },

                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'curve-style' : 'bezier',
                        'line-color': '#ccc',
                        'source-arrow-color': '#ccc',
                        'source-arrow-shape': 'vee'
                    }
                }
            ],

            layout: {
                name: 'cose-bilkent',
                animate: false,
                graviyRangeCompound: 1.5,
                fit: true,
                tile : true
            }

        });

        cy.on('tap', function(e){
            const url = e.target.data('url')
            if (url && url != ''){
                window.open(url);
            }
        });
    }
}   

export class MakeData{
    constructor(){
        this.diseasedata = this.getDisease();
        console.log(this.diseasedata);
        this.diagnosesdata = this.getDiagnoses();
        this.interventionsdata = this.getInterventions();
        this.connectdisNdia = this.getConnectdisTodia();
        this.connentdiaNinter = this.getConnectdiaTointer();
    }

    get data(){
        let dataArr = [];
        dataArr.push(this.diseasedata);
        dataArr.push(this.diagnosesdata);
        dataArr.push(this.interventionsdata);
        dataArr.push(this.connectdisNdia);
        dataArr.push(this.connentdiaNinter);
        return dataArr;
    }

    async getDisease(){
        const disease = await fetch('/api/knowledges/diseases')
            .then((response) => response.json())
            .then((data) => JSON.stringify(data))
            .then((item) => JSON.parse(item));

        let id, url, label;
        let diseaseArr = [];
        disease.forEach(element => {
            id = element.name;
            url = '#';
            label = element.name;

            diseaseArr.push({
                "data":{
                    "id": id,
                    "url": url,
                    "label": label
                }
            });
        });

        return diseaseArr; //Object 형식으로 리스트 형식으로 뽑아 사용하면 됨.
    }

    async getDiagnoses(){
        const diagnoses = await fetch('/api/knowledges/diagnoses')
            .then((response) => response.json())
            .then((data) => JSON.stringify(data))
            .then((item) => JSON.parse(item));

        let id, url, label;
        let diagnosesArr = [];
        diagnoses.forEach(element => {
            id = element.id;
            url = '#';
            label = element.name;

            diagnosesArr.push({
                "data":{
                    "id": id,
                    "url": url,
                    "label": label
                }
            });
        });

        return diagnosesArr; //Object 형식으로 리스트 형식으로 뽑아 사용하면 됨.
    }

    async getInterventions(){
        const interventions = await fetch('/api/knowledges/interventions')
            .then((response) => response.json())
            .then((data) => JSON.stringify(data))
            .then((item) => JSON.parse(item));

        let id, url, label;
        let interventionsArr = [];
        interventions.forEach(element => {
            id = element.id;
            url = '#';
            label = element.name;

            interventions.push({
                "data":{
                    "id": id,
                    "url": url,
                    "label": label
                }
            });
        });

        return interventionsArr; //Object 형식으로 리스트 형식으로 뽑아 사용하면 됨.
    }

    async getConnectdisTodia(){
        const connectdistodia = await fetch('/api/knowledges/disease-to-diagnosis')
            .then((response) => response.json())
            .then((data) => JSON.stringify(data))
            .then((item) => JSON.parse(item));
        
        let id, source, target;
        let connectdisNdiaArr =[];
        connectdistodia.forEach(element => {
            source = element.disease.name;
            target = element.diagnosis.name;
            id = source + "->" + target;

            connectdisNdiaArr.push({
                "data":{
                    "id": id,"source" : source,"target":target
                }
            })
        });
        return connectdisNdiaArr; //Object 형식으로 리스트 형식으로 뽑아 사용하면 됨.
    }

    async getConnectdiaTointer(){
        const connectdiatointer = await fetch('/api/knowledges/intervention-to-others')
            .then((response) => response.json())
            .then((data) => JSON.stringify(data))
            .then((item) => JSON.parse(item));

        let id, source, target;
        let connectdiaNinterArr =[];
        connectdiatointer.forEach(element => {
            
            source = element.connection.diagnosis.name;
            target = element.intervention.content;
            id = source + "->" + target;

            connectdiaNinterArr.push({
                "data":{
                    "id": id,"source" : source,"target":target
                }
            })
        });
        return connectdiaNinterArr; //Object 형식으로 리스트 형식으로 뽑아 사용하면 됨.
    }
}