function updateStats() {
  const today = moment().subtract(0, "days").format("YYYY.MM.DD");
  $.get(
    `https://raw.githubusercontent.com/filiptronicek/czech-weather/master/data/praha/${today}.csv`,
    function (data) {
      const lddPoints = getDataPointsFromCSV(data);
      let xs = [];
      let ys = [];
      for (let i of lddPoints) {
        xs.push(i.x);
        ys.push(i.y);
      }
      const options = {
        series: [
          {
            name: "Degrees",
            data: ys,
          },
        ],
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        title: {
          text: "Today's weather",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: xs,
        },
      };

      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
    }
  );
}

function getDataPointsFromCSV(csv) {
  const dataPoints = (csvLines = points = []);
  csvLines = csv.split(/[\r?\n|\r|\n]+/);
  const tz = moment.tz("Europe/Prague");
  const offset = (tz.utcOffset() - (tz.utcOffset() % 60)) / 60;
  for (let i = 0; i < csvLines.length; i++)
    if (csvLines[i].length > 0) {
      points = csvLines[i].split(",");
      if (i % 2 === 0 && parseFloat(points[0]) + offset < 25) {
        dataPoints.push({
          x: parseFloat(points[0]) + offset,
          y: parseFloat(points[3]),
        });
      }
    }
  return dataPoints;
}

updateStats();
setInterval(() => {
  updateStats();
}, 600000);
