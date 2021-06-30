$(function () {
    tSmart.GridController = function () {
        var dataGrid,
            selectBoxYear, selectBoxYearValue, yearListDataLoader, domainName, baseUrl;

        var that = this;
        domainName = document.querySelector("#domainNameId").value;
        //console.log(domainName);
        baseUrl = domainName;

        //var serviceUserInfo = taxSmart.pageSettings.serverVars.sui;
        //var baseUrl = taxSmart.pageSettings.serverVars.burl;
        //var nurl = taxSmart.pageSettings.serverVars.nurl;
        //var merchantCode = taxSmart.pageSettings.serverVars.mc;

        this.initPage = function () {
            //_.templateSettings = {
            //    interpolate: /\{%=(.+?)%\}/g,
            //    escape: /\{%-(.+?)%\}/g,
            //    evaluate: /\{%(.+?)%\}/g
            //};
            DevExpress.ui.setTemplateEngine("underscore");
            //that.SubmitPayment();
            $('#btnSaveUpload').hide();
            $('#btnRefreshPage').hide();
            $('#btnRemoveRecord').hide();
            $('#btnAddDoc').hide();
            $('#detailsDivId').hide();
            $('#tblSupportingDocumentsDetails').hide();
            $('#btnRemoveRecord').hide();

            //var $theTable = $("#tblSupportingDocumentsDetails"),
            //    lookAt = ["tr:first-child", "tr:last-child",
            //        "td:first-child", "td:last-child"];

            //for (var i = 0; i < lookAt.length; i++) {
            //    while ($.trim($(lookAt[i], $theTable).text()) === "") {
            //        $(lookAt[i], $theTable).remove();
            //    }
            //}

            $("#tblSupportingDocumentsDetails tr td").each(function () {
                var emptyrows = $.trim($(this).text());
                if (emptyrows.length === 0) {
                    $(this).parents("tr").remove();
                    //$(this).parents().hide();
                }

            });
        }

        this.searchPanel = function () {

            $(function () {
                var $tblChkBox = $('input[name="record"]');
                $('input[name="bulkrecord"]').on("click", function () {
                    $($tblChkBox).prop('checked', $(this).prop('checked'));
                });
            });

            $('input[name="bulkrecord"]').on("change", function () {
                if ($(this).prop("checked")) {
                    $('input[name="record"]').prop("checked", true);
                    //console.log("ms is here 1");
                }
                else if (!$(this).prop("checked")) {
                    $('input[name="record"]').prop("checked", false);
                    //console.log("ms is here 2");
                }
            });

        }

        yearListDataLoader = DevExpress.data.AspNet.createStore({
            key: "periodId",
            loadUrl: baseUrl + "/api/SelfService/getAllActiveFiscalPeriods",
            loadParams: { transType: "Annaul" }
        });

        
        searchYearBox = $("#taxYearSelectBox").dxSelectBox({
            dataSource: yearListDataLoader,
            valueExpr: "periodId",
            displayExpr: "taxYear",
            searchEnabled: true,
            hoverStateEnabled: true,
            searchExpr: ["taxYear", "periodId"],
            placeholder: "Click to Select Assessment Year",
            showClearButton: true,
            onValueChanged: function (e) {
                var value = e.component.option("value");
                var text = e.component.option("text");
                //console.log(value);
                //console.log(text);
                var selectedYearValue = value;
                var selectedYearText = text;
                if (selectedYearValue > 0) {
                    selectBoxYear = selectedYearText;
                    selectBoxYearValue = selectedYearValue
                    $('#btnSaveUpload').show();
                    $('#btnRefreshPage').show();
                    $('#detailsDivId').show();
                    $('#tblSupportingDocumentsDetails').show();
                    $('#btnAddDoc').show();

                    //$("#HfsearchIdentifier").val(identifier);
                    //$('#searchCaption').text("Enter Name or Phone Number Below :");
                    //$('#searchDiv').show();
                    //$('#txtSearchValue').focus();
                    //$('#txtSearchValue').val("");
                }
                else if (selectedYearValue <= 0) {
                    ShowMessagePopup("Oops!", "Please select a valid assessment year!", "error");
                    selectBoxYear = selectedYearText;
                    selectBoxYearValue = selectedYearValue
                    return false;
                    //$('#searchDiv').hide();
                    //identifier = "0";
                    //$("#HfsearchIdentifier").val(identifier);
                    //$('#txtSearchValue').val("");
                }
            }
        }).dxSelectBox("instance");

        //$('#supportingDocumentPath').change(function (e) {
        //    var fileName = e.target.files[0].name;
        //    alert('The file "' + fileName + '" has been selected.');
        //    var path = (window.URL || window.webkitURL).createObjectURL(e.target.files[0]);
        //    console.log('path', path);
        //});

        function AddEvent() {
            var hot = $('input[name="record"]').prop("checked");
            if ($('#checkBoxes').prop('checked')) {
                // something when checked
                $('#btnRemoveRecord').show();
            } else {
                // something else when not
                $('#btnRemoveRecord').hide();
            }

            if ($('#ckbCheckAll').prop('checked')) {
                // something when checked
                $('#btnRemoveRecord').show();
            } else {
                // something else when not
                $('#btnRemoveRecord').hide();
            }

            $("table tbody").find('input[name="record"]').each(function () {
                $(this).change(function () {
                    if ($(this).prop('checked')) {
                        $('#btnRemoveRecord').show();
                    } else {
                        $('#btnRemoveRecord').hide();
                    }
                });
            });

            $("table tbody").find('input[name="bulkrecord"]').each(function () {
                $(this).change(function () {
                    if ($(this).prop('checked')) {
                        $('#btnRemoveRecord').show();
                    } else {
                        $('#btnRemoveRecord').hide();
                    }
                });
            });
        }

        $('#btnAddDoc').click(function () {
            var fileExtension = ['jpg', 'jpeg', 'png', 'pdf'];
            var filename = $('#supportingDocumentPath').val();
            if (filename.length === 0) {
                ShowMessagePopup("Oops!", "Please select a valid file!", "error");
                $('#supportingDocumentPath').val('');
                document.getElementById("supportingDocumentPath").value = null;
                return false;
            }
            else {
                var extension = filename.replace(/^.*\./, '');
                if ($.inArray(extension, fileExtension) === -1) {
                    var validExts = new Array("jpg", "jpeg", "png", "pdf");
                    $('#supportingDocumentPath').val('');
                    document.getElementById("supportingDocumentPath").value = null;
                    var msg = "Invalid file selected, valid files are of " + validExts.toString() + " types.";
                    ShowMessagePopup("Wrong Extension!", msg, "error");
                    return false;
                }
            }

            //var filenamed = $('#supportingDocumentPath')[0].files.length ? ('#supportingDocumentPath')[0].files[0].name : "";
            var filenames = $('#supportingDocumentPath').val().replace(/C:\\fakepath\\/i, '')
            var supportingDocumentPathValue = filenames; 
            if (!supportingDocumentPathValue) {
                ShowMessagePopup("Field Error", "Support Document is required", "info");
                $('#supportingDocumentPath').focus();
                $('#supportingDocumentPath').val('');
                document.getElementById("supportingDocumentPath").value = null;
                return false;
            }
            var attachedFileNameValue = $('#attachedFileName').val();
            if (!attachedFileNameValue) {
                ShowMessagePopup("Field Error", "Support Document Description is required", "info");
                $('#periodDateValue').focus();
                $('#supportingDocumentPath').val('');
                document.getElementById("supportingDocumentPath").value = null;
                return false;
            }

            if (!supportingDocumentPathValue || !attachedFileNameValue) {
                ShowMessagePopup("Valid Entries Required", "Both support document file and name must be entered to continue", "warning");
                return false;
            }

            var dateFormat = "MM-yyyy";
            that.addSelectedRecord(supportingDocumentPathValue, attachedFileNameValue);
            $('input[name="bulkrecord"]').prop("checked", false); //Remove select all
            $('input[name="record"]').prop("checked", false);   //Remove single select
            AddEvent();
        });

        $(".delete-row").click(function () {
            var result = DevExpress.ui.dialog.confirm("You're about to delete the selected record (s). Do you want to continue?", "Transaction Status.");
            result.done(function (dialogResult) {
                if (dialogResult) {
                    $("table tbody").find('input[name="record"]').each(function () {
                        if ($(this).is(":checked")) {
                            $(this).parents("tr").remove();
                            var msgs = "Selected record removed successfully!";
                            ShowMessagePopup("Good Job!", msgs, "success");
                            $('#btnRemoveRecord').hide();
                        }
                    });

                    var jsonTable = $('#tblSupportingDocumentsDetails tbody tr:has(td)').map(function () {
                        var $td = $('td', this);
                        return {
                            SupportFileName: $td.eq(1).text(),
                            SupportFilePath: $td.eq(2).text()
                        }
                    }).get();

                    $("#btnSaveUpload").show();
                }
                else
                    DevExpress.ui.notify("Request Querry Canceled", "error", 2000);
            });
            return false;
        });

        $(".delete-row1").click(function () {
            $("table tbody").find('input[name="record"]').each(function () {
                if (!$(this).is(":checked")) {
                    ShowMessagePopup("Selection Error", "Please select a file to delete", "warning");
                    return false;
                }
                else {
                    var result = DevExpress.ui.dialog.confirm("You're about to delete the selected record (s). Do you want to continue?", "Transaction Status.");
                    result.done(function (dialogResult) {
                        if (dialogResult) {
                            $("table tbody").find('input[name="record"]').each(function () {
                                if ($(this).is(":checked")) {
                                    $(this).parents("tr").remove();
                                    var msgs = "Selected record removed successfully!";
                                    ShowMessagePopup("Good Job!", msgs, "success");
                                    $('#btnRemoveRecord').hide();
                                }
                            });

                            var jsonTable = $('#tblSupportingDocumentsDetails tbody tr:has(td)').map(function () {
                                var $td = $('td', this);
                                return {
                                    SupportFileName: $td.eq(1).text(),
                                    SupportFilePath: $td.eq(2).text()
                                }
                            }).get();

                            $("#btnSaveUpload").show();
                        }
                        else
                            DevExpress.ui.notify("Request Querry Canceled", "error", 2000);
                    });
                    return false;
                }
            });
        });

        this.addSelectedRecord = function (supportingDocumentPath, attachedFileName) {
            //var total = 0;
            var supportingDocumentPathValues = supportingDocumentPath;
            var attachedFileNames = attachedFileName;
            if (!supportingDocumentPathValues || !attachedFileNames) {
                ShowMessagePopup("Valid Entries Required", "Both support document file and name must be entered to continue", "warning");
                $('#supportingDocumentPath').val('');
                document.getElementById("supportingDocumentPath").value = null;
                return false;
            }

            var sentSupportingDocumentPathValue = supportingDocumentPathValues;
            var sentattachedFileNamesValue = attachedFileNames;
            if (sentSupportingDocumentPathValue || sentattachedFileNamesValue) {
                var gridRows = $("[id *= tblSupportingDocumentsDetails] tr")
                var isExist = false;
                gridRows.each(function () {
                    var emptyrows = $.trim($(this).text());
                    if (emptyrows.length === 0) {
                        $(this).parents("tr").remove();
                        //$(this).parents().hide();
                    }
                    if ($("td:nth-child(2)", $(this)).html() === sentattachedFileNamesValue && $("td:nth-child(3)", $(this)).html() === sentSupportingDocumentPathValue) {
                        isExist = true;
                    }
                });

                if (!isExist) {
                    var markup = "<tr><td><input type='checkbox' name='record'></td><td>" + sentattachedFileNamesValue + "</td><td>" + sentSupportingDocumentPathValue + "</td></tr>";
                    $("#tblSupportingDocumentsDetails").append(markup);
                    //$("#divSubmit").show();
                    $('#btnSaveUpload').show();
                    $('#btnRefreshPage').show();
                    $('#btnRemoveRecord').show();
                    $('#tblSupportingDocumentsDetails').show();
                    $('#attachedFileName').empty();
                    $('#attachedFileName').focus();
                    $('#attachedFileName').val("");

                    var jsonTable = $('#tblSupportingDocumentsDetails tbody tr:has(td)').map(function () {
                        var $td = $('td', this);
                        //total += parseFloat($td.eq(2).text());
                        return {
                            SupportFileName: $td.eq(1).text(),
                            SupportFilePath: $td.eq(2).text()
                        }
                    }).get();
                    $('#supportingDocumentPath').val('');
                    document.getElementById("supportingDocumentPath").value = null;

                } else {
                    msg = "Record already Exist, Check and try again!";
                    $('#supportingDocumentPath').val('');
                    document.getElementById("supportingDocumentPath").value = null;
                    ShowMessagePopup("Oops!", msg, "error");
                    return;
                }
            }
        };


        $('#btnSaveUpload').on('click', function () {
            var fileExtension = ['xls', 'xlsx'];
            var filename = $('#fileupload').val();
            if (filename.length === 0) {
                $('#fileupload').val("");
                ShowMessagePopup("Oops!", "Please select a valid file!", "error");
                return false;
            }
            else if (selectBoxYearValue <= 0 || selectBoxYearValue === "undefined") {
                ShowMessagePopup("Oops!", "Please select a valid assessment year!", "error");
                return false;
            }
            else {
                var extension = filename.replace(/^.*\./, '');
                if ($.inArray(extension, fileExtension) === -1) {
                    var validExts = new Array(".xlsx", ".xls");
                    $('#fileupload').val("");
                    var msg = "Invalid file selected, valid files are of " + validExts.toString() + " types.";
                    ShowMessagePopup("Wrong Extension!", msg, "error");
                    return false;
                }
            }

            that.confirmTransactionSubmission(selectBoxYear);
        })

        this.confirmTransactionSubmission = function (selectBoxYear) {
            //var msg = "You are about to search for normalized payer(s)";
            var msg = "You are about to Upload Return for " + selectBoxYear + " tax year. Do you want to continue?";
            swal({
                title: "Are you sure?",
                text: msg, //"A Transaction Ref. No will be sent to your entered mail to querry transaction status. Do you want to continue?",
                icon: "warning",
                //buttons: true,
                buttons: [
                    'No, cancel it!',
                    'Yes, I am sure!'
                ],
                closeOnClickOutside: false,
                dangerMode: true
            })
                .then((willDelete) => {
                    if (willDelete) {
                        that.PostToServer();
                    } else {
                        //swal("Congrats! Your selected record is still safe!", {
                        //    icon: "success",
                        //    closeOnClickOutside: false,
                        //    closeOnEsc: false
                        //});
                        DevExpress.ui.notify("Canceled", "error", 2000);
                    }
                });
        };

        this.PostToServer = function () {
            console.log("About to submit");

            $('#btnSaveUpload').attr('disabled', 'disabled');

            var supportingDocumntParameters = new Array();
            $("#tblSupportingDocumentsDetails TBODY TR").each(function () {
                var row = $(this);
                var supportingDocumntParameter = {};
                //supportingDocumntParameter.InitialPaymentRefNumber = $("[id*=hfInitialPaymentRefNumber]").val();
                //supportingDocumntParameter.InitialPaymentAmount = $("[id*=hfInitialPaymentAmount]").val();
                supportingDocumntParameter.SupportDocPathName = row.find("TD").eq(1).html();
                supportingDocumntParameter.SupportDocPath = row.find("TD").eq(2).html();
                supportingDocumntParameters.push(supportingDocumntParameter);
            });

            //var periodModificationParameters = {
            //    CurrentPeriodId: periodId,
            //    ModifyParams: {
            //        NewPeriodDate: paymentPeriods,
            //        CurrentPeriodDate: $("#cMonthId").val(),
            //        CurrentPeriodDate: $("#hfCurrentRequestPeriodId").val()
            //    }
            //};

            var selectedReturnParameters = {};
            selectedReturnParameters.PayerUtin = $('#payerUtin').val();
            selectedReturnParameters.TaxYear = selectBoxYear;
            //console.log(selectBoxYear);
            //console.log($('#payerUtin').val());
            var fdata = new FormData();
            var fileUpload = $("#fileupload").get(0);
            var files = fileUpload.files;
            //var baseUrl = "http://ogunstatebir.com/SelfServicePortal.WebCore";
            //console.log("Got this far");
            //console.log(files);
            fdata.append(files[0].name, files[0]);
            $.ajax({
                type: "POST",
                url: baseUrl + "/api/SelfService/ImportAnnualReturnsExcel",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("XSRF-TOKEN",
                        $('input:hidden[name="__RequestVerificationToken"]').val());
                    xhr.setRequestHeader('selectedReturnParameters', JSON.stringify(selectedReturnParameters));
                    xhr.setRequestHeader('supportingDocumntParameters', JSON.stringify(supportingDocumntParameters));
                    $("#loader").show();
                },
                data: fdata,
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

        //$('#btnAddDoc').on('click', function () {
        //    $('#btnSaveUpload').show();
        //    $('#btnRefreshPage').show();
        //    $('#btnRemoveRecord').show();
        //});

        //$("#gridContainer").dxDataGrid({
        //    dataSource: orders,
        //    keyExpr: "ID",
        //    showBorders: true,
        //    selection: {
        //        mode: "single"
        //    },
        //    columns: [{
        //        dataField: "OrderNumber",
        //        width: 130,
        //        caption: "Invoice Number"
        //    }, {
        //        dataField: "OrderDate",
        //        dataType: "date",
        //        width: 160
        //    },
        //        "Employee", {
        //        caption: "City",
        //        dataField: "CustomerStoreCity"
        //    }, {
        //        caption: "State",
        //        dataField: "CustomerStoreState"
        //    }, {
        //        dataField: "SaleAmount",
        //        alignment: "right",
        //        format: "currency"
        //    }
        //    ],
        //    summary: {
        //        totalItems: [{
        //            column: "OrderNumber",
        //            summaryType: "count"
        //        }, {
        //            column: "OrderDate",
        //            summaryType: "min",
        //            customizeText: function (data) {
        //                return "First: " + Globalize.formatDate(data.value, { date: "medium" });
        //            }
        //        }, {
        //            column: "SaleAmount",
        //            summaryType: "sum",
        //            valueFormat: "currency"
        //        }]
        //    }
        //});

    }

    tSmart.gridController = tSmart.gridController || new tSmart.GridController;
    tSmart.gridController.initPage();
    tSmart.gridController.searchPanel();
});




