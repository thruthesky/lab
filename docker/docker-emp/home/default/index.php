<?php
header('HTTP/1.0 404 Not Found', true, 404);
exit;
?>
<p style="text-align: center;">
http host: <?php echo $_SERVER['HTTP_HOST'] . '<hr>'; ?><br>
file path: /Users/thruthesky/docker/docker-emp/home/default
</p>
<?php
phpinfo();
