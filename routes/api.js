
/*
Import des composants de la route
*/
    // Class
    var express = require('express');
    var router = express.Router();
    const bodyParser = require('body-parser');

    // Module
    const mongodb = require('mongodb');
    const ObjectId = mongodb.ObjectID;
    const MongoClient = mongodb.MongoClient;
    const mongodbUrl = process.env.MONGO_HOST;

    // Middleware
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(bodyParser.json());
// 


/*
Définition des routes
*/
    // Afficher les tâches
    router.get('/tasks', (req, res) => {
        // Ouvrir une connexion sur la base MongoDb
        MongoClient.connect(process.env.MONGO_HOST, (err, client) =>{
            const db = client.db(process.env.MONGO_DBNAME)
            // Tester la connexion
            if(err){ res.send(err); client.close(); } 
            else{

                // Ajouter un document dans la collection 'list' => insert
                db.collection(process.env.MONGO_COLNAME).find().toArray((err, tasks) => {

                    // Vérification de a commande MongoDb
                    if(err){ res.send(err) } 
                    else{
                        res.send(tasks)
                        // Fermer la connexion à la base MongoDb
                        client.close()
                    };
                });
            };
        });
    });
    
    // Ajouter une tâche
    router.post('/add-task', (req, res) => {
        // Récupération des données depuis la requête
        let task = req.body;

        // Vérifier la présence de valeur dans la requête
        if(!task.content){ res.status(400); res.json({ "error": "Bad Data" });
        } else {

            // Définition de la propriété isDone
            task.state = false;

            // Ouvrir une connexion sur la base MongoDb
            MongoClient.connect(process.env.MONGO_HOST, (err, client) =>{
                const db = client.db(process.env.MONGO_DBNAME)
                // Tester la connexion
                if(err){ res.send(err); client.close(); } 
                else{

                    // Ajouter un document dans la collection 'list' => insert
                    db.collection(process.env.MONGO_COLNAME).insert([task], (err, data) => {

                        // Vérification de a commande MongoDb
                        if(err){ res.send(err) } 
                        else{
                            res.send(task)
                            // Fermer la connexion à la base MongoDb
                            client.close()
                        };
                    });
                };
            });
        };
    });

    // Supprimer une tâche
    router.delete('/delete-task/:id', (req, res) => {

        // Ouvrir une connexion sur la base MongoDb
        MongoClient.connect(`${process.env.MONGO_HOST}`, (err, client) =>{
            const db = client.db(`${process.env.MONGO_DBNAME}`)

            // Tester la connexion
            if(err){ res.send(err) } 
            else{
                db.collection(process.env.MONGO_COLNAME, (err, tasks)=>{
                    // Suppriumer la tâche
                    tasks.deleteOne({ _id: new ObjectId(req.params.id) });

                    // Vérification de la commande MongoDb
                    if(err){  res.send({ msg:false }) } 
                    else{
                        res.send( { msg:true } )
                        // Fermer la connexion à la base MongoDb
                        client.close()
                    }
                })
            }            
        })
    });
//

/*
Exporter le module de route
*/
    module.exports = router;
//