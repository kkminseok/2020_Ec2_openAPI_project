let express = require("express");
var cheerio = require('cheerio');
var request = require('request');
let iconv = require('iconv-lite');
const { callbackify } = require('util');
var cors = require('cors')
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
const { fstat } = require("fs");
const { response } = require("express");
let app = express();
process.setMaxListeners(50);
app.listen(23023, function(){
    console.log("App is running on port 23023");
});
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

app.get("/", function(req, res){
    res.sendFile(path.resolve('index.html'));
});

app.post('/param',(req,res)=> {
    console.log(req.body.from,req.body.to,"asdasd");
    var fsigu = req.body.from.split(' ');
    var tsigu = req.body.to.split(' ');

    var fromsidocode = checksi(fsigu[0]);
    console.log(fromsidocode);
    var tosidocode = checksi(tsigu[0]);
    console.log(tosidocode);

    
    var fromgugun = checkgugun(fromsidocode[1],fsigu[1]);
    console.log(fromgugun);
    var togugun = checkgugun(tosidocode[1],tsigu[1]);
    console.log(togugun);
    fromsidocode[0]*=1;
    fromgugun*=1;
//    fromsidocode[0]+="";
    tosidocode[0]*=1;
    togugun*=1;
//    tosidocode[0]+="";
    console.log(fromsidocode[0],fromgugun);
    console.log(tosidocode[0],togugun);
    
   
    
    bicaccident(fromsidocode[0],fromgugun);
    
    childaccident(fromsidocode[0],fromgugun);
    freezingaccident(fromsidocode[0],fromgugun);
    lgrVioaccident(fromsidocode[0],fromgugun);
    oldaccident(fromsidocode[0],fromgugun);
    schoolaccident(fromsidocode[0],fromgugun);
    motoraccident(fromsidocode[0],fromgugun);
    jaywalkingaccident(fromsidocode[0],fromgugun);
    tmzoneaccident(fromsidocode[0],fromgugun);
     
    
    bicaccident(tosidocode[0],togugun);
    childaccident(tosidocode[0],togugun);
    freezingaccident(tosidocode[0],togugun);
    lgrVioaccident(tosidocode[0],togugun);
    oldaccident(tosidocode[0],togugun);
    schoolaccident(tosidocode[0],togugun);
    motoraccident(tosidocode[0],togugun);
    jaywalkingaccident(tosidocode[0],togugun);
    tmzoneaccident(tosidocode[0],togugun);
    
    //?????? ??????
    var data = fs.readFileSync('test.txt','utf-8');
    console.log("data : ",data);
    res.send({result:data});
    
});

app.post('/login', (req, res) => {
    console.log(req.body.from, req.body.to);
    var result = req.body.from +'-'+ req.body.to;
    res.send({result:result});
});
function checksi(sido){
    let data = fs.readFileSync('sido.txt');
    //console.log(data.toString());
    var temparr = [];
    let utf8Str = iconv.decode(data,'euc-kr');
    var step1 = utf8Str.split('\n');
    for(var i = 0;i<18;i++)
    {
        var temp = step1[i].split('-');
        if(temp[0]==sido)
        {
            temparr.push(temp[1]);
            temparr.push(i+1);
            return temparr;
        }
    }
    
}
function checkgugun(sido,gugun){
    query = "gugun" + sido + ".txt";
    let data = fs.readFileSync(query);
    let utf8Str = iconv.decode(data,'euc-kr');
    var step1 = utf8Str.split('\n');
    for(var i =0;i<step1.length;i++)
    {
        var temp = step1[i].split('-');
        if(temp[0]==gugun)
        {
            return temp[1];
        }
    }

}



// ?????? ???????????? ?????? ????????? ?????? ??????

