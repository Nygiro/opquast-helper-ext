<?php

/* Récupère le contenu des bonnes pratiques Opquast */
$opquastPage = file_get_contents('https://www.opquast.com/qualite-web-opquast/');

/* Récupère chaque bonne pratique*/
preg_match_all("/<span class=\"bp-label\">(.+)<\/span>/iU", $opquastPage, $title_table);
/* Récupère le bloc des objectifs des bonnes pratiques*/
preg_match_all("/<dd class=\"op_data_objectif\">(<p>.+<\/p>)<\/dd>/iU", $opquastPage, $objectifContent);

$opquastFormat = [];
foreach ($title_table[1] as $key => $title) {
    /* Récupère le contenu des balises <p> (objectif)*/
    preg_match_all("/<p>([^<]*)<\/p>/iU", $objectifContent[0][$key], $objectifPratique);
    $opquastFormat[] = [
        'title' => $title,
        'objectifs' => $objectifPratique[1]
    ];
}


//open or create the file
$handle = fopen('results.json', 'w+');

//write the data into the file
fwrite($handle, json_encode($opquastFormat));

//close the file
fclose($handle);

?>

