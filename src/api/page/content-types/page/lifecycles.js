const text = require("../../../text/controllers/text");

module.exports = {
    async beforeUpdate(event) {
        const { where } = event.params;
        // fetch existing data from database
        // (Strapi does not populate dynamic zone components by default)
        const existingData = await strapi
            .entityService.findOne("api::page.page", where.id, {
                populate: ["Content"],
            })
        // loop over components and update MDX and CleanText fields
        for (let component of existingData.Content) {
            strapi
                .service('plugin::auto-content.cleanTextService')
                .cleanText(component.Text)
                .then((text) => {
                    strapi.query('page.chunk').update({
                        where: { id: component.id },
                        data: {
                            CleanText: String(text)
                        }
                    })
                })
            strapi
                .service('plugin::auto-content.mdxService')
                .mdx(component.Text)
                .then((mdx) => {
                    strapi.query('page.chunk').update({
                        where: { id: component.id },
                        data: {
                            MDX: mdx
                        }
                    })
                })
        }
    }
};
