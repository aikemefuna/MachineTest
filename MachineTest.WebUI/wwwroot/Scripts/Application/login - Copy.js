$(function () {
    tSmart.GridController = function () {
        var dataGrid,
            selectBoxYear, domainName, baseUrl;

        var that = this;
        domainName = document.querySelector("#domainNameId").value;
        //console.log(domainName);
        baseUrl = domainName;

        //var serviceUserInfo = taxSmart.pageSettings.serverVars.sui;
        //var baseUrl = taxSmart.pageSettings.serverVars.burl;
        //var nurl = taxSmart.pageSettings.serverVars.nurl;
        //var merchantCode = taxSmart.pageSettings.serverVars.mc;

        this.initPage = function () {
            DevExpress.ui.setTemplateEngine("underscore");
            //that.SubmitPayment();
            $('#btnSaveUpload').hide();
            $('#btnRefreshPage').hide();
            $('#btnRemoveRecord').hide();
            $('#btnAddDoc').hide();
            $('#detailsDivId').hide();
            $('#tblSupportingDocumentsDetails').hide();
            $('#btnRemoveRecord').hide();
        }

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
    //tSmart.gridController.initPage();
    //tSmart.gridController.searchPanel();
});




