<?php

/* Récupère le contenu des bonnes pratiques Opquast */
$opquastPage = file_get_contents('./question.txt');

/* Récupère chaque bonne pratique*/
preg_match_all("/\|([^\n]*)/", $opquastPage, $title_content);
preg_match_all("/(\*[^\|]*)/", $opquastPage, $objectifs_content);

foreach ($title_content[1] as $key => $title) {
    /* Récupère le contenu des balises <p> (objectif)*/
    preg_match_all('/\*([^\n]+)/', $objectifs_content[1][$key], $objectifs);
    $opquastFormat[] = [
        'title' => $title,
        'objectifs' => $objectifs[1]
    ];
}


//open or create the file
$handle = fopen('resultsQuestion.json', 'w+');

//write the data into the file
fwrite($handle, json_encode($opquastFormat));

//close the file
fclose($handle);

?>

