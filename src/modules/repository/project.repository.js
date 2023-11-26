const db = require(`../../helpers/database`);
const {v4: uuidv4} = require('uuid');

class ProjectRepository {
    constructor() {
        this.tableName = 'happy-projects';
        this.projectEmployeeIndex = 'Project-Employee-Index';
        this.filterByNameIndex = 'Filter-by-name';
    }

    async findByID(organizationId, type, projectId) {
        const params = {
            TableName: this.tableName,
            Key: {
                PK: this.getOrganizationPK(organizationId),
                SK: this.getProjectSK(type, projectId)
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
                ':SK': 'PRO#'
            }
        };

        return await db.query(params).promise();
    }

    async findAllByType(organizationId, type) {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: 'PK = :PK and begins_with(SK, :SK)',
            ExpressionAttributeValues: {
                ':PK': this.getOrganizationPK(organizationId),
                ':SK': `PRO#${type}#`
            }
        };

        return await db.query(params).promise();
    }

    async findAllByEmployeeId(organizationId, employeeId) {
        const params = {
            TableName: this.tableName,
            IndexName: this.projectEmployeeIndex,
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
            TableName: this.tableName,
            Item: {
                PK: this.getOrganizationPK(organizationId),
                SK: this.getProjectSK(data.type, projectId),
                Data: this.getData(data.name),
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
            expressionAttributeValues[':Data'] = this.getData(data.name);
        }    
    
        updateExpression = updateExpression.slice(0, -1);
    
        const params = {
            TableName: this.tableName,
            Key: {
                PK: this.getOrganizationPK(organizationId),
                SK: this.getProjectSK(type, projectId),
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
            TableName: this.tableName,
            Key: {
                PK: this.getOrganizationPK(organizationId),
                SK: this.getProjectSK(type, projectId),
            },
        };

        return await db.delete(params).promise();
    }

    async assignEmployee(organizationId, projectId, data) {
        const params = {
            TableName: this.tableName,
            Item: {
                PK: this.getOrganizationAndProjectPK(organizationId, projectId),
                SK: this.getOrganizationAndEmployeeSK(organizationId, data.employeeId),
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

    getProjectSK(type, projectId) {
        return `PRO#${type}#${projectId}`;
    }

    getData(name) {
        return `PRO#${name}`;
    }

    getOrganizationAndProjectPK(organizationId, projectId) {
        return `ORG#${organizationId}#PRO#${projectId}`;
    }

    getOrganizationAndEmployeeSK(organizationId, employeeId) {
        return `ORG#${organizationId}#EMP#${employeeId}`;
    }
}

module.exports = new ProjectRepository();