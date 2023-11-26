const db = require(`../../helpers/database`);
const {v4: uuidv4} = require('uuid');

class EmployeeRepository {

    async findByID(organizationId, employeeId) {
        const params = {
            TableName: process.env.table,
            Key: {
                PK: `ORG#${organizationId}`,
                SK: `EMP#${employeeId}`
            }
        };

        return await db.get(params).promise();
    }

    async findAllByOrganizationId(organizationId) {
        const params = {
            TableName: process.env.table,
            KeyConditionExpression: 'PK = :PK and begins_with(SK, :SK)',
            ExpressionAttributeValues: {
                ':PK': `ORG#${organizationId}`,
                ':SK': 'EMP#'
            }
        };

        return await db.query(params).promise();
    }

    async findAllByProjectId(organizationId, projectId) {
        const params = {
            TableName: process.env.table,
            KeyConditionExpression: 'PK = :PK',
            ExpressionAttributeValues: {
                ':PK': `ORG#${organizationId}#PRO#${projectId}`,
            }
        };

        return await db.query(params).promise();
    }

    async create(organizationId, data) {
        const employeeId = uuidv4();

        const params = {
            TableName: process.env.table,
            Item: {
                PK: `ORG#${organizationId}`,
                SK: `EMP#${employeeId}`,
                Data: `EMP#${data.name}`,
                name: data.name,
                email: data.email
            }
        };

        await db.put(params).promise();

        return params.Item;
    }

    async update(organizationId, employeeId, data) {
        let updateExpression = 'set';
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};
    
        if (data?.name) {
            updateExpression += ' #name = :name,';
            expressionAttributeNames['#name'] = 'name';
            expressionAttributeValues[':name'] = data.name;
            updateExpression += ' #Data = :Data,';
            expressionAttributeNames['#Data'] = 'Data';
            expressionAttributeValues[':Data'] = `EMP#${data.name}`;
        }
    
        if (data?.email) {
            updateExpression += ' #email = :email,';
            expressionAttributeNames['#email'] = 'email';
            expressionAttributeValues[':email'] = data.email;
        }
    
        updateExpression = updateExpression.slice(0, -1);
    
        const params = {
            TableName: process.env.table,
            Key: {
                PK: `ORG#${organizationId}`,
                SK: `EMP#${employeeId}`,
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'UPDATED_NEW',
        };
    
        const update = await db.update(params).promise();
    
        return update.Attributes;
    }

    async deleteByID(organizationId, employeeId) {
        const params = {
            TableName: process.env.table,
            Key: {
                PK: `ORG#${organizationId}`,
                SK: `EMP#${employeeId}`,
            },
        };

        return await db.delete(params).promise();
    }

    async findAllByName(organizationId, name) {
        const params = {
            TableName: process.env.table,
            IndexName: process.env.filterByNameIndex,
            KeyConditionExpression: '#PK = :PK and begins_with(#SK, :SK)',
            ExpressionAttributeNames: {
                '#PK': 'PK',
                '#SK': 'Data',
            },
            ExpressionAttributeValues: {
              ':PK': `ORG#${organizationId}`,
              ':SK': `EMP#${name}`
            }
        }

        return await db.query(params).promise();
    }
}

module.exports = new EmployeeRepository();