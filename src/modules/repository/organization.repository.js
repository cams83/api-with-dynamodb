const db = require(`../../helpers/database`);
const {v4: uuidv4} = require('uuid');

class OrganizationRepository {
    async findByID(organizationId) {
        const params = {
            TableName: process.env.table,
            Key: {
                PK: `ORG#${organizationId}`,
                SK: `#METADATA#${organizationId}`
            }
        };

        return await db.get(params).promise();
    }

    async create(data) {
        const org_id = uuidv4();

        const params = {
            TableName: process.env.table,
            Item: {
                PK: `ORG#${org_id}`,
                SK: `#METADATA#${org_id}`,
                name: data.name,
                tier: data.tier,
                org_id
            }
        };

        await db.put(params).promise();

        return params.Item;
    }

    async update(organizationId, data) {
        let updateExpression = 'set';
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};
    
        if (data?.name) {
            updateExpression += ' #name = :name,';
            expressionAttributeNames['#name'] = 'name';
            expressionAttributeValues[':name'] = data.name;
        }
    
        if (data?.tier) {
            updateExpression += ' #tier = :tier,';
            expressionAttributeNames['#tier'] = 'tier';
            expressionAttributeValues[':tier'] = data.tier;
        }
    
        updateExpression = updateExpression.slice(0, -1);
    
        const params = {
            TableName: process.env.table,
            Key: {
                PK: `ORG#${organizationId}`,
                SK: `#METADATA#${organizationId}`,
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'UPDATED_NEW',
        };
    
        const update = await db.update(params).promise();
    
        return update.Attributes;
    }

    async deleteByID(organizationId) {
        const params = {
            TableName: process.env.table,
            Key: {
                PK: `ORG#${organizationId}`,
                SK: `#METADATA#${organizationId}`,
            },
        };

        return await db.delete(params).promise();
    }
}

module.exports = new OrganizationRepository();