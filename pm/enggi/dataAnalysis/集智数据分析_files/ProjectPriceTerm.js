//2015汇总#333333

var drawChartProjectPriceTerm = function (data) {

    $(function () {
        Highcharts.setOptions({
            colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],  //highcharts默认颜色
            lang: {
                printChart: "打印图表",
                downloadJPEG: "下载JPEG 图片",
                downloadPDF: "下载PDF文档",
                downloadPNG: "下载PNG 图片",
                downloadSVG: "下载SVG 矢量图",
                exportButtonTitle: "导出图片"
            }


        });

    })

    //事故，保养，机电，索赔，新车装潢，事故车

    if (data.data.length == 0) {
        $('#containerProjectPriceTerm').highcharts({
            title: {
                text:data.year + '年' + data.month + '月' + '项目产值结构分析_饼图'
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


    else {
        $('#containerProjectPriceTerm').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: data.year + '年' + data.month + '月' + '项目产值结构分析_饼图'
            },
            tooltip: {
                formatter: function () {
                    return '<b>__name__</b><br/>价格: <b>__price__ 元</b><br/>比重: <b>__percentage__%</b>'
                        .replace('__name__', this.key)
                        .replace('__price__', this.y.toFixed(2))
                        .replace('__percentage__', this.percentage.toFixed(2));
                }
            },
            legend: {
                itemStyle: {
                    fontWeight: 'normal'
                }
            },
            credits: {
                enabled: false  // 去掉右下角的highcharts链接
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        //format: '<b>{point.name}</b>: {point.percentage:.1f} %<br>{point.y:.1f}',
                        //format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        formatter: function () {
                            //return '<span style="font-weight:bold;color:' + this.color + '">' + this.key + '：</span>' + this.percentage.toFixed(2) + '%，' + (this.y / 10000).toFixed(1) + '万元';    //颜色+粗

                            return '<b>' + this.key + '：</b><span style="font-weight:normal">' + this.percentage.toFixed(2) + '%，' + (this.y / 10000).toFixed(1) + '万元</span>';//前粗

                        },
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    },
                    showInLegend: true
                }
            },
            series: [{
                //name: "比重",
                //colorByPoint: true,
                data: data.data
            }]
        });
    }
    
};