function total_accident(sido, gugun){
    var url = 'http://apis.data.go.kr/B552061/lgStat/getRestLgStat';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=tb0fBFriL6907pivP%2F5F5UYEWXMg4kFAvanqjqdoCbZsnRO9X0hrdyQehUN8rvGO6mZN6wnles3OuVmed4K8JA%3D%3D'; 
    queryParams += '&' + encodeURIComponent('searchYearCd') + '=' + encodeURIComponent('2019'); //??????
    queryParams += '&' + encodeURIComponent('siDo') + '=' + encodeURIComponent(sido); // 1100~2700(100??????)
    queryParams += '&' + encodeURIComponent('guGun') + '=' + encodeURIComponent(gugun); // 1~25(??????)
    queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json'); //??????
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('13'); //??????
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); //??????
    var obj

    request({
        url: url + queryParams,
        method: 'GET'
    }, function (error, response, body) {
    //console.log('Status', response.statusCode);
    //console.log('Headers', JSON.stringify(response.headers));
    //console.log('Reponse received', body);
        var obj = JSON.parse(body);
        var name = 'acc_cl_nm'
        var num = 'acc_cnt'
        var accident = {
            locate : obj.items.item[0]["sido_sgg_nm"], // ?????????
            total_num_acc : obj.items.item[0][num], // ?????? ?????? ??????
            child_name_acc : obj.items.item[1][name], // ????????? ??????(????????? ??? ??????, ????????? ?????? ??????)
            child_num_acc : Number(obj.items.item[1][num])+Number(obj.items.item[5][num])+Number(obj.items.item[6][num]), // ????????? ?????? ??????
            old_name_acc : obj.items.item[2][name], // ????????? ??????(????????? ????????????, ?????? ??????)
            old_num_acc : Number(obj.items.item[2][num])+Number(obj.items.item[7][num])+Number(obj.items.item[8][num]), // ????????? ?????? ??????
            night_name_acc : obj.items.item[5][name], // ?????? ??????
            night_num_acc : obj.items.item[5][num], // ?????? ?????? ??????
            bic_name_acc : obj.items.item[4][name], // ????????? ??????
            bic_num_acc : obj.items.item[4][num], // ????????? ?????? ??????
            run__name_acc : obj.items.item[11][name], // ????????? ??????
            run__num_acc : obj.items.item[11][num] // ????????? ?????? ??????
        };
        for (content in accident){
            //console.log(accident[content]);
        }
    });   
}



// ?????? ????????? ?????? ?????? ?????? ?????? ????????? ?????? ??????

function bicaccident(sido, gugun){
    var url1 = 'http://taas.koroad.or.kr/data/rest/frequentzone/bicycle';
    var queryParams1 = '?' + encodeURIComponent('authKey') + '=Ih1kQ9cm2GMn%2BE1GYZhXAd7oMNYeCtbDmm9lezKkQSqYF9uajt5yPJu2YczA5UWz'; 
    queryParams1 += '&' + encodeURIComponent('searchYearCd') + '=' + encodeURIComponent('2019'); //??????
    queryParams1 += '&' + encodeURIComponent('siDo') + '=' + encodeURIComponent(sido); 
    queryParams1 += '&' + encodeURIComponent('guGun') + '=' + encodeURIComponent(gugun); 
    queryParams1 += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json');
    var obj1="";
    var manybicaccident;
    request({
        url: url1 + queryParams1,
        method: 'GET'
    }, function (error, response, body) {
    //console.log('Status', response.statusCode);
    //console.log('Headers', JSON.stringify(response.headers));
    //console.log('Reponse received', body);
        obj1 = JSON.parse(body);
        manybicaccident = {
            la_crd : obj1.items.item[0]["la_crd"], // ??????
            lo_crd : obj1.items.item[0]["lo_crd"], // ??????
        } 
          
    console.log(manybicaccident["la_crd"]);
    fs.writeFileSync("test.txt",manybicaccident["la_crd"]);
    fs.appendFileSync('test.txt','-');
    fs.appendFileSync('test.txt',manybicaccident["lo_crd"]);
    fs.appendFileSync('test.txt','\n');
    });
    //console.log(request.url);
    //console.log(manybicaccident["la_crd"],"loo");
}   



