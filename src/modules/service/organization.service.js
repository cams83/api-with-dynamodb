const OrganizationRepository = require(`../repository/organization.repository`);

class OrganizationService {

    async findByID(organizationId) {
        const data = await OrganizationRepository.findByID(organizationId);

        if (!data?.Item) return {};
        
        return this.getOrganization(data.Item);
    }

    async create(data) {
        const item = await OrganizationRepository.create({
            name: data.name,
            tier: data.tier,
        });

        return this.getOrganization(item);
    }

    async update(organizationId, data) {
        return await OrganizationRepository.update(organizationId, {
            name: data.name,
            tier: data.tier,
        });
    }

    async deleteByID(organizationId) {
        return await OrganizationRepository.deleteByID(organizationId);
    }
    
    getOrganization(organization) {
        return {...organization, PK: undefined, SK: undefined};
    }


}

module.exports = new OrganizationService()