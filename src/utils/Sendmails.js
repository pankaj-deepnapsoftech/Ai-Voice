import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
// local imports
import { transporter } from '../config/nodemailer.config.js';
import { logger } from './Logger.js';
import { config } from '../config/env.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendMail = async (templatename, templateData, senderDetails) => {
  try {
    const newPath = path.join(__dirname, `../Template/${templatename}`);

    const html = await ejs.renderFile(newPath, templateData);
    const mailOptions = {
      from: config.EMAIL_ID,
      to: senderDetails.email,
      subject: senderDetails.subject,
      html: html,
    };
    await transporter.sendMail(mailOptions);

    logger.info('Mail sending success');
  } catch (error) {
    logger.error('main sending error ', error);
  }
};