// ????????? ????????? ??????
function childaccident(sido, gugun){
    var url2 = 'http://taas.koroad.or.kr/data/rest/frequentzone/child'
    var queryParams2 = '?' + encodeURIComponent('authKey') + '=hK7SBB6Vp1tMrA%2BhohxC9vCnzuPzNrUnXGkUw0q8fkWSobiTwcElP1g1JR%2FWSNzV'; 
    queryParams2 += '&' + encodeURIComponent('searchYearCd') + '=' + encodeURIComponent('2019'); //??????
    queryParams2 += '&' + encodeURIComponent('siDo') + '=' + encodeURIComponent(sido); 
    queryParams2 += '&' + encodeURIComponent('guGun') + '=' + encodeURIComponent(gugun); 
    queryParams2 += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json');
    var obj2
    var manychildaccident;
    request({
        url: url2 + queryParams2,
        method: 'GET'
    }, function (error, response, body) {
    //console.log('Status', response.statusCode);
    //console.log('Headers', JSON.stringify(response.headers));
    //console.log('Reponse received', body);
        var obj2 = JSON.parse(body);
        var manychildaccident = {
            la_crd : obj2.items.item[0]["la_crd"], // ??????
            lo_crd : obj2.items.item[0]["lo_crd"], // ??????
            spot_name : obj2.items.item[0]["spot_nm"], // ???????????? ??????
            occrrnc_cnt : obj2.items.item[0]["occrrnc_cnt"], // ?????? ??????
        }   
    //console.log(manychildaccident)
    fs.appendFileSync("test.txt",manychildaccident["la_crd"]);
    fs.appendFileSync('test.txt','-');
    fs.appendFileSync('test.txt',manychildaccident["lo_crd"]);
    fs.appendFileSync('test.txt','\n');
    });}   
//childaccident(11,680)

// ?????? ?????? ?????? ??????
function freezingaccident(sido, gugun){
    var url3 = 'http://taas.koroad.or.kr/data/rest/frequentzone/freezing'
    var queryParams3 = '?' + encodeURIComponent('authKey') + '=B4adupIAnSIYdx8Td6T%2FFJvNmdMjKlTZA%2BP55wkHUssUsyShlbClu7ykkvUibTwt'; 
    queryParams3 += '&' + encodeURIComponent('searchYearCd') + '=' + encodeURIComponent('2019'); //??????
    queryParams3 += '&' + encodeURIComponent('sido') + '=' + encodeURIComponent(sido); 
    queryParams3 += '&' + encodeURIComponent('gugun') + '=' + encodeURIComponent(gugun); 
    queryParams3 += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json');
    var obj3
    var manyfreezingaccident;
    request({
        url: url3 + queryParams3,
        method: 'GET'
    }, function (error, response, body) {
    //console.log('Status', response.statusCode);
    //console.log('Headers', JSON.stringify(response.headers));
    console.log('Reponse received', body);
        var obj3 = JSON.parse(body);
        manyfreezingaccident = {
            la_crd : obj3.items.item[0]["la_crd"], // ??????
            lo_crd : obj3.items.item[0]["lo_crd"], // ??????
            spot_name : obj3.items.item[0]["spot_nm"], // ???????????? ??????
            occrrnc_cnt : obj3.items.item[0]["occrrnc_cnt"], // ?????? ??????
        }   
    fs.appendFileSync("test.txt",manyfreezingaccident["la_crd"]);
    fs.appendFileSync('test.txt','-');
    fs.appendFileSync('test.txt',manyfreezingaccident["lo_crd"]);  
    fs.appendFileSync('test.txt','\n');  
    //console.log(manyfreezingaccident)
    });}   
    //freezingaccident(11,680)

