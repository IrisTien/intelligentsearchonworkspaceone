https://neo4j.com/developer/docker-run-neo4j/
docker run \
    --name testneo4j \
    -p7474:7474 -p7687:7687 \
    -d \
    -v $HOME/neo4j/data:/data \
    -v $HOME/neo4j/logs:/logs \
    -v $HOME/neo4j/import:/var/lib/neo4j/import \
    -v $HOME/neo4j/plugins:/plugins \
    --env NEO4J_AUTH=neo4j/test \
    neo4j:latest

sed 's/dbms.directories.import/#dbms.directories.import/' ./neo4j.conf > ./neo4j.conf.changed && mv ./neo4j.conf.changed ./neo4j.conf




https://neo4j.com/developer/javascript/


https://www.nltk.org/install.html
http://www.nltk.org/data.html