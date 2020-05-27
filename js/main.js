function getRandomColor() { // https://stackoverflow.com/a/1484514/10199319
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

function updateStats() {
  const chartDiv = document.querySelector("#chart");
  chartDiv.innerHTML = "";
  const city = document.getElementById("city").value;
  const today = moment().subtract(0, "days").format("YYYY.MM.DD");
  $.get(
    `https://raw.githubusercontent.com/filiptronicek/czech-weather/master/data/${city}/${today}.csv`,
    function (data) {
      const lddPoints = getDataPointsFromCSV(data);
      let xs = [];
      let ys = [];
      for (let i of lddPoints) {
        xs.push(i.x);
        ys.push(i.y);
      }
      console.table(xs);
      const options = {
        series: [
          {
            name: "°C",
            data: ys,
          },
        ],
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: true,
          },
        },
        colors: [getRandomColor()],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        title: {
          align: "center",
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

      var chart = new ApexCharts(chartDiv, options);
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
      if (i % 2 === 1 && parseFloat(points[0]) + offset < 25) {
        dataPoints.push({
          x: parseFloat(points[0]) + offset,
          y: parseFloat(points[3]),
        });
      } else if (i % 2 === 0 && parseFloat(points[0]) + offset < 25) {
        dataPoints.push({
          x: parseFloat(points[0]) + offset + ":30",
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