// ?????? ?????? ?????? ????????????
function lgrVioaccident(sido, gugun){
    var url4 = 'http://taas.koroad.or.kr/data/rest/frequentzone/lgrViolt'
    var queryParams4 = '?' + encodeURIComponent('authKey') + '=s3pXxxlAKKQOzfwDBLb5w5WLVE%2FVu%2FrbyI%2FH9Kr180rvziGrcyKMY%2Fo%2FaVJWCXPw'; 
    queryParams4 += '&' + encodeURIComponent('searchYearCd') + '=' + encodeURIComponent('2019'); //??????
    queryParams4 += '&' + encodeURIComponent('sido') + '=' + encodeURIComponent(sido); 
    queryParams4 += '&' + encodeURIComponent('gugun') + '=' + encodeURIComponent(gugun); 
    queryParams4 += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json');
    var obj4
    var manylgrVioaccident;
    request({
        url: url4 + queryParams4,
        method: 'GET'
    }, function (error, response, body) {
        //console.log('Status', response.statusCode);
        //console.log('Headers', JSON.stringify(response.headers));
        //console.log('Reponse received', body);
        var obj4 = JSON.parse(body);
        manylgrVioaccident = {
            la_crd : obj4.items.item[0]["la_crd"], // ??????
            lo_crd : obj4.items.item[0]["lo_crd"], // ??????
            spot_name : obj4.items.item[0]["spot_nm"], // ???????????? ??????
            occrrnc_cnt : obj4.items.item[0]["occrrnc_cnt"], // ?????? ??????
        }
    fs.appendFileSync("test.txt",manylgrVioaccident["la_crd"]);
    fs.appendFileSync('test.txt','-');
    fs.appendFileSync('test.txt',manylgrVioaccident["lo_crd"]);   
    fs.appendFileSync('test.txt','\n');
    //console.log(manylgrVioaccident)
});}   
//lgrVioaccident(43,111)

// ?????? ????????? ?????? ????????? ??????
function oldaccident(sido, gugun){
    var url5 = 'http://taas.koroad.or.kr/data/rest/frequentzone/oldman';
    var queryParams5 = '?' + encodeURIComponent('authKey') + '=3UNDjXGAv%2FJ9gNVy2pnBXNKManG%2FlB1Cjafncm4xJ1r1fiHUHUskO4yDqD9mvgNP'; 
    queryParams5 += '&' + encodeURIComponent('searchYearCd') + '=' + encodeURIComponent('2019'); //??????
    queryParams5 += '&' + encodeURIComponent('siDo') + '=' + encodeURIComponent(sido); 
    queryParams5 += '&' + encodeURIComponent('guGun') + '=' + encodeURIComponent(gugun); 
    queryParams5 += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json');
    var obj1
    var manyoldaccident;
    request({
        url: url5 + queryParams5,
        method: 'GET'
    }, function (error, response, body) {
    //console.log('Status', response.statusCode);
    //console.log('Headers', JSON.stringify(response.headers));
    //console.log('Reponse received', body);
        var obj5 = JSON.parse(body);
        manyoldaccident = {
            la_crd : obj5.items.item[0]["la_crd"], // ??????
            lo_crd : obj5.items.item[0]["lo_crd"], // ??????
            spot_name : obj5.items.item[0]["spot_nm"], // ???????????? ??????
            occrrnc_cnt : obj5.items.item[0]["occrrnc_cnt"], // ?????? ??????
        }
    fs.appendFileSync("test.txt",manyoldaccident["la_crd"]);
    fs.appendFileSync('test.txt','-');
    fs.appendFileSync('test.txt',manyoldaccident["lo_crd"]);
    fs.appendFileSync('test.txt','\n');   
    //console.log(manyoldaccident)  
    });}   
//oldaccident(11,680)

// ????????? ??? ????????? ??????

