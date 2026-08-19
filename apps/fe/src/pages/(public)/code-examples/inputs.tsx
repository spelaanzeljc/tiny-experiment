import {
  Autocomplete,
  Button,
  Checkbox,
  DatePicker,
  DateRangePicker,
  DateTimePicker,
  InputUpload,
  NumberInput,
  PasswordInput,
  RadioGroup,
  Segment,
  Select,
  Slider,
  TextArea,
  TextInput,
  TimePicker,
  Toggle,
  useForm,
} from "@povio/ui/tanstack";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

enum OptionEnum {
  Option1 = "option-1",
  Option2 = "option-2",
  Option3 = "option-3",
}

const FormSchema = z.object({
  input: z.string(),
  numberInput: z.number(),
  textArea: z.string(),
  password: z.string(),
  selectSingleMode: z.enum(OptionEnum),
  selectMultipleMode: z.array(z.enum(OptionEnum)),
  autocompleteSingleMode: z.enum(OptionEnum),
  autocompleteMultipleMode: z.array(z.enum(OptionEnum)),
  slider: z.number(),
  rangeSlider: z.array(z.number()),
  checkbox: z.boolean(),
  toggle: z.boolean(),
  radioGroup: z.enum(OptionEnum),
  date: z.iso.datetime({ offset: true }).nullable(),
  dateRange: z.object({
    start: z.iso.datetime({ offset: true }).nullable(),
    end: z.iso.datetime({ offset: true }).nullable(),
  }),
  time: z.string(),
  dateTime: z.iso.datetime({ offset: true }).nullable(),
  textEditor: z.object({ html: z.string().optional(), json: z.record(z.string(), z.any()) }),
  segmentSingleMode: z.enum(OptionEnum),
  segmentMultipleMode: z.array(z.enum(OptionEnum)),
  inputUpload: z.array(z.instanceof(File)),
});
type FormType = z.infer<typeof FormSchema>;

const options = [
  { id: OptionEnum.Option1, label: "Option 1" },
  { id: OptionEnum.Option2, label: "Option 2" },
];

const segmentDualOptions = [
  { id: OptionEnum.Option1, label: "Option 1" },
  { id: OptionEnum.Option2, label: "Option 2" },
];

const segmentOptions = [
  { id: OptionEnum.Option1, label: "Option 1" },
  { id: OptionEnum.Option2, label: "Option 2" },
  { id: OptionEnum.Option3, label: "Option 3" },
];

function InputExamplesPage() {
  const form = useForm({
    zodSchema: FormSchema,
  });

  const onSubmit = (data: FormType) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-20"
    >
      <TextInput
        field={{ form, name: "input" }}
        label="Input label"
        placeholder="Input placeholder"
      />

      <NumberInput
        field={{ form, name: "numberInput" }}
        label="Number input label"
        placeholder="Number input placeholder"
      />

      <TextArea
        field={{ form, name: "textArea" }}
        label="TextArea label"
        placeholder="TextArea placeholder"
      />

      <PasswordInput
        field={{ form, name: "password" }}
        label="Password label"
        placeholder="Password placeholder"
      />

      <Select
        field={{ form, name: "selectSingleMode" }}
        label="Select single mode label"
        placeholder="Select option..."
        items={options}
      />

      <Select
        field={{ form, name: "selectMultipleMode" }}
        selectionMode="multiple"
        label="Select multiple mode label"
        placeholder="Select option..."
        items={options}
      />

      <Autocomplete
        field={{ form, name: "autocompleteSingleMode" }}
        label="Autocomplete single mode label"
        placeholder="Select option..."
        items={options}
      />

      <Autocomplete
        field={{ form, name: "autocompleteMultipleMode" }}
        selectionMode="multiple"
        label="Autocomplete multiple mode label"
        placeholder="Select option..."
        items={options}
      />

      <Slider
        field={{ form, name: "slider" }}
        label="Percentage"
        unit="%"
      />

      <Slider
        isRange
        field={{ form, name: "rangeSlider" }}
        label="Range"
        unit="%"
      />

      <Checkbox field={{ form, name: "checkbox" }}>Checkbox text</Checkbox>

      <Toggle field={{ form, name: "toggle" }}>Toggle text</Toggle>

      <RadioGroup
        field={{ form, name: "radioGroup" }}
        label="RadioGroup label"
        options={[
          { value: OptionEnum.Option1, label: "Option 1" },
          { value: OptionEnum.Option2, label: "Option 2" },
        ]}
      />

      <DatePicker
        field={{ form, name: "date" }}
        label="DatePicker label"
      />

      <DateRangePicker
        field={{ form, name: "dateRange" }}
        label="DateRangePicker label"
      />

      <TimePicker
        field={{ form, name: "time" }}
        label="TimePicker label"
      />

      <DateTimePicker
        field={{ form, name: "dateTime" }}
        label="DateTimePicker label"
      />

      <Segment
        field={{ form, name: "segmentSingleMode" }}
        items={segmentDualOptions}
      />

      <Segment
        field={{ form, name: "segmentMultipleMode" }}
        items={segmentOptions}
        selectionMode="multiple"
      />

      <InputUpload
        field={{ form, name: "inputUpload" }}
        allowsMultiple
        acceptedFileTypes={["image/*"]} // Adjust based on use case
        label="InputUpload label"
      />

      <div className="flex gap-4">
        <Button type="submit">Submit</Button>
        <Button
          color="secondary"
          onPress={() => form.reset()}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}

export const Route = createFileRoute("/(public)/code-examples/inputs")({
  component: InputExamplesPage,
});
