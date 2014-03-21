(function ($, Drupal, window, document, undefined) {

  $(function() {

    var loan_amount              = $('#mortgage-calculation-form .form-item-loan-amount');
    var down_payment             = $('#mortgage-calculation-form .form-item-down-payment-percent');
    var term                     = $('#mortgage-calculation-form .form-item-term');
    var interest_rate            = $('#mortgage-calculation-form .form-item-interest-rate');
    var property_tax             = $('#mortgage-calculation-form .form-item-property-tax');
    var property_insurance       = $('#mortgage-calculation-form .form-item-property-insurance');
    var loan_amount              = $('#mortgage-calculation-form .form-item-loan-amount');
    var pmi                      = $('#mortgage-calculation-form .form-item-pmi');
    var loan_type                = $('#mortgage-calculation-form .form-item-loan-type');

    togglePMI();
    toggleLoanType();

    down_payment.find('input').change(function() {
      togglePMI();
    });

    loan_type.find('select').change(function() {
      toggleLoanType();
    });

    // Create Loan Type Buttons
    var loan_type_selector = $('<div class="loan-type-selector">').prependTo('.page-resources-loan-calculator .wrapper.content-area .wrapper.content');
    var mortgage_button = $('<button class="mortgage" type="button">Mortgage</button>').prependTo(loan_type_selector);
    var loan_button = $('<button class="loan" type="button">Loan</button>').appendTo(loan_type_selector);

    // Get Loan Type Form Element
    var loan_type = $('#mortgage-calculation-form .form-item-loan-type').hide();

    // Set button as active for loan type selection
    if(loan_type.find('select').val() == "mortgage")
      mortgage_button.addClass('active');

    if(loan_type.find('select').val() == "loan")
      loan_button.addClass('active');

    // Change loan type select box on loan type button clicks
    $(mortgage_button).click(function() {
      loan_type.find('select').val('mortgage').change();
      mortgage_button.addClass('active');
      loan_button.removeClass('active');
    });

    $(loan_button).click(function() {
      loan_type.find('select').val('loan').change();
      loan_button.addClass('active');
      mortgage_button.removeClass('active');
    });

    function togglePMI() {
      if(down_payment.find('input').val() >= 20) {
        pmi.find('input').attr('disabled', 'disabled');
      } else {
        pmi.find('input').removeAttr('disabled');
      }
    }

    function toggleLoanType() {

      if(loan_type.find('select').val() == "mortgage") {
        loan_amount.find('label').text('Purchase Price');
        down_payment.show();
        term.find('label').text('Mortgage Term');
        property_tax.show();
        property_insurance.show();
        pmi.show();
      } else if(loan_type.find('select').val() == "loan") {
        loan_amount.find('label').text('Loan Amount');
        down_payment.hide();
        term.find('label').text('Loan Term');
        property_tax.hide();
        property_insurance.hide();
        pmi.hide();
      }
    }
  }); // End Ready

  Drupal.behaviors.mortgage_calculation = {
    attach: function (context, settings) {
      drawVisualization(settings.mortgage_calculation.data);
    }
  };


  google.load('visualization', '1', {packages: ['corechart']});

  function drawVisualization(data) {
    // Create and populate the data table.
    var data_array = [];
    data_array.push(data.info.columns);


    for(var i=0; i<data.rows.length; i++) {
      if(data.info.loan_type == "mortgage")
        data_array.push([parseInt(data.rows[i].year), parseFloat(data.rows[i].principal), parseFloat(data.rows[i].interest), parseFloat(data.rows[i].additional), parseFloat(data.rows[i].balance)]);
      else if(data.info.loan_type == "loan")
        data_array.push([parseInt(data.rows[i].year), parseFloat(data.rows[i].principal), parseFloat(data.rows[i].interest), parseFloat(data.rows[i].balance)]);
    }

    var google_data = google.visualization.arrayToDataTable(data_array);

    var options = {
      width: '100%',
      height: 300,
      seriesType: "bars",
      isStacked: true,
      backgroundColor:{
        fill:'transparent'
      },
      vAxis:{
        baselineColor: 'transparent',
        gridlineColor: 'transparent',
        textPosition: 'none'
      },
      hAxis:{
        baselineColor: 'transparent',
        gridlineColor: 'transparent',
        format:'0000',
        /*slantedText: true,
        slantedTextAngle: 90,*/
      },
      chartArea:{
        left:0,top:20,width:"100%",height:"75%"
      },
      legend: {
        alignment: 'center',
      },
    };

    if(data.info.loan_type == "mortgage")
      options.series = {3: {type: "line", targetAxisIndex:1}};
    else if(data.info.loan_type == "loan")
      options.series = {2: {type: "line", targetAxisIndex:1}};

    var formatter = new google.visualization.NumberFormat({prefix: '$'});
    formatter.format(google_data, 1);
    formatter.format(google_data, 2);
    formatter.format(google_data, 3);
    if(data.info.loan_type == "mortgage")
      formatter.format(google_data, 4);

    var chart = new google.visualization.ComboChart(document.getElementById('visualization'));
    chart.draw(google_data, options);

    $(window).smartresize(function () {
       chart.draw(google_data, options);
    });
  }

})(jQuery, Drupal, this, this.document);
