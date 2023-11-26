const db = require(`../../helpers/database`);
const {v4: uuidv4} = require('uuid');

class ProjectRepository {
    async findByID(organizationId, type, projectId) {
        const params = {
            TableName: process.env.table,
            Key: {
                PK: `ORG#${organizationId}`,
                SK: `PRO#${type}#${projectId}`
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
                ':SK': 'PRO#'
            }
        };

        return await db.query(params).promise();
    }

    async findAllByType(organizationId, type) {
        const params = {
            TableName: process.env.table,
            KeyConditionExpression: 'PK = :PK and begins_with(SK, :SK)',
            ExpressionAttributeValues: {
                ':PK': `ORG#${organizationId}`,
                ':SK': `PRO#${type}#`
            }
        };

        return await db.query(params).promise();
    }

    async findAllByEmployeeId(organizationId, employeeId) {
        const params = {
            TableName: process.env.table,
            IndexName: process.env.projectEmployeeIndex,
            KeyConditionExpression: 'SK = :SK',
            ExpressionAttributeValues: {
                ':SK': `ORG#${organizationId}#EMP#${employeeId}`,
            }
        };

        return await db.query(params).promise();
    }

    async create(organizationId, data) {
        const projectId = uuidv4();

        const params = {
            TableName: process.env.table,
            Item: {
                PK: `ORG#${organizationId}`,
                SK: `PRO#${data.type}#${projectId}`,
                Data: `PRO#${data.name}`,
                name: data.name,
                project_id: projectId,
            }
        };

        await db.put(params).promise();

        return params.Item;
    }   

    async update(organizationId, type, projectId, data) {
        let updateExpression = 'set';
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};
    
        if (data?.name) {
            updateExpression += ' #name = :name,';
            expressionAttributeNames['#name'] = 'name';
            expressionAttributeValues[':name'] = data.name;
            updateExpression += ' #Data = :Data,';
            expressionAttributeNames['#Data'] = 'Data';
            expressionAttributeValues[':Data'] = `PRO#${data.name}`;
        }    
    
        updateExpression = updateExpression.slice(0, -1);
    
        const params = {
            TableName: process.env.table,
            Key: {
                PK: `ORG#${organizationId}`,
                SK: `PRO#${type}#${projectId}`,
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'UPDATED_NEW',
        };
    
        const update = await db.update(params).promise();
    
        return update.Attributes;
    }

    async deleteByID(organizationId, type, projectId) {
        const params = {
            TableName: process.env.table,
            Key: {
                PK: `ORG#${organizationId}`,
                SK: `PRO#${type}#${projectId}`,
            },
        };

        return await db.delete(params).promise();
    }

    async assignEmployee(organizationId, projectId, data) {
        const params = {
            TableName: process.env.table,
            Item: {
                PK: `ORG#${organizationId}#PRO#${projectId}`,
                SK: `ORG#${organizationId}#EMP#${data.employeeId}`,
                name: data.employeeName,
                project: data.projectName,
                date_of: data.dateOf,
            }
        };

        await db.put(params).promise();

        return params.Item;
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
              ':SK': `PRO#${name}`
            }
        }

        return await db.query(params).promise();
    }
}

module.exports = new ProjectRepository();