function schoolaccident(sido, gugun){
    var url6 = 'http://taas.koroad.or.kr/data/rest/frequentzone/schoolzone/child';
    var queryParams6 = '?' + encodeURIComponent('authKey') + '=rr%2FbGkoUqYZAQVikyNAq7XEZ%2Frnn9%2FM5fs8SlG4WeAg%2B6EQw4ElCTy2ysVLuBb%2Ff'; 
    queryParams6 += '&' + encodeURIComponent('searchYearCd') + '=' + encodeURIComponent('2019'); //??????
    queryParams6 += '&' + encodeURIComponent('siDo') + '=' + encodeURIComponent(sido); 
    queryParams6 += '&' + encodeURIComponent('guGun') + '=' + encodeURIComponent(gugun); 
    queryParams6 += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json');
    var obj1
    var manyschoolaccident;
    request({
        url: url6 + queryParams6,
        method: 'GET'
    }, function (error, response, body) {
    //console.log('Status', response.statusCode);
    //console.log('Headers', JSON.stringify(response.headers));
    //console.log('Reponse received', body);
        var obj6 = JSON.parse(body);
        var manyschoolaccident = {
            la_crd : obj6.items.item[0]["la_crd"], // ??????
            lo_crd : obj6.items.item[0]["lo_crd"], // ??????
            spot_name : obj6.items.item[0]["spot_nm"], // ???????????? ??????
            occrrnc_cnt : obj6.items.item[0]["occrrnc_cnt"], // ?????? ??????
        }
        
        fs.appendFileSync("test.txt",manyschoolaccident["la_crd"]);
        fs.appendFileSync('test.txt','-');
        fs.appendFileSync('test.txt',manyschoolaccident["lo_crd"]);
        fs.appendFileSync('test.txt','\n'); 
        console.log(manyschoolaccident)  
    });}   
//schoolaccident(11,500)

// ??????????????? ?????? ??????
function motoraccident(sido, gugun){
    var url7 = 'http://taas.koroad.or.kr/data/rest/frequentzone/motorcycle';
    var queryParams7 = '?' + encodeURIComponent('authKey') + '=UysMeUKbhH9DH8QP6924vnaXrHrS%2Fq4OHOKT664KLMPkGIMjUmuwYgreQBOgMOib'; 
    queryParams7 += '&' + encodeURIComponent('searchYearCd') + '=' + encodeURIComponent('2019'); //??????
    queryParams7 += '&' + encodeURIComponent('siDo') + '=' + encodeURIComponent(sido); 
    queryParams7 += '&' + encodeURIComponent('guGun') + '=' + encodeURIComponent(gugun); 
    queryParams7 += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json');
    var obj7
    var manymotoraccident;
    request({
        url: url7 + queryParams7,
        method: 'GET'
    }, function (error, response, body) {
    //console.log('Status', response.statusCode);
    //console.log('Headers', JSON.stringify(response.headers));
    //console.log('Reponse received', body);
        var obj7 = JSON.parse(body);
        manymotoraccident = {
            la_crd : obj7.items.item[0]["la_crd"], // ??????
            lo_crd : obj7.items.item[0]["lo_crd"], // ??????
            spot_name : obj7.items.item[0]["spot_nm"], // ???????????? ??????
            occrrnc_cnt : obj7.items.item[0]["occrrnc_cnt"], // ?????? ??????
        }
    fs.appendFileSync("test.txt",manymotoraccident["la_crd"]);
    fs.appendFileSync('test.txt','-');
    fs.appendFileSync('test.txt',manymotoraccident["lo_crd"]);
    fs.appendFileSync('test.txt','\n');   
    //console.log(manymotoraccident)  
    });}   
//motoraccident(11,500)

