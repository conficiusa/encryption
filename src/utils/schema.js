const { z } = require("zod");


const multiSelectSchema = z.object({
  label: z.string(),
  value: z.string(),
});
const prescriptionSchema = z.object({
  medication: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  duration: z.string(),
  instructions: z.string(),
});

const clinicalInvestigationsSchema = z.object({
  lab_tests: z.array(multiSelectSchema).optional(),
  imaging: z.array(multiSelectSchema).optional(),
});

// Main form schema
const formSchema = z.object({
    patientId: z.string().min(1, { message: "Patient ID is required" }),
    doctorId: z.string().min(1, { message: "Doctor ID is required" }),
    appointmentId: z.string().min(1, { message: "Appointment ID is required" }),
    patientName: z.string().min(2, { message: "Patient name is required" }),
    dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
    consultationDate: z
        .string()
        .min(1, { message: "Consultation date is required" }),
    consultationTime: z
        .string()
        .min(1, { message: "Consultation time is required" }),
    chiefComplaint: z.string().min(1, { message: "Chief complaint is required" }),
    historyOfPresentIllness: z
        .string()
        .min(1, { message: "History of present illness is required" }),
    clinicalInvestigations: clinicalInvestigationsSchema,
    assessment: z.string().min(1, { message: "Assessment is required" }),
    diagnosis: z.string().min(1, { message: "Diagnosis is required" }),
    treatmentPlan: z.string().min(1, { message: "Treatment plan is required" }),
    prescriptions: z.array(prescriptionSchema).default([
        {
            medication: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: "",
        },
    ]),
    recommendation: z.string(),
});

module.exports = { formSchema };
