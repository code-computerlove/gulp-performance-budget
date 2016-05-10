(function(window, undefined){

  var json = {
    "fileTypes": {
      "images": {
        "total": 1002,
        "files": [
          {
            "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/totalFileSize/imgres-1.png",
            "size": 1002
          }
        ],
        "percentage": 79
      },
      "css": {
        "total": 57,
        "files": [
          {
            "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/totalFileSize/info.css",
            "size": 57
          }
        ],
        "percentage": 5
      },
      "js": {
        "total": 207,
        "files": [
          {
            "file": "/Users/matthewmacartney/Development/Code/performance-budget/_src/totalFileSize/test.js",
            "size": 207
          }
        ],
        "percentage": 16
      }
    },
    "budget": 3000,
    "totalSize": 1266,
    "remainingBudget": 1734
  }

  var dataArr = [];
  var labelArr = [];

  function init () {
    populateChartDataArray();
    populateChartLabelArray();
    createChartInDom();
  }

  function populateChartDataArray () {
    for(var item in json.fileTypes) {
      var percentage = json.fileTypes[item].percentage;
      dataArr.push(percentage);
    }
  }

  function populateChartLabelArray () {
    labelArr = Object.keys(json.fileTypes);
    for(var index = 0; index < labelArr.length; index++) {
      labelArr[index] += ' - ' + dataArr[index] + '%';
    }
  }

  function createChartInDom () {
    var data = {
        labels: labelArr,
        datasets: [{
            label: 'Performance Budget',
            data: dataArr,
            borderColor: '#EAE7E2',
            labelColor: '#FFF',
            backgroundColor: ['#302E2F', '#648D93', '#A9564E']
        }]
    };

    var options = {
      tooltipTemplate: "<%= value %>%"
    };

    var chartOneSelector = document.querySelectorAll('[data-chart-pie]')[0];
    var chartOne = new Chart(chartOneSelector, {type: 'doughnut', data: data, options: options});

    // var chartTwoSelector = document.querySelectorAll('[data-chart-line]')[0];
    // var chartTwo = new Chart(chartTwoSelector, {type: 'bar', data: data, options: options});
  }

  init();

})(window);