//?????? ?????? ??????
function jaywalkingaccident(sido, gugun){
    var url8 = 'http://taas.koroad.or.kr/data/rest/frequentzone/pdestrians/jaywalking';
    var queryParams8 = '?' + encodeURIComponent('authKey') + '=mY2ZB%2Bf94AVemHTeV5SNbwJzOno2C67OL9AT9vZ0rZnyNHC%2F3rW1ywRg%2B9VHjkKz'; 
    queryParams8 += '&' + encodeURIComponent('searchYearCd') + '=' + encodeURIComponent('2018'); //??????
    queryParams8 += '&' + encodeURIComponent('siDo') + '=' + encodeURIComponent(sido); 
    queryParams8 += '&' + encodeURIComponent('guGun') + '=' + encodeURIComponent(gugun); 
    queryParams8 += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json');
    var obj8
    var manyjayaccident;
    request({
        url: url8 + queryParams8,
        method: 'GET'
    }, function (error, response, body) {
    //console.log('Status', response.statusCode);
    //console.log('Headers', JSON.stringify(response.headers));
    //console.log('Reponse received', body);
        var obj8 = JSON.parse(body);
        manyjayaccident = {
            la_crd : obj8.items.item[0]["la_crd"], // ??????
            lo_crd : obj8.items.item[0]["lo_crd"], // ??????
            spot_name : obj8.items.item[0]["spot_nm"], // ???????????? ??????
            occrrnc_cnt : obj8.items.item[0]["occrrnc_cnt"], // ?????? ??????
        }   
    fs.appendFileSync("test.txt",manyjayaccident["la_crd"]);
    fs.appendFileSync('test.txt','-');
    fs.appendFileSync('test.txt',manyjayaccident["lo_crd"]);
    fs.appendFileSync('test.txt','\n');    
    //console.log(manyjayaccident)  
    });}   
//jaywalkingaccident(11,500)

// ?????? ?????? ?????? ?????? ??????

function tmzoneaccident(sido, gugun){
    var url9 = 'http://taas.koroad.or.kr/data/rest/frequentzone/tmzon';
    var queryParams9 = '?' + encodeURIComponent('authKey') + '=VpUAXqb%2B2crGCV5rrlsNzJnrPsgRg1yFT7yru5xC6voM24dThEn6ow%2BQy3ROpTSC'; 
    queryParams9 += '&' + encodeURIComponent('searchYearCd') + '=' + encodeURIComponent('2019'); //??????
    queryParams9 += '&' + encodeURIComponent('siDo') + '=' + encodeURIComponent(sido); 
    queryParams9 += '&' + encodeURIComponent('guGun') + '=' + encodeURIComponent(gugun); 
    queryParams9 += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json');
    var obj9
    var manytmzoneaccident;
    request({
        url: url9 + queryParams9,
        method: 'GET'
    }, function (error, response, body) {
    //console.log('Status', response.statusCode);
    //console.log('Headers', JSON.stringify(response.headers));
    //console.log('Reponse received', body);
        var obj9 = JSON.parse(body);
        manytmzoneaccident = {
            la_crd : obj9.items.item[0]["la_crd"], // ??????
            lo_crd : obj9.items.item[0]["lo_crd"], // ??????
            spot_name : obj9.items.item[0]["spot_nm"], // ???????????? ??????
            occrrnc_cnt : obj9.items.item[0]["occrrnc_cnt"], // ?????? ??????
        }
        console.log(manytmzoneaccident.occrrnc_cnt);
    fs.appendFileSync("test.txt",manytmzoneaccident["la_crd"]);
    fs.appendFileSync('test.txt','-');
    fs.appendFileSync('test.txt',manytmzoneaccident["lo_crd"]);
    fs.appendFileSync('test.txt','\n');   
    console.log(manytmzoneaccident)  
    });}   
//tmzoneaccident(50,110)
process.on('uncaughtException',function(err){
    console.error(err);
})
//test
/*
var url = 'http://taas.koroad.or.kr/data/rest/frequentzone/pdestrians/jaywalking?authKey=su7cOd9Z8gTA4GthqTi4FZw7rJ9zc8Ov%2BRjpRMsuS3j%2FfG5Dbft9sKNp5v1HHw%2FB&searchYearCd=2018&sido=11&gugun=440';
request(url, function(error, response, html){
    if (error) {throw error};
    console.log (html);
});
*/
/*
???????????????
request(url, function(error, response, html){
    if (error) {throw error};
    console.log (html);
});
*/
