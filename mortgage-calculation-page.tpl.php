<?php

/**
 * @file
 * Default implementation of a mortgage calculator result template.
 *
 * Available variables:
 * - $rows: A rows array as used by theme_table(), containing calculation result per month/year
 * - $row['number_of_payments']: number of payments
 * - $row['payment']: annual payment
 *
 *
 * @see template_preprocess()
 * @see template_process()
 */

  // Add money formatting to rows
  foreach($rows as &$row) {
    if(isset($row['principal']))  $row['principal']  = "$".number_format($row['principal'], 0, '', ',');
    if(isset($row['interest']))   $row['interest']   = "$".number_format($row['interest'], 0, '', ',');
    if(isset($row['additional'])) $row['additional'] = "$".number_format($row['additional'], 0, '', ',');
    if(isset($row['balance']))    $row['balance']    = "$".number_format($row['balance'], 0, '', ',');
  }

  // Add summary row
  $rows[] = array('Totals', "$".number_format($info['total_principal'], 0, '', ','), "$".number_format($info['total_interest'], 0, '', ','), "$".number_format($info['total_additional'], 0, '', ','), ' ');

  if ($info['pmi_end_date']) {
    $has_pmi = true;
  } else {
    $has_pmi = false;
  }

?>

<div class="print-title"><?php echo $info['calculation_title']; ?></div>

<div class="payment-info <?php echo ($has_pmi ? 'has-pmi' : 'no-pmi'); ?>">
  <?php if($has_pmi): ?>
    <div class="payment-pmi equalheight"><div class="value"><?php echo "$".number_format($info['total_payment_with_pmi'], 2, '.', ','); ?></div><div class="description">Total monthly payment until <?php echo $info['pmi_end_date']; ?></div></div>
    <div class="payment equalheight"><div class="value"><?php echo "$".number_format($info['total_payment'], 2, '.', ','); ?></div><div class="description">Total monthly payment after <?php echo $info['pmi_end_date']; ?></div></div>
  <?php else: ?>
    <div class="payment equalheight"><div class="value"><?php echo "$".number_format($info['total_payment'], 2, '.', ','); ?></div><div class="description">Total monthly payment</div></div>
  <?php endif; ?>
  <div class="total_payments equalheight"><div class="value"><?php echo "$".number_format($info['total_paid'], 2, '.', ','); ?></div><div class="description">Total of <?php echo $info['number_of_payments']; ?> payments</div></div>
  <div class="payoff equalheight"><div class="value"><?php echo $info['payoff_date']; ?></div><div class="description">Pay-off date</div></div>
</div>

<?php
  $block = block_load('block',13);
  $output = _block_get_renderable_array(_block_render_blocks(array($block)));
  print render($output);
?>

<div id="visualization"></div>
<div class="mortgage-calculator">
  <?php print theme('table', array('header' => $info['columns'], 'rows' => $rows, 'sticky' => false, 'attributes' => array('class' => array('mortgage-calculator-table', 'responsive')))); ?>
</div>

<a href="javascript:window.print()" class="button link print"><div class="wrapper">Print</div></a>

<div class="print-disclaimer">
  <?php
    $block = block_load('block',14);
    $output = _block_get_renderable_array(_block_render_blocks(array($block)));
    print $output['block_14']['#markup'];
  ?>
</div>

