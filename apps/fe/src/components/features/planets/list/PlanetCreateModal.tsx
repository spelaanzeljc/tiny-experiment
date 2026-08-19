import {
  Button,
  DatePicker,
  FileUpload,
  Modal,
  QueryAutocomplete,
  TextArea,
  TextInput,
  Typography,
  useForm,
  useToast,
} from "@povio/ui/tanstack";
import { useTranslation } from "react-i18next";

import { RowInputWrapper } from "@/components/shared/forms/RowInputWrapper";
import { AlienQueries } from "@/openapi/alien/alien.queries";
import { MediaModels } from "@/openapi/media/media.models";
import { PlanetModels } from "@/openapi/planet/planet.models";
import { PlanetQueries } from "@/openapi/planet/planet.queries";
import { useMediaUploadHandler } from "@/utils/media-upload";

interface PlanetCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const useAlienLabelsQuery = AlienQueries.useGetLabels as never;

export function PlanetCreateModal({ isOpen, onClose }: PlanetCreateModalProps) {
  const { t } = useTranslation();
  const createPlanet = PlanetQueries.useCreate();
  const { successToast, errorToast } = useToast();
  // Generated schemas drive form typing and validation; avoid importing fake backend row types in frontend code.
  const form = useForm({
    zodSchema: PlanetModels.PlanetsCreateRequestDtoSchema,
    defaultValues: {
      name: "",
      alienId: undefined,
      discoveryDate: undefined,
      description: "",
      image: undefined,
    },
  });

  const handleImageUpload = useMediaUploadHandler({
    resourceName: MediaModels.MediaResourceName["planet-image"],
    onUploaded: (media) => form.setFieldValue("image", { id: media.id }),
  });

  const handleImageChange = (file: File | null) => {
    if (!file) {
      form.setFieldValue("image", undefined);
    }
  };

  const onSubmit = async (data: PlanetModels.PlanetsCreateRequestDto) => {
    try {
      await createPlanet.mutateAsync({ data });
      successToast({ text: t(($) => $.planets.create.success) });
      form.reset();
      onClose();
    } catch {
      errorToast({ text: t(($) => $.planets.create.error) });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      aside="right"
      showCloseIcon
      modalClassName="h-full min-w-0 overflow-y-auto"
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full min-w-0 flex-col gap-4"
      >
        <Typography
          size="title-5"
          variant="prominent-1"
          as="h2"
          className="mb-2 text-text-default-1"
        >
          {t(($) => $.planets.create.title)}
        </Typography>

        <RowInputWrapper
          label={t(($) => $.planets.create.name)}
          isRequired
        >
          <TextInput
            variant="filled"
            size="extra-small"
            field={{ form, name: "name" }}
            label={t(($) => $.planets.create.name)}
            placeholder={t(($) => $.planets.create.namePlaceholder)}
            hideLabel
            isRequired
          />
        </RowInputWrapper>

        <RowInputWrapper label={t(($) => $.planets.create.alien)}>
          <QueryAutocomplete
            variant="filled"
            size="extra-small"
            field={{ form, name: "alienId" }}
            query={useAlienLabelsQuery}
            label={t(($) => $.planets.create.alien)}
            placeholder={t(($) => $.planets.create.alienPlaceholder)}
            hideLabel
          />
        </RowInputWrapper>

        <RowInputWrapper label={t(($) => $.planets.create.discoveryDate)}>
          <DatePicker
            variant="filled"
            size="extra-small"
            field={{ form, name: "discoveryDate" }}
            label={t(($) => $.planets.create.discoveryDate)}
            placeholder={t(($) => $.planets.create.discoveryDatePlaceholder)}
            hideLabel
          />
        </RowInputWrapper>

        <RowInputWrapper label={t(($) => $.planets.create.description)}>
          <TextArea
            variant="filled"
            size="extra-small"
            field={{ form, name: "description" }}
            label={t(($) => $.planets.create.description)}
            placeholder={t(($) => $.planets.create.descriptionPlaceholder)}
            hideLabel
          />
        </RowInputWrapper>

        <FileUpload
          label={t(($) => $.planets.create.image)}
          emptyText={t(($) => $.planets.create.imageEmptyText)}
          uploadText={t(($) => $.planets.create.imageUploadText)}
          browseText={t(($) => $.planets.create.imageBrowseText)}
          acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
          onChange={handleImageChange}
          fileUpload={handleImageUpload}
        />

        <div className="mt-6 flex items-center justify-end gap-2 self-end">
          <Button
            type="button"
            variant="outlined"
            size="xs"
            color="secondary"
            width="hug"
            onPress={handleClose}
          >
            {t(($) => $.planets.create.cancel)}
          </Button>

          <Button
            type="submit"
            variant="contained"
            size="xs"
            color="primary"
            width="hug"
            isDisabled={createPlanet.isPending}
            isLoading={createPlanet.isPending}
          >
            {t(($) => $.planets.create.submit)}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
