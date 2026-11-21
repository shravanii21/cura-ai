
"use server";

import ai from "@/lib/google";
import { Symptom, Medication, User } from "@prisma/client";

interface Props {
    symptoms: Symptom[];
    medications: Medication[];
    user: User;
}

const generateTips = ({ symptoms, medications, user }: Props) => {
    const {
        age,
        bloodGroup,
        firstName,
        gender,
        height,
        medicalIssues,
        weight
    } = user;

    const formattedSymptoms = symptoms.map(symptom => {
        return `- ${symptom.name} (Intensity: ${symptom.intensity}, Frequency: ${symptom.frequency})`;
    }).join("\n");

    const formattedMedications = medications.map(medication => {
        return `- ${medication.name} (Dosage: ${medication.dosage}, Frequency: ${medication.frequency})`;
    }).join("\n");

    const prompt = `
        The user ${firstName ? firstName : ""} is ${age ? `${age} years old` : "of unknown age"}, ${gender ? gender : "of unknown gender"}.

        Their blood group is ${bloodGroup ? bloodGroup : "unknown"}, height is ${height ? `${height} cm` : "unknown"}, and weight is ${weight ? `${weight} kg` : "unknown"}.

        They have the following medical issues: ${medicalIssues ? medicalIssues : "none reported"}.

        Here are the details of their health condition:

        Symptoms:
        ${formattedSymptoms || "No symptoms reported"}

        Medications:
        ${formattedMedications || "No medications reported"}

        Based on the above information, provide very concise personalized general wellness tips. Please provide up to 10 of the most important and relevant tips.
        Avoid diagnosis, medication changes, or treatment instructions.
        Keep the recommendations simple and easy to understand.
    `;

    return prompt;
};

const getHealthTips = async ({ symptoms, medications, user }: Props) => {
    const prompt = generateTips({ symptoms, medications, user });

    if (!prompt) {
        throw new Error("Prompt not generated");
    }

    const model = ai.getGenerativeModel({
        model: "gemini-3.5-flash-lite",
        systemInstruction:
            "Generate concise general wellness tips based on the user's symptoms and medications. Do not diagnose conditions or recommend changing prescribed medications."
    });

    try {
        const result = await model.generateContent(prompt);

        const response = result.response;
        const recommendations = response.text();

        if (!recommendations) {
            throw new Error("Empty response received from AI");
        }

        return recommendations;

    } catch (error) {
        console.error("Health tips generation failed:", error);
        throw new Error("Error generating health tips");
    }
};

export default getHealthTips;
