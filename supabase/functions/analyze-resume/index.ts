import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resumeText, jobDescription } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!resumeText || !jobDescription) {
      return new Response(JSON.stringify({ error: "Resume text and job description are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert resume analyzer and career advisor. Analyze the given resume against the job description and return a JSON response with the following structure. Be thorough and specific.

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, no extra text.
ALL string arrays must contain only plain strings, NOT objects.

{
  "isValidResume": true/false,
  "validationMessage": "message if not a valid resume",
  "matchScore": 0-100,
  "extractedSkills": ["skill1", "skill2", ...],
  "requiredSkills": ["skill1", "skill2", ...],
  "missingSkills": ["skill1", "skill2", ...],
  "skillScores": [{"skill": "name", "userLevel": 0-100, "requiredLevel": 0-100}],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "jobRecommendations": [
    {"title": "Job Title", "requiredSkills": ["skill1"], "matchPercentage": 0-100, "description": "brief desc"}
  ],
  "salaryInsights": {
    "minSalary": 50000,
    "maxSalary": 120000,
    "averageSalary": 85000,
    "currency": "USD",
    "experienceLevel": "Junior/Mid/Senior",
    "factors": ["factor1", "factor2"]
  },
  "roadmap": [
    {
      "step": 1,
      "skill": "Skill Name",
      "explanation": "Why this matters",
      "resources": [
        {"title": "Resource name", "url": "https://...", "platform": "YouTube/W3Schools/etc"}
      ]
    }
  ],
  "optimizedResumeSections": {
    "summary": "Improved professional summary that merges original content with enhancements",
    "skills": ["complete merged skill list including original resume skills PLUS recommended new skills"],
    "experience": ["improved bullet points based on original resume experience"],
    "keywords": ["ATS keywords to add"]
  }
}

CRITICAL RULES:
1. missingSkills MUST equal requiredSkills minus extractedSkills. If matchScore < 100, missingSkills MUST NOT be empty.
2. jobRecommendations MUST always contain at least 3 roles. If no exact match, suggest related roles based on the user's existing skills.
3. optimizedResumeSections.skills MUST include ALL original resume skills plus any additional recommended skills. Do NOT drop original skills.
4. optimizedResumeSections.experience MUST be improved versions of the ORIGINAL resume bullets, not generic new ones.
5. optimizedResumeSections.summary MUST incorporate the user's actual background from their resume.
6. For roadmap resources, use REAL clickable URLs (not embed URLs) from: YouTube (youtube.com/watch?v=...), W3Schools, MDN, freeCodeCamp, Coursera, Udemy.
7. Every resource URL must be a normal webpage link that opens in a browser, NOT an embed or iframe URL.

First, validate if the input is actually a resume. Look for typical resume sections like education, skills, experience, projects, contact info. If it doesn't look like a resume, set isValidResume to false.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Parse the JSON from the response
    let analysisResult;
    try {
      // Try to extract JSON from possible markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      analysisResult = JSON.parse(jsonMatch[1].trim());
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse analysis result");
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
