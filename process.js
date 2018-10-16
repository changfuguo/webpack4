var fs = require('fs');
var result = require('./result');
var rows = result.rows;
var newRows = [];

rows.map(function(item) {
    var internetAnnual = item.internetAnnual;
    newRows.push({
        id: item.id,
        name: item.name,
        score: item.score,
        unit: item.unit,
        idCard: item.idCard,
        birthday: item.idCard.substr(6,8)
    })
})

fs.writeFileSync('simple_json.json', JSON.stringify({data: newRows}))
