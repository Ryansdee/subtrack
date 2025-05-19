<?php
require 'vendor/autoload.php';

use Google\Client;

function getFirestoreSubscriptions($uid, $projectId, $serviceAccountJsonPath) {
    // Initialisation client Google
    $client = new Client();
    $client->setAuthConfig($serviceAccountJsonPath);
    $client->addScope('https://www.googleapis.com/auth/datastore');

    // Récupération token OAuth2
    $tokenArray = $client->fetchAccessTokenWithAssertion();
    if (isset($tokenArray['error'])) {
        throw new Exception('Erreur d\'authentification Google : ' . $tokenArray['error_description']);
    }
    $accessToken = $tokenArray['access_token'];

    // URL API Firestore REST pour récupérer les subscriptions d'un user
    $url = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/users/$uid/subscriptions";

    // Requête HTTP GET avec le Bearer token
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $accessToken",
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);

    if(curl_errno($ch)) {
        throw new Exception('Erreur CURL : ' . curl_error($ch));
    }
    curl_close($ch);

    // Décodage JSON réponse
    $data = json_decode($response, true);

    if (isset($data['error'])) {
        throw new Exception('Erreur API Firestore : ' . $data['error']['message']);
    }

    // Extraction simplifiée des subscriptions
    $subscriptions = [];
    if (isset($data['documents'])) {
        foreach ($data['documents'] as $doc) {
            $fields = $doc['fields'];
            $subscriptions[] = [
                'name' => $fields['name']['stringValue'] ?? '',
                'price' => floatval($fields['price']['doubleValue'] ?? 0),
                'billingDate' => $fields['billingDate']['stringValue'] ?? null,
            ];
        }
    }

    return $subscriptions;
}

// Exemple d'utilisation

try {
    $projectId = 'ton-projet-firebase';  // Remplace par ton projet
    $uid = 'uid_de_l_utilisateur';       // Remplace par l'UID du user
    $serviceAccountJson = __DIR__ . '/service-account.json';

    $subs = getFirestoreSubscriptions($uid, $projectId, $serviceAccountJson);

    print_r($subs);

    // Ici, tu peux parcourir $subs, vérifier les dates et envoyer un mail via PHPMailer ou autre

} catch (Exception $e) {
    echo "Erreur : " . $e->getMessage();
}
