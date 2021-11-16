import secondpage_css from "../css/secondpage.css";
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';

cytoscape.use(coseBilkent);

export class Secondpage{
    constructor(){

        this.setpageSize();

        this.makepage();
    }

    setpageSize(){
        const headerHeight = 80;
        const bottom_margin = 30;

        const secondpage = document.querySelector('.secondpage');
        const setHeight = secondpage.clientHeight - headerHeight;
        
        secondpage.style.height = `${setHeight - bottom_margin}px`;
        secondpage.style.top = `${headerHeight}px`;
    }

    async makepage(){
        this.makedata = new MakeData();
        this.data = [];
        
        this.diseasedata = await this.makedata.getDisease();
        this.diagnosesdata = await this.makedata.getDiagnoses();
        this.interventionsdata = await this.makedata.getInterventions();
        this.connectdisTodiadata = await this.makedata.getConnectdisTodia();
        this.connectdiaTointerdata = await this.makedata.getConnectdiaTointer();
   
        this.diseasedata.forEach(element => {
            this.data.push(JSON.parse(element));
        });
        this.diagnosesdata.forEach(element => {
            this.data.push(JSON.parse(element));
        });
        this.interventionsdata.forEach(element => {
            this.data.push(JSON.parse(element));
        });
        this.connectdisTodiadata.forEach(element => {
            this.data.push(JSON.parse(element));
        });
        this.connectdiaTointerdata.forEach(element => {
            this.data.push(JSON.parse(element));
        });
        

        console.log("이게 먼저야 ㅜㅜㅜ");
        console.log(this.data);
        this.mindmap();
    }
    
    mindmap(){
// webpack으로 묶어줘야 하니 css파일을 진입점인 index.js 에 import 합니다
        console.log("제발 이게 늦게");
        const data = this.data;
              
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
        
    }

    async getDisease(){
        let id, url, label, item;
        let diseaseArr = [];

        const disease = await fetch('/api/knowledges/diseases');
        const disease_objects = await disease.json();

        disease_objects.forEach(element => {
            id = element.id;
            url = '#';
            label = element.name;

            item = JSON.stringify({"data":{"id": id,"url": url,"label": label}});
            diseaseArr.push(item);
        });

        return diseaseArr;
    }

    async getDiagnoses(){
        let id, url, label, item;
        let diagnosesArr = [];

        const diagnoses = await fetch('/api/knowledges/diagnoses');
        const diagnoses_objects = await diagnoses.json();

        diagnoses_objects.forEach(element => {
            id = element.id;
            url = '#';
            label = element.name;

            item = JSON.stringify({"data":{"id": id,"url": url,"label": label}});
            diagnosesArr.push(item);
        });

        return diagnosesArr;
    }

    async getInterventions(){
        let id, url, label, item;
        let interventionsArr = [];

        const interventions = await fetch('/api/knowledges/interventions');
        const interventions_objects = await interventions.json();

        interventions_objects.forEach(element => {
            id = element.id;
            url = '#';
            label = element.name;

            item = JSON.stringify({"data":{"id": id,"url": url,"label": label}});
            interventionsArr.push(item);
        });

        return interventionsArr;
    }

    async getConnectdisTodia(){
        let id, source, target, item;
        let connectdisNdiaArr = [];

        const connectdisTodia = await fetch('/api/knowledges/disease-to-diagnosis');
        const connectdisTodia_objects = await connectdisTodia.json();

        connectdisTodia_objects.forEach(element => {
            
            source = element.disease.id;
            target = element.diagnosis.id;
            id = source + "->" + target;

            item = JSON.stringify({"data":{"id": id,"source": source,"target": target}});
            connectdisNdiaArr.push(item);
        });

        return connectdisNdiaArr;
    }
    
    async getConnectdiaTointer(){
        let id, source, target, item;
        let connectdiaNinterArr = [];

        const connectdiaTointer = await fetch('/api/knowledges/intervention-to-others');
        const connectdiaTointer_objects = await connectdiaTointer.json();

        console.log(connectdiaTointer_objects);
        connectdiaTointer_objects.forEach(element => {
            
            source = element.connection.diagnosis.id;
            target = element.intervention.id;
            id = source + "->" + target;

            item = JSON.stringify({"data":{"id": id,"source": source,"target": target}});
            connectdiaNinterArr.push(item);
        });

        return connectdiaNinterArr;
    }
}