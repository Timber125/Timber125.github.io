<?php

if(isset($_POST["func"])){
$func = ($_POST["func"]);



switch($func){
    case 'post_msg':
        if (isset ($_POST["name"]) && isset ($_POST["msg"])){
            $nickname = htmlspecialchars($_POST["name"]);
            $message = htmlspecialchars($_POST["msg"]);
            // Write the contents to the file, 
            // using the FILE_APPEND flag to append the content to the end of the file
            // and the LOCK_EX flag to prevent anyone else writing to the file at the same time
            file_put_contents("chatlog.data", $nickname . "-" . $message . "\r\n", FILE_APPEND /*| LOCK_EX*/);
        }else{
            echo "You didn't use POST method to post your message, or parameters are missing (<name> <msg>)";
        }
        break;
    case 'poll_msg':
        if (isset ($_POST["counter"])){
            /*
            $counter = ctype_digit($_POST["counter"]) ? intval($_POST["counter"]) : null;
            if ($counter === null){
                // $counter wasn't all numeric
                echo "You silly, that chatlog-counter for polling the chatlog is not a number! (<counter>)";
            }else{
             */
                $counter = $_POST["counter"];
                // $counter is numeric
                // Lock the file exclusively to prevent race condition on file contents
                $file = "chatlog.data";
              
                //$fn = fopen($file,"r"/*, LOCK_EX*/);
                $ic = 0;
                $result = "";
                $flag_result_append = false;
                // Read file line by line, result = from line $counter to eof
                $fh = fopen($file,'r');
                while ($line = fgets($fh)) {
                    if($ic == $counter){ $flag_result_append = true; }
                    $ic ++;
                    if($flag_result_append){
                        $result .= $line . "\r\n";
                    }
                }
                fclose($fh);
                // return result
                echo $result;
            //}
        }else{
            echo "You didn't pass your chatlog-counter while polling the chatlog! (<counter>)";
        }
        break;
    case 'init':
        // Don't lock: if lock is present, DDOS possible by posting lots of 'inits'
        // exploiting race condition on the lock on the file
        $file = "chatlog.data";
        $ic = 0;
        // Read file line by line, result = from line $counter to eof
        $fh = fopen($file,'r');
                while ($line = fgets($fh)) {
                    $ic ++;
                }
        fclose($fh);
        // return line count
        echo $ic;
        break;
    default:
        echo "Posted without function, you 1337 hacker ;)";
        break;
}
}else{
    echo "Posted without function, you 1337 hacker ;)";
}        
?>