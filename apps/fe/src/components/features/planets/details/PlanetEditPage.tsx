import {
  Button,
  Confirmation,
  DatePicker,
  FileUpload,
  Modal,
  QueryAutocomplete,
  TextArea,
  TextInput,
  Typography,
  useForm,
  useFormValue,
  useToast,
} from "@povio/ui/tanstack";
import { useNavigate } from "@tanstack/react-router";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { RowInputWrapper } from "@/components/shared/forms/RowInputWrapper";
import { AlienQueries } from "@/openapi/alien/alien.queries";
import { MediaModels } from "@/openapi/media/media.models";
import { PlanetModels } from "@/openapi/planet/planet.models";
import { PlanetQueries } from "@/openapi/planet/planet.queries";
import { useMediaUploadHandler } from "@/utils/media-upload";

interface PlanetEditPageProps {
  planet: PlanetModels.PlanetsGetResponseDto;
  onClose?: () => void;
  onDeleted?: () => void;
  onSaved?: () => void;
}

export function PlanetEditPage({ planet, onClose, onDeleted, onSaved }: PlanetEditPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const updatePlanet = PlanetQueries.useUpdate();
  const deletePlanet = PlanetQueries.useDeleteApiPlanetsById();
  const { successToast, errorToast } = useToast();
  const { confirm } = Confirmation.useConfirmation();
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(planet.image?.url);
  // Seed the form from the fetched record, then reset when route data changes between planet IDs.
  const form = useForm({
    zodSchema: PlanetModels.PlanetsCreateRequestDtoSchema,
    defaultValues: {
      name: planet.name,
      alienId: planet.alienId ?? undefined,
      discoveryDate: planet.discoveryDate ?? undefined,
      description: planet.description ?? "",
      image: planet.image ? { id: planet.image.id } : undefined,
    },
  });

  useEffect(() => {
    form.reset({
      name: planet.name,
      alienId: planet.alienId ?? undefined,
      discoveryDate: planet.discoveryDate ?? undefined,
      description: planet.description ?? "",
      image: planet.image ? { id: planet.image.id } : undefined,
    });
    setPreviewImageUrl(planet.image?.url);
  }, [form, planet]);

  const handleImageUpload = useMediaUploadHandler({
    resourceName: MediaModels.MediaResourceName["planet-image"],
    onUploaded: (media) => {
      form.setFieldValue("image", { id: media.id });
      setPreviewImageUrl(media.previewUrl);
    },
  });

  const handleImageChange = (_file: File | null) => {
    // When clearing file, keep current image
    if (!_file) {
      form.setFieldValue("image", planet.image ? { id: planet.image.id } : undefined);
      setPreviewImageUrl(planet.image?.url);
    }
  };

  const onSubmit = async (data: PlanetModels.PlanetsCreateRequestDto) => {
    try {
      await updatePlanet.mutateAsync({ id: planet.id, data });
      successToast({ text: t(($) => $.planets.edit.success) });
      if (onSaved) {
        onSaved();
      } else {
        navigate({ to: "/planets/$id", params: { id: planet.id } });
      }
    } catch {
      errorToast({ text: t(($) => $.planets.edit.error) });
    }
  };

  const handleDelete = async () => {
    // Destructive actions should go through a shared confirmation flow before calling the mutation.
    const confirmed = await confirm({
      heading: t(($) => $.planets.removeConfirm.heading),
      description: t(($) => $.planets.removeConfirm.description, { name: planet.name }),
      confirmLabel: t(($) => $.planets.removeConfirm.confirm),
      cancelLabel: t(($) => $.planets.removeConfirm.cancel),
      confirmColor: "error",
      cancelVariant: "outlined",
      buttonSize: "s",
    });

    if (!confirmed) {
      return;
    }

    try {
      await deletePlanet.mutateAsync({ id: planet.id });
      successToast({ text: t(($) => $.planets.removeConfirm.success) });
      if (onDeleted) {
        onDeleted();
      } else {
        navigate({ to: "/planets" });
      }
    } catch {
      errorToast({ text: t(($) => $.planets.removeConfirm.error) });
    }
  };

  const currentImage = useFormValue(form, (values) => values.image);
  const currentImageUrl = planet.image && currentImage?.id === planet.image.id ? planet.image.url : previewImageUrl;
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate({ to: "/planets/$id", params: { id: planet.id } });
    }
  };

  return (
    <Modal
      isOpen
      onClose={handleClose}
      aside="right"
      showCloseIcon
      modalClassName="h-full min-w-0 overflow-y-auto"
    >
      <div className="mb-6 flex items-center justify-between gap-4 pr-10">
        <Typography
          as="h2"
          size="title-5"
          variant="prominent-1"
          className="text-text-default-1"
        >
          {t(($) => $.planets.edit.title)}
        </Typography>

        <Button
          type="button"
          size="xs"
          color="error"
          variant="outlined"
          icon={Trash}
          onPress={handleDelete}
          isDisabled={deletePlanet.isPending}
        >
          {t(($) => $.planets.actions.remove)}
        </Button>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full min-w-0 flex-col gap-4"
      >
        <RowInputWrapper
          label={t(($) => $.planets.edit.name)}
          isRequired
        >
          <TextInput
            variant="filled"
            size="extra-small"
            field={{ form, name: "name" }}
            label={t(($) => $.planets.edit.name)}
            placeholder={t(($) => $.planets.edit.namePlaceholder)}
            hideLabel
            isRequired
          />
        </RowInputWrapper>

        <RowInputWrapper label={t(($) => $.planets.edit.alien)}>
          <QueryAutocomplete
            variant="filled"
            size="extra-small"
            field={{ form, name: "alienId" }}
            query={AlienQueries.useGetLabels}
            label={t(($) => $.planets.edit.alien)}
            placeholder={t(($) => $.planets.edit.alienPlaceholder)}
            hideLabel
          />
        </RowInputWrapper>

        <RowInputWrapper label={t(($) => $.planets.edit.discoveryDate)}>
          <DatePicker
            variant="filled"
            size="extra-small"
            field={{ form, name: "discoveryDate" }}
            label={t(($) => $.planets.edit.discoveryDate)}
            placeholder={t(($) => $.planets.edit.discoveryDatePlaceholder)}
            hideLabel
          />
        </RowInputWrapper>

        <RowInputWrapper label={t(($) => $.planets.edit.description)}>
          <TextArea
            variant="filled"
            size="extra-small"
            field={{ form, name: "description" }}
            label={t(($) => $.planets.edit.description)}
            placeholder={t(($) => $.planets.edit.descriptionPlaceholder)}
            hideLabel
          />
        </RowInputWrapper>

        <div className="flex flex-col gap-2">
          <FileUpload
            label={t(($) => $.planets.edit.image)}
            emptyText={t(($) => $.planets.edit.imageEmptyText)}
            uploadText={t(($) => $.planets.edit.imageUploadText)}
            browseText={t(($) => $.planets.edit.imageBrowseText)}
            acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
            onChange={handleImageChange}
            fileUpload={handleImageUpload}
          />
          {currentImageUrl && (
            <div className="aspect-video w-full overflow-hidden rounded-sm border border-elevation-outline-default-1 bg-elevation-fill-default-2">
              <img
                src={currentImageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 self-end">
          <Button
            type="button"
            variant="outlined"
            size="xs"
            color="secondary"
            width="hug"
            onPress={handleClose}
          >
            {t(($) => $.planets.edit.cancel)}
          </Button>

          <Button
            type="submit"
            variant="contained"
            size="xs"
            color="primary"
            width="hug"
            isDisabled={updatePlanet.isPending}
            isLoading={updatePlanet.isPending}
          >
            {t(($) => $.planets.edit.submit)}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
