/**
 * Fake-be seed data for local development.
 */

import type { StoreState } from "~/db/schema-registry";
import { createActivitySeed } from "~/db/tables/activity/activity.seed";
import { createAuthnIdentitySeed } from "~/db/tables/authnIdentity/authnIdentity.seed";
import { createAuthnNonceSeed } from "~/db/tables/authnNonce/authnNonce.seed";
import { createMedia } from "~/db/tables/media/media.seed";
import { createMailSeed } from "~/db/tables/mail/mail.seed";
import { createAlienSeed } from "~/db/tables/alien/alien.seed";
import { createPlanetSeed } from "~/db/tables/planet/planet.seed";
import { createUserSeed } from "~/db/tables/user/user.seed";
import { createEmailTemplateSeed } from "~/db/tables/emailTemplate/emailTemplate.seed";
import { createPushNotificationTemplateSeed } from "~/db/tables/pushNotificationTemplate/pushNotificationTemplate.seed";
import { createPushNotificationTokenSeed } from "~/db/tables/pushNotificationToken/pushNotificationToken.seed";
import { createQueueJobSeed } from "~/db/tables/queueJob/queueJob.seed";

/**
 * Change VITE_PUBLIC_FAKE_BE_SEED_VERSION whenever deployed users must discard
 * their persisted fake-be state and start from the latest seed data.
 */
export const SEED_VERSION = import.meta.env?.VITE_PUBLIC_FAKE_BE_SEED_VERSION ?? "1";

export function createSeedState(): StoreState {
  const t = new Date().toISOString();

  return {
    User: createUserSeed(t),
    AuthnIdentity: createAuthnIdentitySeed(),
    AuthnNonce: createAuthnNonceSeed(),
    Activity: createActivitySeed(),
    Alien: createAlienSeed(t),
    Media: createMedia(),
    Mail: createMailSeed(),
    EmailTemplate: createEmailTemplateSeed(t),
    PushNotificationTemplate: createPushNotificationTemplateSeed(t),
    PushNotificationToken: createPushNotificationTokenSeed(),
    QueueJob: createQueueJobSeed(),
    Planet: createPlanetSeed(t),
    PlanetLike: [],
  };
}
