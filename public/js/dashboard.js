$(document).ready(function () {
    $.ajax({
        url: "/order/getSoldGameStatistic",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (data) {
            createGraph(data);
        }
    }).always(function() {
        $("#loading-panel").fadeOut("fast");
    });

    function createGraph(data) {
        var graphData = [{
            x: data.x,
            y: data.y,
            type: 'bar'
        }];
        Plotly.newPlot('sold_graph', graphData);
    }
});
