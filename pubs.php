<!-- 
<span lang=EN-US style='font-size:15.0pt'><b>Publications</b><br><br></span>
-->
<?php
function myInclude($arg_1)
{
	$ch = curl_init();
	curl_setopt ($ch, CURLOPT_URL, $arg_1);
	curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
	$contents = curl_exec($ch);
	curl_close($ch);
  echo str_replace("Bongjun Kim","<strong>Bongjun Kim</strong>",$contents);
}

global $abs, $setselect, $rate;
extract($_GET);

if (!isset($setselect)){
	$setselect = "bongjun";
}

if (!isset($abs)){
	$abs = "0";
}

if (!isset($rate)){
	$rate = "1";
}

myInclude('http://corelab.postech.ac.kr/Pubs/pubs.php?setselect='.${setselect}.'&abs='.${abs}.'&rate='.${rate});

?>
