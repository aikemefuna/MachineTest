$(function () {
    tSmart.GridController = function () {
        var dataGrid,
            selectBoxYear, selectBoxMode, selectBoxMinistry, domainName, baseUrl, selectedYearValue, selectedYearText, selectedModeValue, selectedModeText, selectedMinistryValue, selectedMinistryText, merchantCode, merchantId, yearListDataLoader, modeListDataLoader, ministryListDataLoader; 

        var that = this;
        domainName = document.querySelector("#domainNameId").value;
        console.log(domainName);
        baseUrl = domainName;
        merchantCode = document.querySelector("#merchantCode").value;
        merchantId = document.querySelector("#merchantId").value;

        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2
        })

        const formatterWithNaira = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        })

        modeListDataLoader = [{
            "ModeId": 1,
            "Mode": "MDA",
        },
        {
            "ModeId": 2,
            "Mode": "Global",
        }
        ];

        yearListDataLoader = DevExpress.data.AspNet.createStore({
            key: "taxYearId",
            loadUrl: baseUrl + "/api/v1.0/PayerLedger/getPayerLedgerYearsByMerchantCode/" + merchantCode
        });

        ministryListDataLoader = DevExpress.data.AspNet.createStore({
            key: "agencyCode",
            loadUrl: baseUrl + "/api/v1.0/PayerLedger/getPayerLedgerMinistryByMerchantCode/" + merchantCode,
            onBeforeSend: function (operation,
                ajaxSettings) {
                ajaxSettings.beforeSend = function (xhr) {
                    xhr.setRequestHeader('taxYear', JSON.stringify(selectedYearValue));
                };
                ajaxSettings.global = false;
            }
        });


        //yearListDataLoader = [{
        //    "TaxYearId": 2018,
        //    "TaxYear": "2018",
        //},
        //{
        //    "TaxYearId": 2019,
        //    "TaxYear": "2019",
        //}
        //];


        this.initPage = function () {
            DevExpress.ui.setTemplateEngine("underscore");

            selectBoxYear = $("#taxYearSelectBox").dxSelectBox({
                dataSource: yearListDataLoader,
                valueExpr: "taxYearId",
                displayExpr: "taxYear",
                searchEnabled: true,
                hoverStateEnabled: true,
                searchExpr: ["taxYear", "taxYearId"],
                placeholder: "Click to Select Year",
                showClearButton: true,
                onValueChanged: function (e) {
                    var value = e.component.option("value");
                    var text = e.component.option("text");
                    selectedYearValue = value;
                    selectedYearText = text;
                    if (selectedYearValue !== null) {
                        $('#modeId').removeAttr('disabled');
                        $("#modeSelectBox").prop("disabled", false);
                        $("#modeSelectBox").dxSelectBox('instance').option('value', null);
                        $("#ministrySelectBox").dxSelectBox('instance').option('value', null);
                        $('#ministryId').hide();
                    }
                    if (selectedYearValue === null) {
                        $("#modeSelectBox").dxSelectBox('instance').option('value', null);
                        $("#ministrySelectBox").dxSelectBox('instance').option('value', null);
                        $('#modeId').attr('disabled', 'disabled');
                        $("#modeSelectBox").prop("disabled", true);
                    }

                    $('#divDetails').hide();

                    //dataGrid = $("#divDetails").dxDataGrid("instance").option('value', null);

                    //let element = document.getElementById("#divDetails");
                    //let instance = DevExpress.ui.dxDataGrid.getInstance(element);
                    //console.log(instance);
                }
            }).dxSelectBox("instance");

            selectBoxMode = $("#modeSelectBox").dxSelectBox({
                dataSource: modeListDataLoader,
                valueExpr: "ModeId",
                displayExpr: "Mode",
                searchEnabled: true,
                hoverStateEnabled: true,
                searchExpr: ["Mode", "ModeId"],
                placeholder: "Click to Select Mode",
                showClearButton: true,
                onValueChanged: function (e) {
                    var value = e.component.option("value");
                    var text = e.component.option("text");
                    selectedModeValue = value;
                    console.log(selectedModeValue);
                    selectedModeText = text;
                    if (selectedModeValue === 1) {
                        $('#ministryId').show();
                        $('#divDetails').hide();
                    }
                    if (selectedModeValue === 2) {
                        $('#ministryId').hide();
                        $("#ministrySelectBox").dxSelectBox('instance').option('value', null);
                        that.showPayerTransactionDetailsByGlobalMode();
                    }
                    if (selectedModeValue === null) {
                        $('#ministryId').hide();
                        $("#ministrySelectBox").dxSelectBox('instance').option('value', null);
                        $('#divDetails').hide();
                    }
                }
            }).dxSelectBox("instance");

            selectBoxMinistry = $("#ministrySelectBox").dxSelectBox({
                dataSource: ministryListDataLoader,
                valueExpr: "agencyCode",
                displayExpr: "agencyName",
                searchEnabled: true,
                hoverStateEnabled: true,
                searchExpr: ["agencyName", "agencyCode"],
                placeholder: "Click to Select Ministry",
                showClearButton: true,
                onValueChanged: function (e) {
                    var value = e.component.option("value");
                    var text = e.component.option("text");
                    selectedMinistryValue = value;
                    selectedMinistryText = text;
                    if (selectedMinistryValue !== null) {
                        that.showPayerTransactionDetails(selectedMinistryValue);
                        $('#divDetails').show();
                    }
                    
                }
            }).dxSelectBox("instance");

            $('#ministryId').hide();
            $('#modeId').attr('disabled', 'disabled');
            $("#modeSelectBox").prop("disabled", true);

            $('#divDetails').hide();
        };

        this.showPayerTransactionDetails = function (agencyCode) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();
            
            $('#divDetails').show();
            $('#platformNameSelected').text("Details of Payer Ledger By Agency View");
            $.ajaxSetup({
                cache: false
            });

            var remoteDataLoader = DevExpress.data.AspNet.createStore({
                key: "payerId",
                loadUrl: baseUrl + "/api/v1.0/PayerLedger/getPayerLedgerSummaryGroupedByMerchantCode/" + merchantCode,
                //loadParams: { startDate: startDate, endDate: endDate },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader('agencyCode', JSON.stringify(agencyCode));
                        xhr.setRequestHeader('mode', JSON.stringify(selectedModeValue));
                        xhr.setRequestHeader('taxYear', JSON.stringify(selectedYearValue));
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: remoteDataLoader,
                    remoteOperations: {
                        paging: true,
                        filtering: true,
                        sorting: true,
                        grouping: true,
                        summary: true,
                        groupPaging: true
                    },
                    searchPanel: {
                        visible: true,
                        placeholder: "Search...",
                        width: 250
                    },
                    paging: {
                        pageSize: 20
                    },
                    pager: {
                        showNavigationButtons: true,
                        showPageSizeSelector: true,
                        allowedPageSizes: [20, 50, 100, 250],
                        showInfo: true
                    },
                    //selection: {
                    //    mode: "multiple",
                    //    //mode: "single",
                    //    selectAllMode: 'page',
                    //    showCheckBoxesMode: 'always'
                    //},

                    "export": {
                        enabled: true,
                        //fileName: "AssessmentSummaryByPlatformList",
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = 'PayerTransactionDetailsList' + '(' + now.toISOString() + ')';
                },
                stateStoring: {
                    enabled: false,
                    type: "localStorage",
                    storageKey: "storage"
                },
                onExported: function (e) {
                    DevExpress.ui.notify({
                        message: "Export Successful",
                        type: "success",
                        displayTime: 3000,
                        closeOnClick: true
                    });
                },
                    hoverStateEnabled: true,
                    showRowLines: true,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    columns: [
                        {
                            caption: 'S/N',
                            width: "auto",
                            allowSorting: false,
                            allowFiltering: false,
                            allowReordering: false,
                            allowHeaderFiltering: false,
                            allowGrouping: false,
                            cellTemplate: function (container, options) {
                                container.text(dataGrid.pageIndex() * dataGrid.pageSize() + (options.rowIndex + 1));
                            }
                        },
                        {
                            dataField: "payerName",
                            caption: "Payer Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            //width: 210,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "payerId",
                            caption: "Payer ID",
                            sortIndex: 1,
                            cssClass: 'font-bold',
                            //width: 210,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "currentYearAss",
                            caption: "Current Year Ass.",
                            dataType: "number",
                            cssClass: 'font-bold',
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "currentYearPayment",
                            caption: "Current Year Payment",
                            dataType: "number",
                            cssClass: 'font-bold',
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "balance",
                            caption: "Balance",
                            dataType: "number",
                            cssClass: 'font-bold',
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        //{
                        //    dataField: "balance",
                        //    caption: "Total",
                        //    dataType: "number",
                        //    alignment: "right",
                        //    cssClass: 'font-bold',
                        //    format: { type: 'fixedPoint', precision: 2 },
                        //    calculateCellValue: function (data) {
                        //        return [data.currentYearAss +
                        //            data.currentYearPayment + data.balance];
                        //    }
                        //},
                        {
                            caption: "Details",
                            width: 200,
                            alignment: "center",
                            wordWrapEnabled: true,
                            cellTemplate: function (container, options) {
                                $('<div />').dxButton(
                                    {
                                        icon: 'icon icon-commenting',
                                        text: 'View',
                                        type: 'danger',
                                        alignment: "center",
                                        onClick: function (args) {
                                            $('#divDetails').hide();
                                            //console.log(options.data);
                                            that.showPayerLedgerDetailsPopUp(options.data);
                                            $('#divDetails').show();
                                        }
                                    }
                                ).appendTo(container)
                            },
                            visible: true
                        }
                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "payerId",
                                summaryType: "count",
                                displayFormat: "Total count: {0}"
                            },
                            {
                                column: "balance",
                                summaryType: "sum",
                                showInColumn: "balance",
                                displayFormat: "Column: {4}.: {0}",
                                //displayFormat: "Column: {1}. Sales: {0}",
                                //valueFormat: { type: 'fixedPoint', precision: 2 },
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            }

                        ]
                    },
                    onToolbarPreparing: function (e) {
                        var internalGrid = e.component;
                        e.toolbarOptions.items.unshift(
                            {
                                location: "after",
                                widget: "dxButton",
                                showText: "inMenu",
                                options: {
                                    text: "Refresh View",
                                    hint: "Refresh View",
                                    icon: "refresh",
                                    onClick: function () {
                                        DevExpress.ui.notify({
                                            message: "Refreshing view",
                                            type: "success",
                                            displayTime: 3000,
                                            closeOnClick: true
                                        });
                                        internalGrid.refresh();
                                    }
                                },
                                locateInMenu: "auto"
                            }
                        );
                    }
                };
            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");

            //$('#exportButton').dxButton({
            //    icon: 'exportpdf',
            //    text: 'Export to PDF',
            //    onClick: function () {
            //        const doc = new jsPDF();
            //        DevExpress.pdfExporter.exportDataGrid({
            //            jsPDFDocument: doc,
            //            component: dataGrid
            //        }).then(function () {
            //            doc.save('PayerLedgerInformationList.pdf');
            //        });
            //    }
            //});

            //$("#print").dxButton({
            //    icon: "print",
            //    text: "Print",
            //    onClick: function () {
            //        dataGrid.print();
            //    }
            //});
        };

        this.showPayerTransactionDetailsByGlobalMode = function () {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();
            
            $('#divDetails').show();
            $('#platformNameSelected').text("Details of Payer Ledger By Global View");
            $.ajaxSetup({
                cache: false
            });

            var remoteDataLoader = DevExpress.data.AspNet.createStore({
                key: "payerId",
                loadUrl: baseUrl + "/api/v1.0/PayerLedger/getPayerLedgerSummaryGroupedByMerchantCode/" + merchantCode,
                //loadParams: { startDate: startDate, endDate: endDate },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader('agencyCode', JSON.stringify(null));
                        xhr.setRequestHeader('mode', JSON.stringify(selectedModeValue));
                        xhr.setRequestHeader('taxYear', JSON.stringify(selectedYearValue));
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: remoteDataLoader,
                    remoteOperations: {
                        paging: true,
                        filtering: true,
                        sorting: true,
                        grouping: true,
                        summary: true,
                        groupPaging: true
                    },
                    searchPanel: {
                        visible: true,
                        placeholder: "Search...",
                        width: 250
                    },
                    paging: {
                        pageSize: 20
                    },
                    pager: {
                        showNavigationButtons: true,
                        showPageSizeSelector: true,
                        allowedPageSizes: [20, 50, 100, 250],
                        showInfo: true
                    },
                    //selection: {
                    //    mode: "multiple",
                    //    //mode: "single",
                    //    selectAllMode: 'page',
                    //    showCheckBoxesMode: 'always'
                    //},

                    "export": {
                        enabled: true,
                        //fileName: "AssessmentSummaryByPlatformList",
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = 'PayerTransactionDetailsList' + '(' + now.toISOString() + ')';
                },
                stateStoring: {
                    enabled: false,
                    type: "localStorage",
                    storageKey: "storage"
                },
                onExported: function (e) {
                    DevExpress.ui.notify({
                        message: "Export Successful",
                        type: "success",
                        displayTime: 3000,
                        closeOnClick: true
                    });
                },
                    hoverStateEnabled: true,
                    showRowLines: true,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    columns: [
                        {
                            caption: 'S/N',
                            width: "auto",
                            allowSorting: false,
                            allowFiltering: false,
                            allowReordering: false,
                            allowHeaderFiltering: false,
                            allowGrouping: false,
                            cellTemplate: function (container, options) {
                                container.text(dataGrid.pageIndex() * dataGrid.pageSize() + (options.rowIndex + 1));
                            }
                        },
                        {
                            dataField: "payerName",
                            caption: "Payer Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            //width: 210,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "payerId",
                            caption: "Payer ID",
                            sortIndex: 1,
                            cssClass: 'font-bold',
                            //width: 210,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "agencyName",
                            caption: "Agency Name",
                            sortIndex: 2,
                            cssClass: 'font-bold',
                            //width: 210,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "currentYearAss",
                            caption: "Current Year Ass.",
                            dataType: "number",
                            cssClass: 'font-bold',
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "currentYearPayment",
                            caption: "Current Year Payment",
                            dataType: "number",
                            cssClass: 'font-bold',
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "balance",
                            caption: "Balance",
                            dataType: "number",
                            cssClass: 'font-bold',
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        //{
                        //    dataField: "balance",
                        //    caption: "Total",
                        //    dataType: "number",
                        //    alignment: "right",
                        //    cssClass: 'font-bold',
                        //    format: { type: 'fixedPoint', precision: 2 },
                        //    calculateCellValue: function (data) {
                        //        return [data.currentYearAss +
                        //            data.currentYearPayment + data.balance];
                        //    }
                        //},
                        {
                            caption: "Details",
                            width: 200,
                            alignment: "center",
                            wordWrapEnabled: true,
                            cellTemplate: function (container, options) {
                                $('<div />').dxButton(
                                    {
                                        icon: 'icon icon-commenting',
                                        text: 'View',
                                        type: 'danger',
                                        alignment: "center",
                                        onClick: function (args) {
                                            $('#divDetails').hide();
                                            //console.log(options.data);
                                            that.showPayerLedgerGlobalDetailsPopUp(options.data);
                                            $('#divDetails').show();
                                        }
                                    }
                                ).appendTo(container)
                            },
                            visible: true
                        }
                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "payerId",
                                summaryType: "count",
                                displayFormat: "Total count: {0}"
                            },
                            {
                                column: "balance",
                                summaryType: "sum",
                                showInColumn: "balance",
                                displayFormat: "Column: {4}.: {0}",
                                //displayFormat: "Column: {1}. Sales: {0}",
                                //valueFormat: { type: 'fixedPoint', precision: 2 },
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            }

                        ]
                    },
                    onToolbarPreparing: function (e) {
                        var internalGrid = e.component;
                        e.toolbarOptions.items.unshift(
                            {
                                location: "after",
                                widget: "dxButton",
                                showText: "inMenu",
                                options: {
                                    text: "Refresh View",
                                    hint: "Refresh View",
                                    icon: "refresh",
                                    onClick: function () {
                                        DevExpress.ui.notify({
                                            message: "Refreshing view",
                                            type: "success",
                                            displayTime: 3000,
                                            closeOnClick: true
                                        });
                                        internalGrid.refresh();
                                    }
                                },
                                locateInMenu: "auto"
                            }
                        );
                    }
                };
            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");

            //$('#exportButton').dxButton({
            //    icon: 'exportpdf',
            //    text: 'Export to PDF',
            //    onClick: function () {
            //        const doc = new jsPDF();
            //        DevExpress.pdfExporter.exportDataGrid({
            //            jsPDFDocument: doc,
            //            component: dataGrid
            //        }).then(function () {
            //            doc.save('PayerLedgerInformationList.pdf');
            //        });
            //    }
            //});
        };

        var hy;
       
        this.showPayerLedgerDetailsPopUp = function (sentData) {
            dataGrid = $("#grdContainerPayerLedgerDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();
            
            $.ajaxSetup({
                cache: false
            });

            var displayDetailsOfPayerLedger = DevExpress.data.AspNet.createStore({
                key: "agentUtin",
                loadUrl: baseUrl + "/api/v1.0/PayerLedger/getPayerLedgerDetailsByPayerId/" + merchantCode,
                loadParams: { tccNo: sentData.tccNo },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader('payerId', JSON.stringify(sentData.payerId));
                        xhr.setRequestHeader('mode', JSON.stringify(selectedModeValue));
                        xhr.setRequestHeader('taxYear', JSON.stringify(selectedYearValue));
                        xhr.setRequestHeader('agencyCode', JSON.stringify(selectedMinistryValue));
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = $("#grdContainerPayerLedgerDetails").dxDataGrid({
                dataSource: displayDetailsOfPayerLedger,
                showBorders: true,
                "export": {
                    enabled: true,
                    //fileName: "AllTccList",
                    allowExportSelectedData: true
                },
                onExporting: function (e) {
                    var now = new Date();
                    e.fileName = 'TccDetails' + '(' + now.toISOString() + ')';
                },
                stateStoring: {
                    enabled: false,
                    type: "localStorage",
                    storageKey: "storage"
                },
                onExported: function (e) {
                    DevExpress.ui.notify({
                        message: "Export Successful",
                        type: "success",
                        displayTime: 3000,
                        closeOnClick: true
                    });
                },
                hoverStateEnabled: true,
                wordWrapEnabled: true,
                rowAlternationEnabled: true,
                columnAutoWidth: true,
                columns: [
                    {
                        dataField: "agentUtin",
                        caption: "Payer ID",
                        sortIndex: 1,
                        cssClass: 'font-bold',
                        visible: false,
                        sortOrder: 'asc'
                    },
                    {
                        dataField: "createdOn",
                        caption: "Dated On",
                        dataType: "date",
                        format: "dd-MMM-yyyy",
                        sortIndex: 4,
                        width: 100,
                        wordWrapEnabled: true,
                        sortOrder: 'desc'
                    },
                    //{
                    //    dataField: "createdOnFormated",
                    //    caption: "Expiry Date",
                    //    dataType: "date",
                    //    wordWrapEnabled: true,
                    //    format: "dd-MMM-yyyy"
                    //},
                    {
                        dataField: "narration",
                        caption: "Description",
                        alignment: "left",
                        //width: 80,
                        wordWrapEnabled: true,
                        cssClass: 'font-bold'
                    },
                    {
                        dataField: "referenceNo",
                        caption: "Reference No.",
                        wordWrapEnabled: true,
                        alignment: "left",
                        width: 180,
                        cssClass: 'font-bold',
                    },
                    {
                        dataField: "debit",
                        caption: "Debit",
                        alignment: "right",
                        wordWrapEnabled: true,
                        //width: 160,
                        cssClass: 'font-bold',
                        dataType: "number",
                        format: { type: 'fixedPoint', precision: 2 }
                    },
                    {
                        dataField: "credit",
                        caption: "Credit",
                        alignment: "right",
                        cssClass: 'font-bold',
                        dataType: "number",
                        wordWrapEnabled: true,
                        //width: 150,
                        format: { type: 'fixedPoint', precision: 2 },
                    },
                ],
                summary: {
                    totalItems: [
                        {
                            column: "agentUtin",
                            summaryType: "count",
                            displayFormat: "Total count: {0}"
                        },
                        {
                            column: "debit",
                            summaryType: "sum",
                            //valueFormat: { type: 'fixedPoint', precision: 2 },
                            customizeText: function (data) {
                                //return "Total: " + formatter.format(data.value);
                                return formatterWithNaira.format(data.value);
                            }
                        },
                        {
                            column: "credit",
                            summaryType: "sum",
                            //valueFormat: { type: 'fixedPoint', precision: 2 },
                            customizeText: function (data) {
                                //return "Total: " + formatter.format(data.value);
                                return formatterWithNaira.format(data.value);
                            }
                        }
                    ]
                },
            });

            var fullName = sentData.payerName; 
            var title = "Payer Ledger DETAILS" + " " + "Of" + " - " + fullName;
            $("#modal-owner-tccDetails .modal-title").html(title);
            $('#lblTccOwnerName').text(fullName);
            $('#lblTccOwnerNo').text(sentData.tccNo);
            $('#lblOwnerUtin').text(sentData.payerId);
            $('#lblTccOwnerTaxYear').text(sentData.taxYear);
            //that.EnableModal();
            $('#modal-owner-tccDetails').modal({
                backdrop: 'static'
            });
        };

        this.showPayerLedgerGlobalDetailsPopUp = function (sentData) {
            dataGrid = $("#grdContainerPayerLedgerDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();
            
            $.ajaxSetup({
                cache: false
            });

            var displayDetailsOfPayerLedger = DevExpress.data.AspNet.createStore({
                key: "agentUtin",
                loadUrl: baseUrl + "/api/v1.0/PayerLedger/getPayerLedgerDetailsByPayerId/" + merchantCode,
                loadParams: { tccNo: sentData.tccNo },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader('payerId', JSON.stringify(sentData.payerId));
                        xhr.setRequestHeader('mode', JSON.stringify(selectedModeValue));
                        xhr.setRequestHeader('taxYear', JSON.stringify(selectedYearValue));
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = $("#grdContainerPayerLedgerDetails").dxDataGrid({
                dataSource: displayDetailsOfPayerLedger,
                showBorders: true,
                "export": {
                    enabled: true,
                    //fileName: "AllTccList",
                    allowExportSelectedData: true
                },
                onExporting: function (e) {
                    var now = new Date();
                    e.fileName = 'TccDetails' + '(' + now.toISOString() + ')';
                },
                    stateStoring: {
                        enabled: false,
                        type: "localStorage",
                        storageKey: "storage"
                    },
                    onExported: function (e) {
                        DevExpress.ui.notify({
                            message: "Export Successful",
                            type: "success",
                            displayTime: 3000,
                            closeOnClick: true
                        });
                    },
                hoverStateEnabled: true,
                wordWrapEnabled: true,
                rowAlternationEnabled: true,
                columnAutoWidth: true,
                columns: [
                    {
                        dataField: "agentUtin",
                        caption: "Payer ID",
                        sortIndex: 1,
                        cssClass: 'font-bold',
                        visible: false,
                        sortOrder: 'asc'
                    },
                    {
                        dataField: "createdOn",
                        caption: "Dated On",
                        dataType: "date",
                        format: "dd-MMM-yyyy",
                        sortIndex: 4,
                        width: 100,
                        wordWrapEnabled: true,
                        sortOrder: 'desc'
                    },
                    //{
                    //    dataField: "createdOnFormated",
                    //    caption: "Expiry Date",
                    //    dataType: "date",
                    //    wordWrapEnabled: true,
                    //    format: "dd-MMM-yyyy"
                    //},
                    {
                        dataField: "narration",
                        caption: "Description",
                        alignment: "left",
                        //width: 80,
                        wordWrapEnabled: true,
                        cssClass: 'font-bold'
                    },
                    {
                        dataField: "referenceNo",
                        caption: "Reference No.",
                        wordWrapEnabled: true,
                        alignment: "left",
                        width: 180,
                        cssClass: 'font-bold',
                    },
                    {
                        dataField: "debit",
                        caption: "Debit",
                        alignment: "right",
                        wordWrapEnabled: true,
                        //width: 160,
                        cssClass: 'font-bold',
                        dataType: "number",
                        format: { type: 'fixedPoint', precision: 2 }
                    },
                    {
                        dataField: "credit",
                        caption: "Credit",
                        alignment: "right",
                        cssClass: 'font-bold',
                        dataType: "number",
                        wordWrapEnabled: true,
                        //width: 150,
                        format: { type: 'fixedPoint', precision: 2 },
                    },
                ],
                summary: {
                    totalItems: [
                        {
                            column: "agentUtin",
                            summaryType: "count",
                            displayFormat: "Total count: {0}"
                        },
                        {
                            column: "debit",
                            summaryType: "sum",
                            //valueFormat: { type: 'fixedPoint', precision: 2 },
                            customizeText: function (data) {
                                //return "Total: " + formatter.format(data.value);
                                
                                return formatterWithNaira.format(data.value);
                            }
                        },
                        {
                            column: "credit",
                            summaryType: "sum",
                            //valueFormat: { type: 'fixedPoint', precision: 2 },
                            customizeText: function (data) {
                                //return "Total: " + formatter.format(data.value);
                                hy = data.value;
                                console.log(hy);
                                return formatterWithNaira.format(data.value);
                            }
                        }
                    ]
                },
            });

            var fullName = sentData.payerName;
            var title = "Payer Ledger DETAILS" + " " + "Of" + " - " + fullName;
            $("#modal-owner-tccDetails .modal-title").html(title);
            $('#lblTccOwnerName').text(fullName);
            $('#lblTccOwnerNo').text(sentData.tccNo);
            $('#lblOwnerUtin').text(sentData.payerId);
            $('#lblTccOwnerTaxYear').text(sentData.taxYear);
            //$('#lblBalance').text(hy);
            //that.EnableModal();
            $('#modal-owner-tccDetails').modal({
                backdrop: 'static'
            });
        };

        $('#btnLogin').on('click', function () {
            $('#btnLogin').attr('disabled', 'disabled');
            var isValid = true;
            if ($('#txtUsername').val().trim() === "") {
                $('#txtUsername').css('border-color', 'Red');
                isValid = false;
            }
            else {
                $('#txtUsername').css('border-color', 'lightgrey');
            }
            if ($('#txtpassword').val().trim() === "") {
                $('#txtpassword').css('border-color', 'Red');
                isValid = false;
            }
            else {
                $('#txtpassword').css('border-color', 'lightgrey');
            }
            if (isValid === false) {
                ShowMessagePopup("Oops!", "Please ensure you fill both username and password field", "warning");
                $('#txtUsername').focus();
                ($('#txtUsername').focus());
                $('#btnLogin').removeAttr('disabled');
                return false;
            }

            that.PostToServer();
        })

        this.PostToServer = function () {

            var options = {};
            options.url = "Login?handler=ValidateCredentialsAsync";
            options.type = "POST";

            var inputedLoginParameters = {};
            inputedLoginParameters.Email = $('#txtUsername').val();
            inputedLoginParameters.Password = $('#txtpassword').val();
            inputedLoginParameters.RememberMe = $('#txtRememberMe').val(); //true;

            //console.log("got dere");
            options.data = JSON.stringify(inputedLoginParameters);
            options.contentType = "application/json";
            options.dataType = "json";
            options.async = true;
            options.beforeSend = function (xhr) {
                xhr.setRequestHeader("MY-XSRF-TOKEN",
                    $('input:hidden[name="__RequestVerificationToken"]').val());
                xhr.setRequestHeader('inputedLoginParameters', JSON.stringify(inputedLoginParameters));
                $("#loader").show();
                $("#loaderId").show();
            };

            options.success = function (data) {
                $("#loader").show();
                $("#loaderId").show();
                //console.log(data);
                var returnMsgId = data.statusId;
                var returnMsg = data.statusMessage;
                if (returnMsgId < 1) {
                    ShowMessagePopup("Oops!", returnMsg, "error");
                }
                else {
                    var hashComputed = data.recordResponseObject.computedHash;
                    var postParamsToExpress = data.recordResponseObject.postParamsToExpress;
                    ShowMessagePopup("Attention!", "Please wait, Transaction Processing....", "success");
                    //Do auto click the express button
                    //$("#expressBtn").trigger('click');
                    $("#pay").html(postParamsToExpress);
                }
            };
            options.error = function () {
                msg = "Error while processing your transaction!";
                ShowMessagePopup("Oops!", msg, "error");
                $("#loader").hide();
                $("#loaderId").hide();
            };
            $.ajax(options);
        };

        this.PostToServers = function () {
            console.log("About to login");

            $('#btnSaveUpload').attr('disabled', 'disabled');

            var inputedLoginParameters = {};
            inputedLoginParameters.Email = $('#txtUsername').val();
            inputedLoginParameters.Password = $('#txtpassword').val();
            inputedLoginParameters.RememberMe = $('#txtRememberMe').val(); //true;

            //console.log(selectBoxYear);
            //console.log($('#payerUtin').val());
            $.ajax({
                type: "POST",
                url: "Login?handler=ValidateCredentialsAsync",  //baseUrl + "/api/SelfService/ImportAnnualReturnsExcel",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("XSRF-TOKEN",
                        $('input:hidden[name="__RequestVerificationToken"]').val());
                    xhr.setRequestHeader('inputedLoginParameters', JSON.stringify(inputedLoginParameters));
                    $("#loader").show();
                },
                data: "",
                contentType: false,
                processData: false,
                success: function (response) {
                    $("#loader").hide();
                    $('#btnSearch').removeAttr('disabled');
                    console.log(response);
                    var returnMsgId = response.statusId;
                    var returnMsg = response.statusMessage;
                    console.log(returnMsg);
                    var responseObject = response.recordResponseObject;
                    if (response.length === 0)
                        ShowMessagePopup("Oops!", returnMsg, "error");
                    else if (response.length !== 0 && returnMsgId < 1) {
                        ShowMessagePopup("Oops!", returnMsg, "error");
                        $('#divPrint').html(responseObject);
                        $("#divPrint").css("color", "red");
                        document.getElementById('divPrint').style.color = 'red';
                    }
                    else {
                        swal({
                            title: "Successful!",
                            text: returnMsg,
                            icon: "success",
                            closeOnClickOutside: false,
                            closeOnEsc: false
                        })
                            .then((willDelete) => {
                                if (willDelete) {
                                    location.reload();
                                } else {
                                    swal("Transaction Successful, Please Reload The Page!", {
                                        icon: "success",
                                        closeOnClickOutside: false,
                                        closeOnEsc: false
                                    });
                                }
                            });
                        //ShowMessagePopup("Successful!", returnMsg, "success");
                        $('#btnRefreshPage').show();
                        //$('#divPrint').html(responseObject);  //Remove later cos rendering effect use dev if compulsory.

                        //$("#btnUpdate").css("display", "block");
                        //var box = bootbox.alert("User has been added successfully.");
                        //box.modal('show');
                        //document.getElementById('editpasshide').style.color = 'hidden';
                        //var theElement = document.getElementById("editpasshide");
                        //theElement.visible == false
                        //document.getElementById("<%=editpasshide.ClientID %>").visibility:hidden;
                    }
                },
                error: function (e) {
                    $("#loader").hide();
                    ShowMessagePopup("UnSuccessful!", e.responseText, "error");
                    //$('#divPrint').html(e.responseText);
                },
                complete: function () {
                    $("#loader").hide();
                }
            });
        };

        $('#btnRefreshPage').on('click', function () {
            location.reload();
        });

    }

    tSmart.gridController = tSmart.gridController || new tSmart.GridController;
    tSmart.gridController.initPage();
    //tSmart.gridController.searchPanel();
});




