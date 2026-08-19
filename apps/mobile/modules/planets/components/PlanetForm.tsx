import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AlienQueries } from "@/api/alien/alien.queries";
import { PlanetModels } from "@/api/planet/planet.models";
import { Button, Calendar, Input, Select } from "@povio/rn-ui";

export interface PlanetFormValue {
  name: string;
  alienId?: string | null;
  discoveryDate?: string | null;
  description?: string | null;
  image?: PlanetModels.PlanetImageRequestDto | null;
}

interface PlanetFormProps {
  initialValue?: PlanetFormValue;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (value: PlanetFormValue) => void;
}

export function PlanetForm({ initialValue, submitLabel, isSubmitting = false, onSubmit }: PlanetFormProps) {
  const { data: alienLabels = [] } = AlienQueries.useGetLabels({ search: "" });
  const { control, handleSubmit, reset } = useForm<PlanetModels.PlanetsCreateRequestDto>({
    resolver: zodResolver(PlanetModels.PlanetsCreateRequestDtoSchema),
    defaultValues: {
      name: initialValue?.name ?? "",
      alienId: initialValue?.alienId ?? null,
      discoveryDate: initialValue?.discoveryDate ?? null,
      description: initialValue?.description ?? null,
      image: initialValue?.image ?? null,
    },
  });

  useEffect(() => {
    reset({
      name: initialValue?.name ?? "",
      alienId: initialValue?.alienId ?? null,
      discoveryDate: initialValue?.discoveryDate ?? null,
      description: initialValue?.description ?? null,
      image: initialValue?.image ?? null,
    });
  }, [initialValue, reset]);

  const handleValidSubmit = (value: PlanetModels.PlanetsCreateRequestDto) => {
    onSubmit(value);
  };

  return (
    <>
      <Input
        formControl={control}
        name="name"
        label="Name"
        placeholder="Planet name"
      />
      <Select
        formControl={control}
        name="alienId"
        label="Alien"
        items={alienLabels.map((alien) => ({
          label: alien.label,
          value: alien.id,
        }))}
        filterable
      />
      <Calendar
        formControl={control}
        name="discoveryDate"
        label="Discovery date"
      />
      <Input
        formControl={control}
        name="description"
        label="Description"
        placeholder="Short description"
        type="textArea"
        limit={400}
      />
      <Button
        label={submitLabel}
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit(handleValidSubmit)}
      />
    </>
  );
}
