
"use server";

import ai from "@/lib/google";
import { Symptom, Medication, User } from "@prisma/client";

interface Props {
    symptoms: Symptom[];
    medications: Medication[];
    user: User;
}

const generateRecommndations = ({
    symptoms,
    medications,
    user
}: Props) => {
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
        The user ${firstName || ""} is ${
            age ? `${age} years old` : "of unknown age"
        }, ${gender || "of unknown gender"}.

        Their blood group is ${bloodGroup || "unknown"},
        height is ${height ? `${height} cm` : "unknown"},
        and weight is ${weight ? `${weight} kg` : "unknown"}.

        Medical issues:
        ${medicalIssues || "None reported"}

        Symptoms:
        ${formattedSymptoms || "No symptoms reported"}

        Medications:
        ${formattedMedications || "No medications reported"}

        Based on this information, provide up to 5 concise,
        personalized general wellness recommendations.

        Keep recommendations clear, practical and easy to understand.
        Do not diagnose medical conditions.
        Do not prescribe medicines or recommend changing medication.
        Do not provide treatment instructions.
        Focus only on general wellness and healthy lifestyle habits.
    `;

    return prompt;
};

const getRecommndations = async ({
    symptoms,
    medications,
    user
}: Props) => {

    const prompt = generateRecommndations({
        symptoms,
        medications,
        user
    });

    if (!prompt) {
        throw new Error("Prompt not generated");
    }

    const model = ai.getGenerativeModel({
        model: "gemini-3.5-flash-lite",

        systemInstruction: `
            You are a general wellness recommendation assistant.

            Generate up to 5 concise and personalized
            general wellness recommendations based on
            the user's profile, symptoms and medications.

            Do not diagnose medical conditions.
            Do not prescribe medicines.
            Do not recommend changing prescribed medications.
            Do not provide treatment instructions.
            Focus on general healthy lifestyle habits.
            Keep the response simple and easy to understand.
        `
    });

    try {
        const result = await model.generateContent(prompt);

        const response = await result.response;
        const recommendations = response.text();

        if (!recommendations) {
            throw new Error("Empty response received from AI");
        }

        return recommendations;

    } catch (error) {
        console.error("Health recommendations error:", error);

        throw new Error("Error generating health recommendations");
    }
};

export default getRecommndations;
