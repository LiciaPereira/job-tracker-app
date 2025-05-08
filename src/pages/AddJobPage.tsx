import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addJob } from "../features/jobs/services/addJob";
import { useAuth } from "../hooks/useAuth";
import { Alert } from "../components/Alert";
import { Card, Text, Input, Button, Select, TextArea } from "../components/ui";

interface FormValues {
  company: string;
  title: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
  appliedAt?: Date | null;
  notes?: string;
}

const schema = yup.object().shape({
  company: yup.string().required("Company is required"),
  title: yup.string().required("Job title is required"),
  status: yup
    .string()
    .oneOf(["applied", "interviewing", "offered", "rejected"])
    .required("Status is required"),
  appliedAt: yup.date().nullable().optional(),
  notes: yup.string().nullable().optional(),
}) as yup.ObjectSchema<FormValues>;

export default function AddJobPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    try {
      const formattedData = {
        ...data,
        appliedAt: data.appliedAt || undefined,
        notes: data.notes === null ? undefined : data.notes,
      };
      await addJob(user.uid, formattedData);
      setAlert({ type: "success", message: "Job added!" });
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err: any) {
      setAlert({ type: "error", message: err.message });
    }
  };

  const statusOptions = [
    { value: "", label: "Select..." },
    { value: "applied", label: "Applied" },
    { value: "interviewing", label: "Interviewing" },
    { value: "offered", label: "Offered" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <Card className="max-w-md mx-auto">
      <Text variant="h1" className="mb-4">
        Add Job
      </Text>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Company"
          {...register("company")}
          error={errors.company?.message}
        />

        <Input
          label="Job Title"
          {...register("title")}
          error={errors.title?.message}
        />

        <Select
          label="Status"
          options={statusOptions}
          {...register("status")}
          error={errors.status?.message}
        />

        <Input
          label="Application Date"
          type="date"
          {...register("appliedAt")}
          defaultValue={new Date().toISOString().split("T")[0]}
        />

        <TextArea label="Notes" rows={4} {...register("notes")} />

        <Button type="submit" className="w-full">
          Add Job
        </Button>
      </form>
    </Card>
  );
}
