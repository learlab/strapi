const text = require("../../../text/controllers/text");

function updateCleanText(component) {
    strapi
        .service('plugin::auto-content.cleanTextService')
        .cleanText(component.Text)
        .then((text) => {
            strapi.query('page.chunk').update({
                where: { id: component.id },
                data: {
                    CleanText: text
                }
            })
        })
}

function updateMDX(component) {
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

function fetchTranscript(component) {
    const end = component.EndTime ? component.EndTime : null
    strapi
        .service('plugin::auto-content.fetchTranscriptService')
        .getTranscript(component.URL, component.StartTime, end)
        .then((transcript) => {
            strapi.query('page.video').update({
                where: { id: component.id },
                data: {
                    CleanText: transcript
                }
            })
        })
}

function updateVideoMDX(component) {
    var JSX = `<YoutubeVideo
    src=${component.URL}`

    if (component.Title) JSX += `
    title="${component.Title}"`

    if (component.Description) JSX += `
>
${component.Description}`
    
    else JSX += `>`

    JSX += `
</YoutubeVideo>`

    strapi.query('page.video').update({
        where: { id: component.id },
        data: {
            MDX: JSX
        }
    })
}

module.exports = {
    async beforeUpdate(event) {
        const { where } = event.params;
        // fetch existing data from database
        // (Strapi does not populate components in the beforeUpdate hook)
        const existingData = await strapi
            .entityService.findOne("api::page.page", where.id, {
                populate: ["Content"],
            })
        // loop over components and update MDX and CleanText fields
        for (let component of existingData.Content) {

            // console.log(component)

            if (component.__component === "page.chunk") {
                updateCleanText(component);
                updateMDX(component);
            }
            if (component.__component === "page.video") {
                fetchTranscript(component);
                updateVideoMDX(component);
            }
        }
    }
};
