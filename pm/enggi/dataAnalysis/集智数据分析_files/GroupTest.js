
var drawChartGroupTest = function (data) {
    Highcharts.setOptions({
        colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354',
    '#2b908f', '#f45b5b', '#91e8e1'],
        lang: {
            printChart: "打印图表",
            downloadJPEG: "下载JPEG 图片",
            downloadPDF: "下载PDF文档",
            downloadPNG: "下载PNG 图片",
            downloadSVG: "下载SVG 矢量图",
            exportButtonTitle: "导出图片"
        }
    });
    //Highcharts.setOptions({
    //    //colors: ['#7cb5ec', '#434348', '#90ed7d', '#6AF9C4', '#FFF263']
    //    colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
    //    lang: {
    //        printChart: "打印图表",
    //        downloadJPEG: "下载JPEG 图片",
    //        downloadPDF: "下载PDF文档",
    //        downloadPNG: "下载PNG 图片",
    //        downloadSVG: "下载SVG 矢量图",
    //        exportButtonTitle: "导出图片"
    //    }
    //});

    if (data.cat.length > 0) {
        $('#containerGroupTest').highcharts({
            title: {
                text: data.year + '年年度服务顾问项目产值对比_组图'
            },
            xAxis: {
                categories: data.cat
            },
            yAxis: [
                { // Primary yAxis
                    labels: {
                        format: '{value} 元',
                        style: {
                            //color: Highcharts.getOptions().colors[1]
                            color: '#434348'
                        }
                    },
                    title: {
                        text: '产值',
                        style: {
                            //color: Highcharts.getOptions().colors[1]
                            color: '#434348'
                        }
                    },
                    labels: {
                        //format: '{value} 元',
                        formatter: function () {
                            if (this.value > 10000) {
                                return (this.value / 10000) + ' 万元'
                            }
                            else {
                                return this.value + ' 元'
                            }
                        },
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                },
            ],
            credits: {
                enabled: false  // 去掉右下角的highcharts链接
            },
            labels: {
                items: [{
                    html: '产值结构',
                    style: {
                        left: '160px',
                        top: '18px',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                    }
                }]
            },
            plotOptions: {
                //series: {
                //    borderWidth: 0,
                //    dataLabels: {
                //        enabled: true,


                //    },
                //},
                column: {
                    //stacking: 'percent',
                    //pointPadding: 0, //数据点之间的距离值
                    //groupPadding: 0, //分组之间的距离值
                    //borderWidth: 0,
                    //shadow: false,
                    pointWidth: 10 //柱子之间的距离值
                },

            },
            tooltip: {
                shared: true
            },

            series: data.data



            //chart: {
            //    type: 'column'
            //},
            //title: {
            //    text: data.year + '年年度服务顾问项目产值对比_组图'
            //},
            //subtitle: {
            //    text: ''
            //},
            //xAxis: [{
            //    categories: data.cat
            //    ,
            //    crosshair: true
            //}],
            //yAxis: [{ // Primary yAxis
            //    labels: {
            //        format: '{value} 元',
            //        style: {
            //            color: Highcharts.getOptions().colors[1]
            //        }
            //    },
            //    title: {
            //        text: '维修技师产值',
            //        style: {
            //            color: Highcharts.getOptions().colors[1]
            //        }
            //    }
            //}, ],
            //credits: {
            //    enabled: false  // 去掉右下角的highcharts链接
            //},
            //tooltip: {
            //    shared: true
            //},
            //legend: {
            //    itemStyle: {
            //        fontWeight: 'normal'
            //    }
            //},
            //series: data.data
        });
    }
    else {
        $('#containerGroupTest').highcharts({
            title: {
                text: data.year + '年年度服务顾问项目产值对比_组图'
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

}