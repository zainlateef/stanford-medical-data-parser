let fs = require('fs');
let writer = fs.createWriteStream('output.csv');
let textToConvert = fs.readFileSync('C:\\Users\\lateefz\\Desktop\\data\\data1_age_sex_race.csv', 'utf8');
let linesOfText = textToConvert.split('\n');
linesOfText.shift(); // remove header
processUsers(linesOfText);
console.log("Done");

function processUsers(linesOfText){
    writer.write("Id,Sex,Age,Race\n");
    linesOfText.forEach(line => {
        line = line.replace(/"/g,"");
        line = line.trim();
        let values = line.split(',');
        let id = values[0];
        let sex_age_race = values[1];
        let sex = '';
        if(sex_age_race.includes("FEMALE")){
            sex = "Female"
            sex_age_race = sex_age_race.replace("FEMALE","");
        } else if(sex_age_race.includes("MALE")){
            sex = "Male"
            sex_age_race = sex_age_race.replace("MALE","");
        } else {
            throw Error("Could not find sex")
        }
        let age_race = sex_age_race.split("_");
        let age = parseFloat(age_race[0]);
        let race = age_race[1];
        if(race === "NA")
            race = "\\N";
        writer.write(generateCSV(id,sex,age,race));
    })
}

function generateCSV(...args){
    let result = ""
    args.forEach( arg => {
        result += arg + ","
    })
    return result.slice(0,-1) + '\n';
}