$(function () {
    tSmart.GridController = function () {
        var dataGrid,
            selectBoxYear, selectBoxMode, selectReturnType, selectBoxRevenueOffice, domainName, selfServiceBaseUrl, baseUrl, selectedYearValue, selectedYearText, selectedModeValue, selectedModeText, selectReturnTypeValue, selectReturnTypeText, selectedMinistryValue, selectedMinistryText, merchantCode, merchantId, pageIdentityId, yearListDataLoader, modeListDataLoader, returnTypeListDataLoader, ministryListDataLoader, allAnnualReviewReturnsRemoteDataLoaders, allAnnualReturnsByYearRemoteDataLoaders, allWthHistoryBySelectedYearRemoteDataLoaders;

        var that = this;
        domainName = document.querySelector("#domainNameId").value;
        selfServiceBaseUrl = document.querySelector("#selfServiceBaseUrlId").value;
        console.log(domainName);
        baseUrl = domainName;
        merchantCode = document.querySelector("#merchantCode").value;
        merchantId = document.querySelector("#merchantId").value;
        pageIdentityId = document.querySelector("#pageIdentityId").value;

        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2
        })

        const formatterWithNaira = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        })

        yearListDataLoader = DevExpress.data.AspNet.createStore({
            key: "periodId",
            loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllActiveFiscalPeriods",
            loadParams: { transType: "EMIS" }
        });

        this.initPage = function () {
            DevExpress.ui.setTemplateEngine("underscore");
            //that.displayDefaultDashboard();
            that.displayDefaultDashboard(null);

            selectBoxYear = $("#taxYearSelectBox").dxSelectBox({
                dataSource: yearListDataLoader,
                valueExpr: "periodId",
                displayExpr: "taxYear",
                searchEnabled: true,
                hoverStateEnabled: true,
                searchExpr: ["taxYear", "periodId"],
                placeholder: "Click to Select Year",
                showClearButton: true,
                onValueChanged: function (e) {
                    dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
                    var value = e.component.option("value");
                    var text = e.component.option("text");
                    selectedYearValue = value;
                    selectedYearText = text;
                    if (selectedYearValue !== null) {
                        that.displayDefaultDashboard(selectedYearText);
                    }

                    $('#divDetails').hide();
                    $('#displaySelectedYearId').hide();

                    //dataGrid = $("#divDetails").dxDataGrid("instance").option('value', null);

                    //let element = document.getElementById("#divDetails");
                    //let instance = DevExpress.ui.dxDataGrid.getInstance(element);
                    //console.log(instance);
                }
            }).dxSelectBox("instance");

            $('#divDetails').hide();
            $('#displaySelectedYearId').hide();

            if (pageIdentityId !== null && pageIdentityId === "AnnualReturnDetailsPage") {
                //Do auto click the express button
                //$("#viewannualReturnsDetails").trigger('click');
                if (selectedYearValue !== null) {
                    that.showAllAnnualReturnsByYear(selectedYearText);
                    $('#divDetails').show();
                }
                if (selectedYearValue === null) {
                    that.showAllAnnualReturnsByYear(null);
                    $('#divDetails').show();
                }
            }

            if (pageIdentityId !== null && pageIdentityId === "AnnualReturnReviewDetailsPage") {
                if (selectedYearValue !== null) {
                    that.showAllAnnualReviewReturnsByYear(selectedYearText);
                    $('#divDetails').show();
                }
                if (selectedYearValue === null) {
                    that.showAllAnnualReviewReturnsByYear(null);
                    $('#divDetails').show();
                }
            }

            $('#viewannualReturnsDetails').click(function () {
                if (selectedYearValue !== null) {
                    that.showAllAnnualReturnsByYear(selectedYearText);
                    $('#divDetails').show();
                }
                if (selectedYearValue === null) {
                    that.showAllAnnualReturnsByYear(null);
                    $('#divDetails').show();
                }
            });

            $('#viewannualReturnsReviewDetails').click(function () {
                if (selectedYearValue !== null) {
                    that.showAllAnnualReviewReturnsByYear(selectedYearText);
                    $('#divDetails').show();
                }
                if (selectedYearValue === null) {
                    that.showAllAnnualReviewReturnsByYear(null);
                    $('#divDetails').show();
                }
            });

            $('#viewMonthlyScheduleDetails').click(function () {
                if (selectedYearValue !== null) {
                    that.showAllMonthlyReturnsByYear(selectedYearText);
                    $('#divDetails').show();
                }
                if (selectedYearValue === null) {
                    that.showAllMonthlyReturnsByYear(null);
                    $('#divDetails').show();
                }
            });

            $('#viewFormADetails').click(function () {
                if (selectedYearValue !== null) {
                    that.showAllFormAReturnsByYear(selectedYearText);
                    $('#divDetails').show();
                }
                if (selectedYearValue === null) {
                    that.showAllFormAReturnsByYear(null);
                    $('#divDetails').show();
                }
            });

            $('#viewWithholdingDetails').click(function () {
                if (selectedYearValue !== null) {
                    that.showallWthHistoryByYear(selectedYearText);
                    $('#divDetails').show();
                }
                if (selectedYearValue === null) {
                    that.showallWthHistoryByYear(null);
                    $('#divDetails').show();
                }
            });

        };

        this.displayDefaultDashboard = function (taxYear) {
            $('#annualReturnReviewTotalCount').text(0);
            $('#annualReturnTotalCount').text(0);
            $('#monthlyScheduleTotalAssCount').text(0);
            $('#formATotalAssCount').text(0);


            //$('#assessmentTotalAssAmt').text("0.00");

            //Annual Returns Review
            $.ajax({
                type: "GET",
                //url: selfServiceBaseUrl + "/api/SelfService/getAllActiveFiscalPeriods" + merchantCode,
                url: selfServiceBaseUrl + "/api/SelfService/getAnnualReturnsReviewCounts",
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('taxYear', JSON.stringify(taxYear));
                    $('#loading').show();
                },
                error: function (msg) {
                    ShowMessagePopup("Page Error", msg, "error");
                    DevExpress.ui.notify(msg, "error", 4000);
                    $('#loading').hide();
                },
                success: function (response) {
                    var recordResponseObject = response.recordResponseObject;
                    if (recordResponseObject !== null) {
                        var countValue = response.recordResponseObject;
                        //var amountValue = formatter.format(response.data.recordTotal);
                        //$('#annualReturnReviewTotalCount').text(amountValue);
                        //$('#annualReturnReviewTotalCount').text(Math.ceil(countValue).toLocaleString('en'));
                        //$('#assessmentTotalAssAmtView').show();
                        $('#annualReturnReviewTotalCount').text(countValue);
                    }

                    $('#loading').hide();
                }
            });

            //Annual Returns Count
            $.ajax({
                type: "GET",
                url: selfServiceBaseUrl + "/api/SelfService/getAnnualReturnsCounts",
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('taxYear', JSON.stringify(taxYear));
                    $('#loading').show();
                },
                error: function (msg) {
                    ShowMessagePopup("Page Error", msg, "error");
                    DevExpress.ui.notify(msg, "error", 4000);
                    $('#loading').hide();
                },
                success: function (response) {
                    var recordResponseObject = response.recordResponseObject;
                    if (recordResponseObject !== null) {
                        var countValue = response.recordResponseObject;
                        //$('#annualReturnTotalCount').text(Math.ceil(countValue).toLocaleString('en'));
                        $('#annualReturnTotalCount').text(countValue);
                        $('#loading').hide();
                        $('#viewTccDetails').show();
                        return;
                    }

                    $('#loading').hide();
                }
            });

            //Monthly Schedule
            $.ajax({
                type: "GET",
                url: selfServiceBaseUrl + "/api/SelfService/getMonthlyScheduleCounts",
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('taxYear', JSON.stringify(taxYear));
                    $('#loading').show();
                },
                error: function (msg) {
                    ShowMessagePopup("Page Error", msg, "error");
                    DevExpress.ui.notify(msg, "error", 4000);
                    $('#loading').hide();
                },
                success: function (response) {
                    var recordResponseObject = response.recordResponseObject;
                    if (recordResponseObject !== null) {
                        var countValue = 0;
                        countValue = response.recordResponseObject;
                        console.log(parseInt(countValue));
                        //$('#monthlyScheduleTotalAssCount').text(Math.ceil(countValue).toLocaleString('en'));
                        $('#monthlyScheduleTotalAssCount').text(countValue);
                        $('#loading').hide();
                        $('#viewMonthlyScheduleDetails').show();
                        return;
                    }

                    $('#loading').hide();
                }
            });

            //Form A
            $.ajax({
                type: "GET",
                url: selfServiceBaseUrl + "/api/SelfService/getFormACounts",
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('taxYear', JSON.stringify(taxYear));
                    $('#loading').show();
                },
                error: function (msg) {
                    ShowMessagePopup("Page Error", msg, "error");
                    DevExpress.ui.notify(msg, "error", 4000);
                    $('#loading').hide();
                },
                success: function (response) {
                    var recordResponseObject = response.recordResponseObject;
                    if (recordResponseObject !== null) {
                        var countValue = 0;
                        countValue = response.recordResponseObject;
                        //$('#formATotalAssCount').text(Math.ceil(countValue).toLocaleString('en'));
                        $('#formATotalAssCount').text(countValue);
                        $('#loading').hide();
                        $('#viewFormADetails').show();
                        return;
                    }

                    $('#loading').hide();
                }
            });

            //Withholding Returns
            $.ajax({
                type: "GET",
                url: selfServiceBaseUrl + "/api/SelfService/getWithholdingReturnsCounts",
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('taxYear', JSON.stringify(taxYear));
                    $('#loading').show();
                },
                error: function (msg) {
                    ShowMessagePopup("Page Error", msg, "error");
                    DevExpress.ui.notify(msg, "error", 4000);
                    $('#loading').hide();
                },
                success: function (response) {
                    var recordResponseObject = response.recordResponseObject;
                    if (recordResponseObject !== null) {
                        var countValue = 0;
                        countValue = response.recordResponseObject;
                        //$('#withholdingTotalCount').text(Math.ceil(countValue).toLocaleString('en'));
                        $('#withholdingTotalCount').text(countValue);
                        $('#loading').hide();
                        $('#viewWithholdingDetails').show();
                        return;
                    }

                    $('#loading').hide();
                }
            });
        };

        this.showAllAnnualReturnsByYear = function (taxYear) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();
            
            $.ajaxSetup({
                cache: false
            });

            allAnnualReturnsByYearRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "employerReturnsId",
                loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllAnnualReturnsList",
                loadParams: { taxYear: taxYear },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allAnnualReturnsByYearRemoteDataLoaders,
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
                    "export": {
                        enabled: true,
                        //fileName: "AllAssessmentsList",
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = taxYear + 'Annual Return List' + '(' + now.toISOString() + ')';
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
                            dataField: "taxAgentName",
                            //width: 180,
                            wordWrapEnabled: true,
                            caption: "Organization Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Organization UTIN",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "taxYear",
                            caption: "Year",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "createdOnFormated",
                            //dataType: "datetime",
                            caption: "Date Submitted"
                        },
                        {
                            dataField: "totalGrossAmountFormated",
                            caption: "Total Gross Income",
                            alignment: "right",
                            cssClass: 'font-bold',
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "totalAmountFormated",
                            caption: "Total Tax Deducted",
                            alignment: "right",
                            cssClass: 'font-bold',
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Complete Details",
                            alignment: "center",
                            wordWrapEnabled: true,
                            //cssClass: 'glyphicons unshare btn-sm btn-theme',
                            visible: true,
                            cellTemplate: function (container, options) {
                                var taxAgentUtin = options.data.taxAgentUtin;
                                var taxYear = options.data.taxYear;
                                var employerReturnsId = options.data.employerReturnsId;
                                var pageName = "summaryofAnnualReturns";
                                var formedString = taxAgentUtin + "/" + options.data.taxAgentName + "/" + taxYear + "/" + employerReturnsId + "/" + pageName;
                                console.log(taxAgentUtin);
                                console.log(taxYear);
                                console.log(employerReturnsId);
                                var padding = "'='";
                                var itemKeyEncodedStringWith = Base64.encode(formedString).trim(padding).replace('+', '-').replace('/', '_');
                                //console.log(itemKeyEncodedStringWith); addClass("btn btn-danger btn-block animated lightSpeedIn btn-push no-margin rounded");btn btn-info btn-sm

                                return $("<a>", { "href": "./AnnualReturnDetails?" + "&annualReturnDetailsUrlEncoded=" + itemKeyEncodedStringWith, "target": "_parent" }).text('View').addClass("btn btn-info btn-block animated lightSpeedIn btn-push no-margin rounded");

                            }
                        }

                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "taxAgentUtin",
                                summaryType: "count"
                            },
                            {
                                column: "totalGrossAmountFormated",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    return formatterWithNaira.format(data.value);
                                }
                            },
                            {
                                column: "totalAmountFormated",
                                summaryType: "sum",
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
            $('#displaySelectedYearId').show();
            $('#displaySelectedYearId').text("Details of Annual Returns Submitted");
        }

        this.showAllAnnualReviewReturnsByYear = function (taxYear) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();
            
            $.ajaxSetup({
                cache: false
            });

            allAnnualReviewReturnsRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "taxAgentUtin",
                loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllAnnualReturnsReviewList",
                loadParams: { taxYear: taxYear },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allAnnualReviewReturnsRemoteDataLoaders,
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
                    "export": {
                        enabled: true,
                        //fileName: "AllAssessmentsList",
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = taxYear + 'Annual Return Review List' + '(' + now.toISOString() + ')';
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
                            dataField: "taxAgentName",
                            //width: 180,
                            wordWrapEnabled: true,
                            caption: "Organization Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Organization UTIN",
                            cssClass: 'font-bold',
                            sortOrder: 'asc',
                            alignment: "left",
                            wordWrapEnabled: true,
                            sortIndex: 1,
                            visible: true
                        },
                        {
                            dataField: "taxYear",
                            caption: "Year",
                            alignment: "left",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "taxAgentCount",
                            dataType: "number",
                            alignment: "left",
                            caption: "Staff Strength"
                        },
                        {
                            dataField: "grossIncome",
                            caption: "Gross Income",
                            alignment: "right",
                            cssClass: 'font-bold'
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "taxPayable",
                            caption: "Tax Payable",
                            alignment: "right",
                            cssClass: 'font-bold'
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "taxDeducted",
                            caption: "Tax Deducted",
                            alignment: "right",
                            cssClass: 'font-bold'
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "taxRemitted",
                            caption: "Tax Remitted",
                            alignment: "right",
                            cssClass: 'font-bold'
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "underRemittance",
                            caption: "Under Remittance",
                            alignment: "right",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "totalLiability",
                            caption: "Total Liability",
                            alignment: "right",
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "underDeduction",
                            caption: "Under/(Over) Deduction",
                            alignment: "right",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "isReviewLetterPrinted",
                            caption: "Status",
                            sortIndex: 5,
                            sortOrder: 'asc',
                            dataType: "boolean",
                            alignment: "center",
                            wordWrapEnabled: true,
                            visible: false,
                            cellTemplate: function (container, options) {
                                if (options.value === true) {

                                    return $("<div/>")
                                        .addClass("label label-success")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Printed")
                                        );
                                }
                                else if (options.value === false) {
                                    return $("<div/>")
                                        .addClass("label label-danger")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Awaiting Printing")
                                        );
                                }
                                else {
                                    return $("<div/>")
                                        .addClass("label label-danger")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Not Printed")
                                        );
                                }

                            }
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Complete Details",
                            alignment: "center",
                            wordWrapEnabled: true,
                            //cssClass: 'primary',
                            visible: true,
                            cellTemplate: function (container, options) {
                                var taxAgentUtin = options.data.taxAgentUtin;
                                var taxYear = options.data.taxYear;
                                var employerReturnsId = options.data.employerReturnsId;
                                var pageName = "summaryofAnnualReturns";
                                var formedString = taxAgentUtin + "/" + options.data.taxAgentName + "/" + taxYear + "/" + employerReturnsId + "/" + pageName;
                                var padding = "'='";
                                var itemKeyEncodedStringWith = Base64.encode(formedString).trim(padding).replace('+', '-').replace('/', '_');
                                //console.log(itemKeyEncodedStringWith); 

                                return $("<a>", { "href": "./AnnualReturnReviewDetails?" + "&annualReturnsReviewUrlEncoded=" + itemKeyEncodedStringWith, "target": "_parent" }).text('View').addClass("btn btn-info btn-block animated lightSpeedIn btn-push no-margin rounded");
                            }
                        },
                        {
                            caption: "Review Letter",
                            width: 140,
                            alignment: "center",
                            cellTemplate: function (container, options) {
                                $('<div />').dxButton(
                                    {
                                        icon: 'icon icon-commenting',
                                        text: 'Generate',
                                        type: 'danger',
                                        alignment: "center",
                                        onClick: function (args) {
                                            var result = window.DevExpress.ui.dialog.confirm("Do you want to generate " + options.data.taxAgentName + " review letter. click Yes otherwise click No?", "Review Letter");
                                            result.done(function (dialogResult) {
                                                if (dialogResult) {
                                                    that.showReviewDetailsPopUp(options.data);
                                                }
                                                else
                                                    window.DevExpress.ui.notify("Review Letter Canceled", "error", 2000);
                                            });
                                            return false;
                                        }
                                    }
                                ).appendTo(container);
                            },
                            visible: false
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Review Letter",
                            alignment: "center",
                            wordWrapEnabled: true,
                            //cssClass: 'primary',
                            visible: false,
                            cellTemplate: function (container, options) {
                                var taxAgentUtin = options.data.taxAgentUtin;
                                var taxYear = selectedYearText;
                                var employerReturnsId = options.data.employerReturnsId;
                                var formedString = taxAgentUtin + "/" + options.data.taxAgentName + "/" + taxYear;
                                console.log(taxAgentUtin);
                                console.log(taxYear);
                                var padding = "'='";
                                var itemKeyEncodedStringWith = Base64.encode(formedString).trim(padding).replace('+', '-').replace('/', '_');
                                //console.log(itemKeyEncodedStringWith); 

                                return $("<a>", { "href": "../SelfService/AnnualReturnReviewDetail?" + "&annualReturnsReviewUrlEncoded=" + itemKeyEncodedStringWith, "target": "_parent" }).text('Generate').addClass("btn btn-info btn-block animated lightSpeedIn btn-push no-margin rounded");
                            }
                        }

                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "taxAgentUtin",
                                summaryType: "count"
                            },
                            {
                                column: "grossIncome",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            },
                            {
                                column: "taxPayable",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            },
                            {
                                column: "taxRemitted",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            },
                            {
                                column: "underRemittance",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            },
                            {
                                column: "totalLiability",
                                summaryType: "sum",
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
            //$('#displaySelectedYearId').text(selectedYearText);
            $('#displaySelectedYearId').show();
            $('#displaySelectedYearId').text("Details of Annual Returns Review");
        }

        this.showAllMonthlyReturnsByYear = function (taxYear) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();
            
            $.ajaxSetup({
                cache: false
            });

            allMonthlyReturnsByYearRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "employerMonthlyReturnsId",
                loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllMonthlyReturnsList",
                loadParams: { taxYear: taxYear },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allMonthlyReturnsByYearRemoteDataLoaders,
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
                    "export": {
                        enabled: true,
                        //fileName: "AllAssessmentsList",
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = taxYear + 'Monthly Return List' + '(' + now.toISOString() + ')';
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
                            dataField: "taxAgentName",
                            //width: 180,
                            wordWrapEnabled: true,
                            caption: "Organization Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Organization UTIN",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "taxYear",
                            caption: "Year",
                            cssClass: 'font-bold',
                            visible: true
                        },

                        {
                            dataField: "periodValueCount",
                            caption: "No. of Month",
                            cssClass: 'font-bold',
                            alignment: "center",
                            visible: true
                        },
                        //{
                        //    dataField: "createdOnFormated",
                        //    //dataType: "datetime",
                        //    caption: "Date Submitted"
                        //},
                        {
                            dataField: "totalAmountFormated",
                            caption: "Total Tax Deducted",
                            alignment: "right",
                            cssClass: 'font-bold',
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Summary Details",
                            alignment: "center",
                            wordWrapEnabled: true,
                            cssClass: 'success',
                            visible: true,
                            cellTemplate: function (container, options) {
                                var taxAgentUtin = options.data.taxAgentUtin;
                                var taxYear = options.data.taxYear;
                                var employerReturnsId = options.data.employerReturnsId;
                                var pageName = "summaryofAnnualReturns";
                                var formedString = taxAgentUtin + "/" + options.data.taxAgentName + "/" + taxYear + "/" + employerReturnsId + "/" + pageName;
                                console.log(taxAgentUtin);
                                console.log(taxYear);
                                console.log(employerReturnsId);
                                var padding = "'='";
                                var itemKeyEncodedStringWith = Base64.encode(formedString).trim(padding).replace('+', '-').replace('/', '_');
                                //console.log(itemKeyEncodedStringWith); 

                                //return $("<a>", { "href": "../SelfService/MonthlyReturnSummary?" + "&monthlyreturnsUrlEncoded=" + itemKeyEncodedStringWith, "target": "_parent" }).text('View');

                                return $("<a>", { "href": "./MonthlyReturnSummary?" + "&monthlyreturnsUrlEncoded=" + itemKeyEncodedStringWith, "target": "_parent" }).text('View').addClass("btn btn-info btn-block animated lightSpeedIn btn-push no-margin rounded");
                            }
                        }

                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "taxAgentUtin",
                                summaryType: "count"
                            },
                            {
                                column: "totalAmountFormated",
                                summaryType: "sum",
                                customizeText: function (data) {
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
            $('#displaySelectedYearId').show();
            $('#displaySelectedYearId').text("Details of Monthly Schedule Submitted");
        }

        this.showAllFormAReturnsByYear = function (taxYear) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();
            
            $.ajaxSetup({
                cache: false
            });

            allFormAReturnsByYearRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "employerFormAReturnsId",
                loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllFormAReturnsList",
                loadParams: { taxYear: taxYear },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allFormAReturnsByYearRemoteDataLoaders,
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
                    "export": {
                        enabled: true,
                        //fileName: "AllAssessmentsList",
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = taxYear + 'Form A Return List' + '(' + now.toISOString() + ')';
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
                            dataField: "taxAgentName",
                            wordWrapEnabled: true,
                            caption: "Organization Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Organization UTIN",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "year",
                            caption: "Year",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "createdOnFormated",
                            //dataType: "datetime",
                            caption: "Date Submitted"
                        },
                        {
                            dataField: "totalIncomeFormated",
                            caption: "Total Income",
                            alignment: "right",
                            cssClass: 'font-bold',
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Complete Details",
                            alignment: "center",
                            wordWrapEnabled: true,
                            visible: true,
                            cellTemplate: function (container, options) {
                                var taxAgentUtin = options.data.taxAgentUtin;
                                var taxYear = options.data.year;
                                //var employerFormAReturnsId = options.data.employerFormAReturnsId;
                                var pageName = "summaryofAnnualReturns";
                                var formedString = taxAgentUtin + "/" + options.data.taxAgentName + "/" + taxYear + "/" + pageName;
                                var padding = "'='";
                                var itemKeyEncodedStringWith = Base64.encode(formedString).trim(padding).replace('+', '-').replace('/', '_');

                                //return $("<a>", { "href": "../SelfService/FormAReturnDetails?" + "&fromareturns=" + itemKeyEncodedStringWith, "target": "_parent" }).text('View');

                                return $("<a>", { "href": "./FormADetailsView?" + "&formAReturnsUrlEncoded=" + itemKeyEncodedStringWith, "target": "_parent" }).text('View').addClass("btn btn-info btn-block animated lightSpeedIn btn-push no-margin rounded");
                            }
                        }
                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "taxAgentUtin",
                                summaryType: "count"
                            },
                            {
                                column: "totalIncomeFormated",
                                summaryType: "sum",
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
            $('#displaySelectedYearId').show();
            $('#displaySelectedYearId').text("Details of Form A Returns Submitted");
        }

        this.showallWthHistoryByYear = function (taxYear) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();
            
            $.ajaxSetup({
                cache: false
            });

            $.ajaxSetup({
                cache: false
            });

            allWthHistoryBySelectedYearRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "taxAgentUtin",
                loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllWithholdingReturnsList",
                loadParams: { taxYear: taxYear },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allWthHistoryBySelectedYearRemoteDataLoaders,
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
                        pageSize: 12
                    },
                    pager: {
                        showNavigationButtons: true,
                        showPageSizeSelector: true,
                        allowedPageSizes: [20, 50, 100, 250],
                        showInfo: true
                    },
                    "export": {
                        enabled: true,
                        //fileName: "AllTccList",
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = 'AllWithholdingList' + '(' + now.toISOString() + ')';
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
                            dataField: "nameOfContractor",
                            caption: "Name Of Contractor/Consultant",
                            sortIndex: 0,
                            sortOrder: 'asc',
                            //fixed: true,
                            cssClass: 'font-bold'
                            //calculateCellValue: function (data) {
                            //    return [data.lastname,
                            //    data.firstname, data.othernames]
                            //        .join(" ");
                            //}
                        },
                        {
                            dataField: "addressOfBusinessOutfit",
                            caption: "Address",
                            wordWrapEnabled: true,
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "natureOfContract",
                            wordWrapEnabled: true,
                            caption: "Nature of Contract",
                            sortIndex: 1,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "contractSum",
                            caption: "Contract Sum",
                            alignment: "right",
                            cssClass: 'font-bold',
                            dataType: "number",
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "percentOFTaxWithHeld",
                            wordWrapEnabled: true,
                            caption: "Percentage of Tax Withheld"
                        },
                        {
                            dataField: "amountWithHeld",
                            caption: "Amount WithHeld",
                            alignment: "right",
                            cssClass: 'font-bold',
                            dataType: "number",
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "monthName",
                            wordWrapEnabled: true,
                            caption: "Month(s)",
                            sortIndex: 3,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "whtTransReferenceNumber",
                            caption: "Trans Reference Number",
                            alignment: "left",
                            visible: false,
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Tax AgentUtin",
                            alignment: "left",
                            visible: false,
                        }

                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "monthName",
                                summaryType: "count",
                                displayFormat: "Total count: {0}"
                            },

                            {
                                column: "amountWithHeld",
                                summaryType: "sum",
                                //valueFormat: { type: 'fixedPoint', precision: 2 },
                                customizeText: function (data) {
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
            $('#displaySelectedYearId').show();
            $('#displaySelectedYearId').text("Details of Withholding Returns Submitted");
        }

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

        };

    }

    tSmart.gridController = tSmart.gridController || new tSmart.GridController;
    tSmart.gridController.initPage();
    //tSmart.gridController.searchPanel();
});




