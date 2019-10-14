let fs = require('fs');
const post_pre_map = new Map([['PRE', 'Preresponse'], ['POST', 'Postresponse']])
const response_map = new Map([['Very Poor', -2], ['Poor', -1], ['Good', 0], ['Satisfactory', 1], ['Excellent', 2]])
const data_folder_path = 'C:\\Users\\lateefz\\Desktop\\data'

let writer = null;
processUsers(getLines(data_folder_path + '\\data1_age_sex_race.csv', 'users.sql'));
processSRH(getLines(data_folder_path + '\\data2_SRH.csv', 'srh.sql'));
processWeight(getLines(data_folder_path + '\\data3a_weight_trt.csv', 'weight1.sql'));
processWeight(getLines(data_folder_path + '\\data3b_weight_con.csv', 'weight2.sql'));
writer.close();

console.log("Done");

function processWeight(linesOfText){
    linesOfText.forEach((line) => {
        line=line.trim();
        let values = getValues(line);
        let id = values[0];
        let pre_weight = values[1];
        let post_weight = values[2];
        let weight = pre_weight ? pre_weight : post_weight;
        let statement = `UPDATE Patients SET ${pre_weight ? 'Preweight' : 'Postweight'}=${weight} WHERE Id=${id};\n`;
        writer.write(statement);
    });
}

function processSRH(linesOfText){
    linesOfText.forEach((line) => {
        let values = getValues(line);
        let id = values[0];
        let trt = values[1];
        let post_pre_column_name = post_pre_map.get(values[2]);
        let response = response_map.get(values[3]);
        let statement = `UPDATE Patients SET Treatment=${trt}, ${post_pre_column_name} = ${response} WHERE Id=${id};\n`;
        writer.write(statement);
    })
}

function processUsers(linesOfText){
    linesOfText.forEach(line => {
        let values = getValues(line);
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
            race = "NULL";

        let statement = `INSERT INTO Patients (Id, Sex, Age, Race) VALUES (${id}, ${sex}, ${age}, ${race});\n`
        writer.write(statement);
    })
}

function getLines(inputFilePath, outputFileName) {
    writer = fs.createWriteStream(outputFileName);
    let textToConvert = fs.readFileSync(inputFilePath, 'utf8');
    let linesOfText = textToConvert.split('\n');
    linesOfText.shift();
    linesOfText.pop();
    return linesOfText;
}

function getValues(lineOfCSV) {
    lineOfCSV = lineOfCSV.replace(/"/g, "");
    lineOfCSV = lineOfCSV.trim();
    let values = lineOfCSV.split(',');
    return values
}

