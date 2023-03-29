const express = require('express');
const https = require('https');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

var input_text = '';
var output_text= '';
var language='';
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));

// const translator_api = 'curl -X POST --user "apikey:grm-_DJa_bq4FF-ZnXTj32xyaHZv2HjGO9NT8cbXFouG" --header "Content-Type: application/json" --data '{"text": ["Hello, world.", "How are you?"], "model_id":"en-hi"}' "https://api.eu-gb.language-translator.watson.cloud.ibm.com/instances/b35e1541-e6cb-4a1b-a605-f868924923e8/v3/translate?version=2018-05-01"'

const api_key = "grm-_DJa_bq4FF-ZnXTj32xyaHZv2HjGO9NT8cbXFouG";
const api_url = "https://api.eu-gb.language-translator.watson.cloud.ibm.com/instances/b35e1541-e6cb-4a1b-a605-f868924923e8";

app.get('/', function(req,res){
    res.render('home',{hi_txt: output_text});
    output_text= '';
});

app.post('/', function(req,res){
  var buff='';
   input_text = req.body.en_txt;
   language=req.body.languages;
   console.log(language);

   const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01',
    authenticator: new IamAuthenticator({
      apikey: api_key,
    }),
    serviceUrl: api_url,
  });
  
  const translateParams = {
    text: input_text,
    modelId: 'en-'+language,
  };
  
  languageTranslator.translate(translateParams)
    .then(translationResult => {
      // console.log(JSON.stringify(translationResult, null, 1));
     buff = JSON.stringify(translationResult.result.translations[0].translation);
     

     output_text = buff;
     output_text=(output_text.replace(/['"]+/g, ''));
     console.log(output_text);
     res.redirect('/');
    })
    .catch(err => {
      console.log('error:', err);
    });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
  console.log("Server ativated at port successfully");
});