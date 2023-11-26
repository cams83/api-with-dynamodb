const db = require(`../../helpers/database`);
const {v4: uuidv4} = require('uuid');

class EmployeeRepository {
    constructor() {
        this.tableName = 'happy-projects';
        this.filterByNameIndex = 'Filter-by-name';
    }

    async findByID(organizationId, employeeId) {
        const params = {
            TableName: this.tableName,
            Key: {
                PK: this.getOrganizationPK(organizationId),
                SK: this.getEmployeeSK(employeeId)
            }
        };

        return await db.get(params).promise();
    }

    async findAllByOrganizationId(organizationId) {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: 'PK = :PK and begins_with(SK, :SK)',
            ExpressionAttributeValues: {
                ':PK': this.getOrganizationPK(organizationId),
                ':SK': 'EMP#'
            }
        };

        return await db.query(params).promise();
    }

    async findAllByProjectId(organizationId, projectId) {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: 'PK = :PK',
            ExpressionAttributeValues: {
                ':PK': `${this.getOrganizationAndProjectPK(organizationId, projectId)}`,
            }
        };

        return await db.query(params).promise();
    }

    async create(organizationId, data) {
        const employeeId = uuidv4();

        const params = {
            TableName: this.tableName,
            Item: {
                PK: this.getOrganizationPK(organizationId),
                SK: this.getEmployeeSK(employeeId),
                Data: this.getData(data.name),
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
            expressionAttributeValues[':Data'] = this.getData(data.name);
        }
    
        if (data?.email) {
            updateExpression += ' #email = :email,';
            expressionAttributeNames['#email'] = 'email';
            expressionAttributeValues[':email'] = data.email;
        }
    
        updateExpression = updateExpression.slice(0, -1);
    
        const params = {
            TableName: this.tableName,
            Key: {
                PK: this.getOrganizationPK(organizationId),
                SK: this.getEmployeeSK(employeeId),
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
            TableName: this.tableName,
            Key: {
                PK: this.getOrganizationPK(organizationId),
                SK: this.getEmployeeSK(employeeId),
            },
        };

        return await db.delete(params).promise();
    }

    async findAllByName(organizationId, name) {
        const params = {
            TableName: this.tableName,
            IndexName: this.filterByNameIndex,
            KeyConditionExpression: '#PK = :PK and begins_with(#SK, :SK)',
            ExpressionAttributeNames: {
                '#PK': 'PK',
                '#SK': 'Data',
            },
            ExpressionAttributeValues: {
              ':PK': this.getOrganizationPK(organizationId),
              ':SK': this.getData(name)
            }
        }

        return await db.query(params).promise();
    }

    getOrganizationPK(organizationId) {
        return `ORG#${organizationId}`;
    }

    getEmployeeSK(employeeId) {
        return `EMP#${employeeId}`;
    }

    getData(name) {
        return this.getEmployeeSK(name);
    }

    getOrganizationAndProjectPK(organizationId, projectId) {
        return `ORG#${organizationId}#PRO#${projectId}`;
    }
}

module.exports = new EmployeeRepository();