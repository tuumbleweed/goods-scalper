import sgMail from "@sendgrid/mail";

import log from "../util/logger";
import settings from "../util/settings";


/**
 * Send an email with a list of website urls to admin.
 * @param urlList 
 */
export async function sendEmail(urlList: string[]): Promise<void> {
    const msg = {
        to: settings.secret.adminEmail,
        from: "gs@gs.com",
        subject: "Found a PS5 on those websites",
        text: `Here is the url list of websites where PS5 was found:\n${urlList.join("\n")}`,
        html: `Here is the url list of websites where <strong>PS5</strong> was found:<br>${urlList.join("<br>")}`,
    };

    log.info(`Sending email to ${settings.secret.adminEmail}`);
    sgMail.setApiKey(settings.secret.sendgridApiKey);
    await sgMail.send(msg).then( resp => {
        log.info(resp[0].statusCode);
        log.info(resp[0].headers);
    });
}