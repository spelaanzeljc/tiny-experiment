import { oc } from "@orpc/contract";

import { FakeMailSendDemoBodySchema, FakeMailSendDemoResponseSchema } from "~/orpc/api/fakeMail/fakeMail.models";

export const fakeMailContract = oc.tag("Fake Mail").router({
  sendDemo: oc
    .route({ method: "POST", path: "/api/fake-mail/demo", successStatus: 201 })
    .input(FakeMailSendDemoBodySchema)
    .output(FakeMailSendDemoResponseSchema)
    .meta({
      bl: "Creates demonstration email messages for the local fake-mailbox showcase.",
    }),
});
