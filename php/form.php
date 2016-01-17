<?php
/************  CONFIG  ******************/
$_SETTINGS['send_to_email']=true;  // true/false to send data on email or 'gdocs' to store data in Google.Docs
$_SETTINGS['store_to_gdocs']=false;  // true/false to store data in Google.Docs Spreadsheet
$_SETTINGS['store_to_mailchimp']=false;  // true/false to store submitted emails to your MailChimp List

// Email Settings
$_SETTINGS['email']['address']='your@mail.com'; // Email to receive data
$_SETTINGS['email']['from']='noreply@landingpage.com'; // "from: email" field in message
$_SETTINGS['email']['fromName']='theForm Landing Page'; // "from: name" field in message
$_SETTINGS['email']['subject']='Form filled on landing page'; // message subject

// Google.Docs Settings
$_SETTINGS['gdocs']['user'] = "user@gmail.com"; // username for google account
$_SETTINGS['gdocs']['password'] = "password"; // password for google account
$_SETTINGS['gdocs']['spreadsheet_name'] = "Landing Spreadsheet"; // Spreadsheet Name
$_SETTINGS['gdocs']['worksheet_name'] = "Sheet1"; // Worksheet Name

// MailChimp Settings
$_SETTINGS['mailchimp']['apikey']='YOUR-MAILCHIMP-APIKEY'; // API Key - see http://admin.mailchimp.com/account/api
$_SETTINGS['mailchimp']['listId']='LIST-UNIQUE-ID'; // Login to MC account, go to Lists, then List Settings, and look for the List ID entry at the bottom of the page (unique id for list ...)
$_SETTINGS['email_field_name']='Email';  // name of the input with Email. If the name "fields[Email]" enter "Email"
$_SETTINGS['first_name_field_name']='';  // name of the input with First Name. If the name "fields[Name]" enter "Name". If there is no First Name field in your form, leave this value empty.
$_SETTINGS['last_name_field_name']='';  // name of the input with Last Name. If the name "fields[LName]" enter "LName". If there is no Last Name field in your form, leave this value empty.

/****************************************/
if(@$_POST['site'] != 1)
	die(); // antispam

$ret=array('error'=>0);

/**************** EMAIL method ************************/
if($_SETTINGS['send_to_email'])
{
	include_once("phpMailer/class.phpmailer.php");

	$mail = new PHPMailer(); // defaults to using php "mail()"
	
	$body             = '<body><h1>'.$_SETTINGS['email']['subject'].'</h1><table border="0">';
	$body .='<tr valign="top"><td>Date:</td><td>'.date("m/d/Y H:i").'</td></tr>';
	foreach($_POST['fields'] as $k=>$v)
		$body.='<tr valign="top"><td>'.$k.':</td><td>'.str_replace("\n",'<br>',$v).'</td></tr>';
	$body .='</table></body>';
	$body             = eregi_replace("[\]",'',$body);
	
	$mail->From       = $_SETTINGS['email']['from'];
	$mail->FromName   = $_SETTINGS['email']['fromName'];
	$mail->Subject    = $_SETTINGS['email']['subject'];
	$mail->AltBody    = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test
	$mail->MsgHTML($body);
	$mails=explode(',',$_SETTINGS['email']['address']);
	foreach($mails as $v)
		$mail->AddAddress(trim($v));

	if(!$mail->Send())
	  $ret['error']=1;

}

/**************** GOOGLE.DOCS method ************************/
if($_SETTINGS['store_to_gdocs'])
{
	include_once("GoogleSpreadsheet/Google_Spreadsheet.php");

	$ss = new Google_Spreadsheet($_SETTINGS['gdocs']['user'],$_SETTINGS['gdocs']['password']);
	$ss->useSpreadsheet($_SETTINGS['gdocs']['spreadsheet_name']);
	$ss->useWorksheet($_SETTINGS['gdocs']['worksheet_name']);

	$row = array 
	(
		"Date" => date("m/d/Y H:i"),
	);
	
	foreach($_POST['fields'] as $k=>$v)
		$row[$k]=$v;
	
	if(!$ss->addRow($row))
		$ret['error']=1;
}

/**************** MailChimp method ************************/
if($_SETTINGS['store_to_mailchimp'])
{
	if(@$_POST['fields'][$_SETTINGS['email_field_name']] && $_SETTINGS['mailchimp']['apikey'] && $_SETTINGS['mailchimp']['listId'])
	{
		include_once 'mailChimp/MCAPI.class.php';
			
		$MCAPI = new MCAPI($_SETTINGS['mailchimp']['apikey']);
	
		$arr=array('EMAIL'=>$_POST['fields'][$_SETTINGS['email_field_name']]);
		if($_SETTINGS['first_name_field_name'])
			$arr['FNAME']=@$_POST['fields'][$_SETTINGS['first_name_field_name']];
		if($_SETTINGS['last_name_field_name'])
			$arr['LNAME']=@$_POST['fields'][$_SETTINGS['last_name_field_name']];
			
		$MCAPI_batch[] = $arr;
		
		$MCAPI_optin = true; //yes, send optin emails
		$MCAPI_up_exist = true; // yes, update currently subscribed users
		$MCAPI_replace_int = false; // no, add interest, don't replace
		
		$MCAPI_vals = $MCAPI->listBatchSubscribe($_SETTINGS['mailchimp']['listId'], $MCAPI_batch, $MCAPI_optin, $MCAPI_up_exist, $MCAPI_replace_int);
		
		if($MCAPI->errorCode)
		  $ret['error']=1;
	}
	else
		$ret['error']=1;
}

header('Content-type: application/json; charset=utf-8');
header('Cache-Control: no-cache');
echo json_encode($ret);

?>