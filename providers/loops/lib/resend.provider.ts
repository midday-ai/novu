import {
  ChannelTypeEnum,
  ISendMessageSuccessResponse,
  ICheckIntegrationResponse,
  CheckIntegrationResponseEnum,
  IEmailOptions,
  IEmailProvider,
} from '@novu/stateless';
import LoopsClient from 'loops';
import { nanoid } from 'nanoid';

export class LoopsEmailProvider implements IEmailProvider {
  id = 'loops';
  channelType = ChannelTypeEnum.EMAIL as ChannelTypeEnum.EMAIL;
  private loopsClient: LoopsClient;

  constructor(
    private config: {
      apiKey: string;
      from: string;
    }
  ) {
    this.loopsClient = new LoopsClient(this.config.apiKey);
  }

  async sendMessage(
    options: IEmailOptions
  ): Promise<ISendMessageSuccessResponse> {
    const transactionalId = nanoid();

    const response: any = await this.loopsClient.sendTransactionalEmail(
      transactionalId,
      {
        from: options.from || this.config.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        cc: options.cc,
        attachments: options.attachments?.map((attachment) => ({
          filename: attachment?.name,
          content: attachment.file,
        })),
        bcc: options.bcc,
      }
    );

    return {
      id: response.id,
      date: new Date().toISOString(),
    };
  }

  async checkIntegration(
    options: IEmailOptions
  ): Promise<ICheckIntegrationResponse> {
    try {
      await this.loopsClient.sendTransactionalEmail({
        from: options.from || this.config.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        cc: options.cc,
        attachments: options.attachments?.map((attachment) => ({
          filename: attachment?.name,
          content: attachment.file,
        })),
        bcc: options.bcc,
      });

      return {
        success: true,
        message: 'Integrated successfully!',
        code: CheckIntegrationResponseEnum.SUCCESS,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message,
        code: CheckIntegrationResponseEnum.FAILED,
      };
    }
  }
}
