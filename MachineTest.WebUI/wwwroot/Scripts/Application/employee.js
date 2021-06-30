$(document).ready(function () {
    var employee = {};
    employee.Name   = $('#txtName').val();
    employee.Gender = $('#ddlGender').val();
    employee.Phone  = $('#txtPhone').val();
    employee.Email  = $('#txtEmail').val();
    employee.Age    = $('#txtAge').val();
    employee.Salary = $('#txtSalary').val();

    $.ajax({
        url: 'EmployeeService.asmx/AddEmployee',
        method: 'post',
        data:   '{emp: ' + JSON.stringify(employee) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            getAllEmployees();

        },
        error: function (err) {
            console.log(err);
        }
    });

 function getAllEmployees() {
        $.ajax({
            url: 'EmployeeService.asmx/GetAllEmployees',
            dataType: "json",
            method: 'GET',
            success: function (data) {
                var employeeTable = $('#employee tbody');
                employeeTable.empty();

                $(data).each(function (index, emp) {
                    employeeTable.append('<tr><td>' + emp.ID + '</td><td>'
                        + emp.Name + '</td><td>' + emp.Gender + '</td><td>'
                        + emp.Phone + '</td><td>' + emp.Email + '</td><td>'
                        + emp.Age + '</td><td>' + emp.Salary + '</td></tr>');
                });
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
});

