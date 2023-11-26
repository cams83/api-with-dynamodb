# Example of API using DynamoDB

## Step-by-step Guide to Run API using DynamoDB

### 1. Create DynamoDB Table
```sh
aws dynamodb create-table \
    --table-name 'happy-projects' \
    --attribute-definitions \
        AttributeName=PK,AttributeType=S \
        AttributeName=SK,AttributeType=S \
    --key-schema \
        AttributeName=PK,KeyType=HASH \
        AttributeName=SK,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --table-class STANDARD

aws dynamodb wait table-exists --table-name 'happy-projects'
```
### 2. Create Global Secondary Index - Project-Employee-Index
```sh    
aws dynamodb update-table \
    --table-name 'happy-projects' \
    --attribute-definitions \
        AttributeName=PK,AttributeType=S \
        AttributeName=SK,AttributeType=S \
    --global-secondary-index-updates \
        "[{\"Create\":{\"IndexName\": \"Project-Employee-Index\", \"KeySchema\": [{\"AttributeName\": \"SK\", \"KeyType\": \"HASH\"}, {\"AttributeName\": \"PK\", \"KeyType\": \"RANGE\"}], \
        \"Projection\": {\"ProjectionType\": \"ALL\"}, \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 1, \"WriteCapacityUnits\": 1}}}]"

while true; do
    status=$(aws dynamodb describe-table --table-name 'happy-projects' --query 'Table.GlobalSecondaryIndexes[0].IndexStatus' --output text)
    
    if [ "$status" == "ACTIVE" ]; then
        echo "Index creation completed."
        break
    elif [ "$status" == "CREATING" ]; then
        echo "Index creation is still in progress. Waiting..."
        sleep 10  # Wait for 10 seconds before checking again
    else
        echo "Index creation failed or encountered an error."
        break
    fi
done
```
### 3. Create Another Global Secondary Index - Filter-by-name
```sh     
aws dynamodb update-table \
    --table-name 'happy-projects' \
    --attribute-definitions \
        AttributeName=PK,AttributeType=S \
        AttributeName=Data,AttributeType=S \
    --global-secondary-index-updates \
        "[{\"Create\":{\"IndexName\": \"Filter-by-name\", \"KeySchema\": [{\"AttributeName\": \"PK\", \"KeyType\": \"HASH\"}, {\"AttributeName\": \"Data\", \"KeyType\": \"RANGE\"}], \
        \"Projection\": {\"ProjectionType\": \"ALL\"}, \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 1, \"WriteCapacityUnits\": 1}}}]"

while true; do
    status=$(aws dynamodb describe-table --table-name 'happy-projects' --query 'Table.GlobalSecondaryIndexes[0].IndexStatus' --output text)
    
    if [ "$status" == "ACTIVE" ]; then
        echo "Index creation completed."
        break
    elif [ "$status" == "CREATING" ]; then
        echo "Index creation is still in progress. Waiting..."
        sleep 10  # Wait for 10 seconds before checking again
    else
        echo "Index creation failed or encountered an error."
        break
    fi
done
```
### 4. Download and Run the Project
> Note: Remember to replace placeholder values like `$YOUR_DIR` with your actual values. This guide sets up the DynamoDB table, creates global secondary indexes, and demonstrates API operations.
```sh
cd $YOUR_DIR
git clone https://github.com/cams83/api-with-dynamodb.git

cd $YOUR_DIR/api-with-dynamodb
yarn install
yarn start
```
### 5. Perform API Operations
Use the following commands to interact with the API:
```sh
org_id1=$(curl --request POST --url http://localhost:3000/api/v1/organizations --header 'Content-Type: application/json' --data '{"name": "Happy Inc", "tier": "free-tier"}' | jq -r '.org_id')
org_id2=$(curl --request POST --url http://localhost:3000/api/v1/organizations --header 'Content-Type: application/json' --data '{"name": "ABC Inc", "tier": "professional"}' | jq -r '.org_id')

employee_id11=$(curl --request POST --url "http://localhost:3000/api/v1/employees/$org_id1" --header 'Content-Type: application/json' --data '{"name": "John Doe", "email": "john@test.com"}' | jq -r '.employee_id')
employee_id12=$(curl --request POST --url "http://localhost:3000/api/v1/employees/$org_id1" --header 'Content-Type: application/json' --data '{"name": "Jane Doe", "email": "jane@test.com"}' | jq -r '.employee_id')
employee_id13=$(curl --request POST --url "http://localhost:3000/api/v1/employees/$org_id1" --header 'Content-Type: application/json' --data '{"name": "Manoj Fernando", "email": "manojf@test.com"}' | jq -r '.employee_id')

project_id11=$(curl --request POST --url "http://localhost:3000/api/v1/projects/$org_id1" --header 'Content-Type: application/json' --data '{"name": "Project X", "type": "agile"}' | jq -r '.project_id')
project_id12=$(curl --request POST --url "http://localhost:3000/api/v1/projects/$org_id1" --header 'Content-Type: application/json' --data '{"name": "Project Y", "type": "agile"}' | jq -r '.project_id')
project_id13=$(curl --request POST --url "http://localhost:3000/api/v1/projects/$org_id1" --header 'Content-Type: application/json' --data '{"name": "Project F1", "type": "fixed-bid"}' | jq -r '.project_id')
project_id21=$(curl --request POST --url "http://localhost:3000/api/v1/projects/$org_id2" --header 'Content-Type: application/json' --data '{"name": "Project B", "type": "agile"}' | jq -r '.project_id')
project_id22=$(curl --request POST --url "http://localhost:3000/api/v1/projects/$org_id2" --header 'Content-Type: application/json' --data '{"name": "Project A", "type": "fixed-bid"}' | jq -r '.project_id')

curl --request PUT --url "http://localhost:3000/api/v1/projects/$org_id1/fixed-bid/$project_id13/assign/$employee_id12" | jq
curl --request PUT --url "http://localhost:3000/api/v1/projects/$org_id1/agile/$project_id12/assign/$employee_id12" | jq
curl --request PUT --url "http://localhost:3000/api/v1/projects/$org_id1/agile/$project_id11/assign/$employee_id13" | jq
curl --request PUT --url "http://localhost:3000/api/v1/projects/$org_id1/agile/$project_id11/assign/$employee_id12" | jq

curl --request GET --url "http://localhost:3000/api/v1/organizations/$org_id1" | jq
curl --request GET --url "http://localhost:3000/api/v1/organizations/$org_id2" | jq
curl --request GET --url "http://localhost:3000/api/v1/organizations/wrong" | jq

curl --request GET --url "http://localhost:3000/api/v1/employees/$org_id1" | jq
curl --request GET --url "http://localhost:3000/api/v1/employees/$org_id1/project/$project_id13" | jq
curl --request GET --url "http://localhost:3000/api/v1/employees/$org_id1/project/$project_id12" | jq
curl --request GET --url "http://localhost:3000/api/v1/employees/$org_id1/project/$project_id11" | jq
curl --request GET --url "http://localhost:3000/api/v1/employees/$org_id1/$employee_id12" | jq
curl --request GET --url "http://localhost:3000/api/v1/employees/$org_id1/$employee_id13" | jq
curl --request GET --url "http://localhost:3000/api/v1/employees/$org_id1/$employee_id11" | jq
curl --request GET --url "http://localhost:3000/api/v1/employees/$org_id1/wrong" | jq
curl --request GET --url "http://localhost:3000/api/v1/employees/$org_id2" | jq

curl --request GET --url "http://localhost:3000/api/v1/projects/$org_id1" | jq
curl --request GET --url "http://localhost:3000/api/v1/projects/$org_id1/type/agile" | jq
curl --request GET --url "http://localhost:3000/api/v1/projects/$org_id1/type/fixed-bid" | jq
curl --request GET --url "http://localhost:3000/api/v1/projects/$org_id1/employee/$employee_id12" | jq
curl --request GET --url "http://localhost:3000/api/v1/projects/$org_id1/employee/$employee_id13" | jq
curl --request GET --url "http://localhost:3000/api/v1/projects/$org_id1/agile/$project_id11" | jq
curl --request GET --url "http://localhost:3000/api/v1/projects/$org_id1/agile/$project_id12" | jq
curl --request GET --url "http://localhost:3000/api/v1/projects/$org_id1/fixed-bid/$project_id13" | jq
curl --request GET --url "http://localhost:3000/api/v1/projects/$org_id1/agile/wrong" | jq

curl --request GET --url "http://localhost:3000/api/v1/projects/$org_id2" | jq
curl --request GET --url "http://localhost:3000/api/v1/projects/$org_id2/agile/$project_id21" | jq
curl --request GET --url "http://localhost:3000/api/v1/projects/$org_id2/agile/$project_id22" | jq
```