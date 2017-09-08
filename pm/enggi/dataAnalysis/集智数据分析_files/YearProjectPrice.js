var drawChartYearProjectPrice = (function (data) {

    Highcharts.setOptions({
        //colors: ['#7cb5ec', '#434348', '#90ed7d', '#6AF9C4', '#FFF263']
        colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
        lang: {
            printChart: "打印图表",
            downloadJPEG: "下载JPEG 图片",
            downloadPDF: "下载PDF文档",
            downloadPNG: "下载PNG 图片",
            downloadSVG: "下载SVG 矢量图",
            exportButtonTitle: "导出图片"
        }
    });



    if (data.series.length == 0)
    {


        $('#containerYearProjectPrice').highcharts({
            title: {
                text: data.year + '年' + '年度项目产值结构对比'
            },
            subtitle: {
                text: '<span style="color:red";>无数据显示！</span>'
            },
            credits: {
                enabled: false  // 去掉右下角的highcharts链接
            },
            series: [{
                type: 'line',
                name: 'no data',
                data: []
            }],
            lang: {
                // Custom language option            
                //noData: "Nichts zu anzeigen"    
            },
            /* Custom options */
            noData: {
                // Custom positioning/aligning options
                position: {
                    //align: 'right',
                    //verticalAlign: 'bottom'
                },
                // Custom svg attributes
                attr: {
                    //'stroke-width': 1,
                    //stroke: '#cccccc'
                },
                // Custom css
                style: {
                    //fontWeight: 'bold',     
                    //fontSize: '15px',
                    //color: '#202030'        
                }
            }
        });
    }

    if (data.series.length > 0)
    {
        $('#containerYearProjectPrice').highcharts({
            chart: {
                type: 'area'
            },
            title: {
                text: data.year + '年' + '年度项目产值结构对比'
                //text: data.year+'年度项目产值结构占比'
            },
            //subtitle: {
            //    text: 'Source: Wikipedia.org'
            //},
            xAxis: {
                //categories: ['1', '2', '3', '4,', '5', '6', '7', '8', '9', '10', '11', '12'],
                categories: data.cat,
                tickmarkPlacement: 'on',
                title: {
                    enabled: false
                }
            },
            yAxis: [
                { // Primary yAxis
                    labels: {
                        format: '{value} %',
                        style: {
                            //color: Highcharts.getOptions().colors[1]
                            color: '#434348'
                        }
                    },
                    title: {
                        text: '百分比',
                        style: {
                            //color: Highcharts.getOptions().colors[1]
                            color: '#434348'
                        }
                    }
                },
            ],
            tooltip: {
                //pointFormat: '<span style="color:{series.color};font-weight:bold">{series.name}</span>:　<b>{point.y:,.0f}</b>({point.percentage:.1f}% )<br/>',
                pointFormatter: function () {
                    return '<span style="font-weight:normal;color:' + this.series.color + ';font-wight:bold">' + this.series.name + '：　</span><b>' + (this.y / 10000).toFixed(2) + ' 万　</b>(' + (this.percentage * 100 / 100).toFixed(2) + '%)<br/>';
                },
                shared: true
            },
            legend: {
                itemStyle: {
                    fontWeight: 'normal',
                    fontSize: 15,
                    fontFamily: '微软雅黑',
                },
                //margin:200,
                symbolWidth: 10,
                y: 0
            },
            credits: {
                enabled: false  // 去掉右下角的highcharts链接
            },
            plotOptions: {
                area: {
                    stacking: 'percent',
                    lineColor: '#ffffff',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#ffffff'
                    }
                }
            },
            series: data.series
        });
    }

   
       
});