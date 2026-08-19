import { installFakeMediaUploadGateway } from "~/media/upload-gateway";
import { installFakeMailboxBrowserBridge } from "~/mail/browser-mailbox";

export function installFakeBackendBrowserFeatures(): void {
  installFakeMailboxBrowserBridge();
  installFakeMediaUploadGateway();
}
