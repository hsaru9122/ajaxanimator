<?php

function update_versions(){
$jdata = json_decode(get_string_between(file_get_contents("../../../js/version.js"),"/*START*/","/*STOP*/"),true);


$jdata["build"]++;
$jdata["date"] = microtime(true);

$json_enc = json_encode($jdata);


$json_version = "/*Auto-Generated Ajax Animator Version config (Markup Version II)*/
/*Generated By versions.php in /server/dev/compile/*/
Ax.set_version( /*START*/
$json_enc
/*STOP*/ )
/*End Of File*/
";

file_put_contents("../../../js/version.js",$json_version);

echo "\nVersion: ",$jdata["release"]," build ", $jdata["build"],"\n";

return $jdata["release"].".build"+$jdata["build"];
}

?>