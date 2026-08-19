import { commonModule } from "~/orpc/api/common/common.module";
import { mediaModule } from "~/orpc/api/media/media.module";
import { fakeMailModule } from "~/orpc/api/fakeMail/fakeMail.module";
import { aliensModule } from "~/orpc/api/aliens/aliens.module";
import { planetsModule } from "~/orpc/api/planets/planets.module";
import { userModule } from "~/orpc/api/user/user.module";
import { userAuthModule } from "~/orpc/api/userAuth/userAuth.module";

export const apiModules = {
  common: commonModule,
  user: userModule,
  userAuth: userAuthModule,
  media: mediaModule,
  fakeMail: fakeMailModule,
  aliens: aliensModule,
  planets: planetsModule,
} as const;
