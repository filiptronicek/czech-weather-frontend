const today = moment().format('YYYY.MM.DD');

window.onload = function() {
 
    function getDataPointsFromCSV(csv) {
        const dataPoints = csvLines = points = [];
        csvLines = csv.split(/[\r?\n|\r|\n]+/); 
        const tz = moment.tz('Europe/Prague');        
        const offset = (tz.utcOffset() - (tz.utcOffset() % 60)) / 60;
        for (let i = 0; i < csvLines.length; i++)
            if (csvLines[i].length > 0) {
                points = csvLines[i].split(",");
                if(i % 2 === 0) {
                dataPoints.push({ 
                    x: parseFloat(points[0])+offset, 
                    y: parseFloat(points[3]) 		
                });
                }
            }
        return dataPoints;
    }

$.get(`https://raw.githubusercontent.com/filiptronicek/czech-weather/master/data/praha/${today}.csv`, function(data) {
    const chart = new CanvasJS.Chart("chartContainer", {
        title: {
             text: "Dnešní graf",
        },
        data: [{
             type: "line",
             dataPoints: getDataPointsFromCSV(data)
          }]
     });
    
      chart.render();

});
};