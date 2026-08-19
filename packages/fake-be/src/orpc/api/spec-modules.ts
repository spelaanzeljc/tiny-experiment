import { aliensContract } from "~/orpc/api/aliens/aliens.contract";
import { fakeMailContract } from "~/orpc/api/fakeMail/fakeMail.contract";
import { mediaContract } from "~/orpc/api/media/media.contract";
import { planetsContract } from "~/orpc/api/planets/planets.contract";
import { PLANET_IMAGE_MEDIA_RESOURCE } from "~/orpc/api/planets/planets.media-resource";
import { userContract } from "~/orpc/api/user/user.contract";
import { userAuthContract } from "~/orpc/api/userAuth/userAuth.contract";

import type { ApiModuleShape } from "~/orpc/api/module";

export const apiSpecModules = {
  common: {
    contract: {},
    robodevHidden: true,
  },
  user: {
    contract: userContract,
    openApiController: "UserMeController",
    openApiTag: "User",
    robodevHidden: true,
    robodevOwnedTables: ["User", "PushNotificationToken"],
  },
  userAuth: {
    contract: userAuthContract,
    openApiTag: "User Auth",
    robodevHidden: true,
    robodevOwnedTables: ["AuthnIdentity", "AuthnNonce"],
  },
  media: {
    contract: mediaContract,
    openApiController: "MediaLibraryController",
    openApiTag: "Media",
    robodevHidden: true,
    robodevOwnedTables: ["Media"],
  },
  fakeMail: {
    contract: fakeMailContract,
    openApiTag: "Fake Mail",
    robodevHidden: true,
    robodevOwnedTables: ["Mail"],
  },
  aliens: {
    contract: aliensContract,
    openApiTag: "Alien",
    robodevHidden: true,
    robodevOwnedTables: ["Alien"],
  },
  planets: {
    contract: planetsContract,
    openApiTag: "Planet",
    robodevHidden: true,
    robodevOwnedTables: ["Planet", "PlanetLike"],
    robodevMediaResources: [PLANET_IMAGE_MEDIA_RESOURCE],
  },
} as const satisfies Record<string, Omit<ApiModuleShape, "createRouter">>;
