import { ChannelTypeEnum, ICredentials } from '@novu/shared';
import { LoopsEmailProvider } from '@novu/loops';
import { BaseHandler } from './base.handler';

export class LoopsHandler extends BaseHandler {
  constructor() {
    super('loops', ChannelTypeEnum.EMAIL);
  }
  buildProvider(credentials: ICredentials, from?: string) {
    const config: { apiKey: string; from: string; senderName?: string } = {
      from: from as string,
      apiKey: credentials.apiKey as string,
      senderName: credentials.senderName,
    };

    this.provider = new LoopsEmailProvider(config);
  }
}
