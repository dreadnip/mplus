<?php

/* ========================================
                 Api routes
   ======================================== */

$app->get('/get_dungeon_list', function ($request, $response, $args) {
  $this->logger->info("Slim-Skeleton '/get_dungeon_list' route");
  $dungeons = get_dungeon_list();
  return json_encode($dungeons);
});

$app->get('/get_dungeon_data/{dungeon_id}', function ($request, $response, $args) {
  $this->logger->info("Slim-Skeleton '/get_dungeon_data' route");
  $dungeon_id = $args['dungeon_id'];
  $dungeon_data = get_dungeon_data($dungeon_id);
  return json_encode($dungeon_data);
});

/* ========================================
               Database interaction
   ======================================== */

function get_dungeon_list(){
	$db = new PDO("sqlite:".__DIR__ ."/../data/mplus.db");
	$stmt = "SELECT dg_id, dg_name FROM dungeons";
	$result = $db->query($stmt)->fetchAll(PDO::FETCH_ASSOC);
	$db = null;
	return $result;
}

function get_dungeon_data($dungeon_id){
	$db = new PDO("sqlite:".__DIR__ ."/../data/mplus.db");
	$stmt = $db->prepare("SELECT * FROM dungeons WHERE dg_id = :dungeon_id");
	$stmt->bindParam(':dungeon_id', $dungeon_id);
	$stmt->execute();

	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
	return $result[0];
	$db = null;
}
