<?php
function getdata($csvFile) {
    $file_handle = fopen($csvFile, 'r');
    while (!feof($file_handle) ) {
        $line_of_text[] = fgetcsv($file_handle, 1024);
    }
    fclose($file_handle);
    return $line_of_text;
}


//$cafes = [];
//$menus = [];
//$results = [];
//$j = -1;

$dong = ["", "나성동", "다정동", "대평동", "반곡동", "보람동", "새롬동", "소담동2", "소담동", "어진동", "한솔동"];

$converted = [];
for($i=1; $i<=10; $i++) {
    $converted = array_merge($converted, convert("$i.csv", $dong[$i]) );
}

//print_r($converted);




echo json_encode($converted);




function convert($csvFile, $dong) {



    $lines = getdata($csvFile);
    $j = -1;
    $cafes = [];
    $menus = [];


    for($i = 0; $i < count($lines); $i ++) {
        $line = $lines[$i];

        if ( isset($line[0]) && $line[0] != "" ) {
            $j ++;
            $cafes[$j] = $line;
            $menus = [];
        }
        if ( isset($line[7]) && $line[7] != "" ) {
            $menus[] = $line[7] . ":" . str_replace("\t", "", $line[8]);
        }

    }

    $results = [];
    for( $c = 0; $c < count($cafes); $c ++ ) {


        $results[$c]['no'] = $cafes[$c][0];
        $results[$c]['name'] = $cafes[$c][1];
        $results[$c]['phoneNumber'] = $cafes[$c][2];
        $results[$c]['address'] = $cafes[$c][3];
        $results[$c]['openingHours'] = $cafes[$c][4];
        $results[$c]['holidays'] = $cafes[$c][5];
        $results[$c]['lastOrder'] = $cafes[$c][6];
        $results[$c]['noOfTables'] = $cafes[$c][9];
        $results[$c]['parking'] = $cafes[$c][10] == '0';
        $results[$c]['wifi'] = $cafes[$c][11] == '0';
        $results[$c]['delivery'] = $cafes[$c][12] == '0';
        $results[$c]['kids'] = $cafes[$c][13] == '0';
        $results[$c]['dog'] = $cafes[$c][14] == '0';
        $results[$c]['amenities'] = $cafes[$c][15] ?? '';
        $results[$c]['menu'] = $menus;
        $results[$c]['area'] = $dong;
    }

    return $results;


}