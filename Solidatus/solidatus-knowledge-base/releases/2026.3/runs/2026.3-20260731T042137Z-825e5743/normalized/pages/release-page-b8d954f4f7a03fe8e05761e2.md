# MongoDB

The Solidatus MongoDB Connector application is a Java based tool that connects to a MongoDB instance to extract collection and database metadata to create a Solidatus model which displays databases as layers, collections as objects and the structure of the JSON document under the collection object.

## Usage

Currently, the MongoDB connector only runs in Standalone mode. Standalone mode runs a singular instance of the Connector with supplied config and publishes the model.

Configuration can be set in either a `{}.yml` file as presented in `config-template.yml`. Alternatively the configuration can be passed in as command line parameters to the MongoDB Connector JAR file. If using both methods the command line arguments will overwrite the configuration `.yml` file.

### Standalone Mode

**Description**

Running the MongoDB Connector in Standalone mode will run one execution of the Connector with the specified configuration options and then stop. The output model will be named and published to the host Solidatus site according to the configuration options provided as command line parameters. Any command line arguments not passed will be set to default arguments (Null or empty).

**Example**

Command line execution example for MongoDB:

```bash
java -jar target/solidatus-mongodb-0.0.2-SNAPSHOT.jar \
--spring.profiles.active="standalone" \
--spring.data.mongodb.uri=mongodb://username:password@hostname:port/dbname[?authSource=admin] \
--solidatus.mongodb.databases=local,admin,mydb \
--solidatus.api.host={$SOLIDATUS_HOST}\
--solidatus.api.token={$SOLIDATUS_TOKEN} \
--solidatus.api.model-name="MongoDB Model"
```
