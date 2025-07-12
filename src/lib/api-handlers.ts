import { prisma } from "@/lib/db";
import { ROLE } from "@prisma/client";
import Cookies from "js-cookie";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { supabase } from "@/lib/supabase";
const NEXT_PUBLIC_GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// User API functions
export async function getUserRole(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user) throw new Error("Unable to find user.");
    Cookies.set("role", user?.role, { expires: 7 });

    return user?.role || null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

export async function createUser(data: {
  id: string;
  email: string;
  role: ROLE;
  name: string;
}) {
  try {
    const { id, email, role, name } = data;

    const existingUser = await prisma.user.findUnique({ where: { id } });

    if (existingUser) return existingUser;

    // Create user record
    const user = await prisma.user.create({
      data: {
        id,
        email,
        name,
        role,
      },
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export const signUpWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/login",
    },
  });

  if (error) throw new Error("Google sign-in failed.");
  return data;
};

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "/api";
  }
  // Gemini API calls
  async generateText(prompt: string) {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": NEXT_PUBLIC_GEMINI_API_KEY as string,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Unknown error");
      }
      const data = await response.json();

      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0]
      ) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Generate text error:", error);
      throw error;
    }
  }

  // Idea validation
  async validateIdea(idea: string) {
    try {
      const prompt = `
        Please analyze this business idea and provide structured feedback in JSON format:
        
        IDEA: ${idea}
        
        Please return a JSON object with the following structure:
        {
          "scores": {
            "feasibility": [0-100 score],
            "marketDemand": [0-100 score],
            "techComplexity": [0-100 score],
            "uniqueness": [0-100 score],
            "overall": [0-100 average score]
          },
          "suggestions": [array of 4-5 improvement suggestions],
          "similarProjects": [
            {
              "name": "Project name",
              "url": "https://example.com",
              "description": "Brief description"
            }
          ],
          "targetAudience": [array of 4-5 potential user groups],
          "estimations": {
            "timeToMvp": "estimated time range",
            "costRange": "estimated cost range",
            "effort": "Low/Medium/High"
          }
        }
        `;

      const response = await this.generateText(prompt);

      // Try to parse the response as JSON
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not extract JSON from response");
        }
      } catch (error) {
        console.error("Error parsing validation response:", error);
        throw new Error("Failed to parse validation data");
      }
    } catch (error) {
      console.error("Validate idea error:", error);
      throw error;
    }
  }

  // Brainstorming
  async brainstormIdeas(concept: string) {
    try {
      const prompt = `
        Generate 5 innovative product ideas based on this concept: "${concept}"
        
        For each idea, provide:
        1. A catchy name
        2. A brief description (1-2 sentences)
        3. Key features (3-4 bullet points)
        4. Target audience
        5. Potential business model
        
        Format as JSON like this:
        {
          "ideas": [
            {
              "name": "Idea name",
              "description": "Brief description",
              "features": ["Feature 1", "Feature 2", "Feature 3"],
              "audience": "Target audience description",
              "businessModel": "Business model description"
            }
          ]
        }
        `;

      const response = await this.generateText(prompt);

      // Try to parse the response as JSON
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not extract JSON from response");
        }
      } catch (error) {
        console.error("Error parsing brainstorm response:", error);
        throw new Error("Failed to parse brainstorm data");
      }
    } catch (error) {
      console.error("Brainstorm ideas error:", error);
      throw error;
    }
  }

  // Project management methods
  async saveProject(data: {
    title: string;
    description: string;
    validationResults?: any;
    brainstormNotes?: string;
    techStack?: any;
  }) {
    try {
      const { user } = (await getUserFromCookies()) as {
        user: any;
        role: string;
      };
      if (!user) throw new Error("User not authenticated");

      const { data: project, error } = await supabase
        .from("projects")
        .insert([
          {
            user_id: user.id,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return project;
    } catch (error) {
      console.error("Save project error:", error);
      throw error;
    }
  }

  async updateProject(
    projectId: string,
    data: Partial<{
      title: string;
      description: string;
      validationResults: any;
      brainstormNotes: string;
      techStack: any;
    }>
  ) {
    try {
      const { data: project, error } = await supabase
        .from("projects")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .select()
        .single();

      if (error) throw error;
      return project;
    } catch (error) {
      console.error("Update project error:", error);
      throw error;
    }
  }

  async getProjects() {
    try {
      const { user } = (await getUserFromCookies()) as {
        user: any;
        role: string;
      };
      if (!user.user) throw new Error("User not authenticated");

      const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return projects;
    } catch (error) {
      console.error("Get projects error:", error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
