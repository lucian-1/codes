var drawChartAllPrice = function (data) {
    $(function () {
        Highcharts.setOptions({
            colors: ['#7cb5ec', '#6C9FCF', '#434348', '#90ed7d', '#6AF9C4', '#FFF263'],
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
    if (data.x.length == 0)
    {

        $('#containerAllPrice').highcharts({
            title: {
                text: data.year + '年' + data.month + '月' + '售后产值以及服务次数统计'
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
        });
    }
    


   else if (data.x.length > 0)
    {
        $('#containerAllPrice').highcharts({
            chart: {
                zoomType: null
            },
            title: {
                text: data.year + '年' + data.month + '月' + '售后产值以及服务次数统计'
            },
            subtitle: {
                text: ''
            },
            xAxis: [{
                categories: data.x,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value} 元',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                labels: {
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
                title: {
                    text: '产值',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                        //color: '#606060'
                    }
                },
            }, { // Secondary yAxis
                title: {
                    text: '服务次数',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    formatter: function () {
                        if (this.value > 10000) {
                            return (this.value / 10000) + ' 万次'
                        }
                        else {
                            return this.value + ' 次'
                        }
                    },
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],
            credits: {
                enabled: false  // 去掉右下角的highcharts链接
            },
            tooltip: {
                shared: true
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        formatter: function () {

                            //return Highcharts.numberFormat(this.y / 10000, 0) + '万';


                            if (this.y / 10000 >= 1 && data.x.length <= 12) {
                                return Highcharts.numberFormat(this.y / 10000, 0) + "万";
                            }
                            else if (this.y / 10000 < 1 && data.x.length <= 12) {
                                return this.y;
                            }
                        },
                    }
                }
            },
            //legend: {
            //    layout: 'vertical',
            //    align: 'left',
            //    x: 10,
            //    verticalAlign: 'top',
            //    y: -10,
            //    floating: true,
            //    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
            //    itemStyle: {
            //        fontWeight: 'normal'
            //    }
            //},
            legend: {
                itemStyle: {
                    fontWeight: 'normal'
                }
            },
            series: data.series
        });
    }
 

   
}