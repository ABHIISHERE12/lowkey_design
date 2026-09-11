const OPENROUTER_MODEL = 'openrouter/free';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const REQUEST_TIMEOUT_MS = 60000;

const RUBRIC = [
  { name: 'Requirement Understanding', maxScore: 15 },
  { name: 'Class Responsibilities', maxScore: 20 },
  { name: 'Encapsulation', maxScore: 10 },
  { name: 'Coupling & Cohesion', maxScore: 15 },
  { name: 'Abstraction', maxScore: 10 },
  { name: 'Extensibility', maxScore: 10 },
  { name: 'Design Patterns', maxScore: 5 },
  { name: 'Edge Cases', maxScore: 5 },
  { name: 'Explanation Quality', maxScore: 10 },
];

const RELATIONSHIP_MEANINGS = {
  inheritance: 'solid line + hollow triangle toward the parent',
  implementation: 'dashed line + hollow triangle toward the interface',
  association: 'solid line with no diamond/arrow required',
  aggregation: 'solid line + hollow diamond on the whole/owner side',
  composition: 'solid line + filled diamond on the whole/owner side',
  dependency: 'dashed line + open arrow toward the dependency',
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const formatDesign = (design = {}) => {
  const nodes = Array.isArray(design.nodes) ? design.nodes : [];
  const edges = Array.isArray(design.edges) ? design.edges : [];

  return {
    classes: nodes
      .filter((node) => node.type === 'classNode')
      .map((node) => ({
        id: node.id,
        name: node.data?.name || '',
        attributes: node.data?.attributes || [],
        methods: node.data?.methods || [],
      })),
    abstractClasses: nodes
      .filter((node) => node.type === 'abstractNode')
      .map((node) => ({
        id: node.id,
        name: node.data?.name || '',
        attributes: node.data?.attributes || [],
        methods: node.data?.methods || [],
      })),
    interfaces: nodes
      .filter((node) => node.type === 'interfaceNode')
      .map((node) => ({
        id: node.id,
        name: node.data?.name || '',
        methods: node.data?.methods || [],
      })),
    enums: nodes
      .filter((node) => node.type === 'enumNode')
      .map((node) => ({
        id: node.id,
        name: node.data?.name || '',
        enumValues: node.data?.enumValues || [],
      })),
    relationships: edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      relationshipType: edge.relationshipType,
      meaning: RELATIONSHIP_MEANINGS[edge.relationshipType] || 'relationship between two nodes',
    })),
  };
};

const buildPrompt = ({ problem, design, findings }) => {
  const rubricText = RUBRIC.map(
    (item, index) => `${index + 1}. ${item.name} — maxScore ${item.maxScore}`
  ).join('\n');

  return `You are an LLD (low-level design) evaluator for a practice platform.

Evaluate the student's class diagram against the problem requirements and the fixed rubric.
There can be multiple valid LLD solutions.
Do not compare the design only against one reference implementation.
Evaluate design quality based on the rubric.
Only evaluate elements actually present in the submitted design.
Never invent classes, methods, attributes, relationships, or requirements.
Cite concrete evidence from the submitted design.
Do not penalize a design merely because it differs from a common/reference solution.
Do not recommend design patterns unless they solve an actual problem in the submitted design.
Keep feedback useful for someone learning LLD.

Relationship type meanings:
${Object.entries(RELATIONSHIP_MEANINGS)
    .map(([type, meaning]) => `- ${type}: ${meaning}`)
    .join('\n')}

Scoring rules:
- Each criterion score must be a number from 0 to that criterion's maxScore.
- maxScore values must be exactly: 15, 20, 10, 15, 10, 10, 5, 5, 10 (sum = 100).
- overallScore must be between 0 and 100.
- confidence must be one of: "high", "medium", "low".
- Keep evidence/concern/suggestion to 1 short sentence each.
- Return ONLY one valid JSON object. No markdown. No code fences. No text before or after the JSON.

Fixed rubric:
${rubricText}

Problem title:
${problem.title}

Problem statement:
${problem.statement}

Problem requirements:
${(problem.requirements || []).map((req) => `- ${req}`).join('\n')}

Submitted UML/LLD design JSON:
${JSON.stringify(formatDesign(design))}

Deterministic validation findings:
${JSON.stringify(findings)}

Return exactly this JSON object with all 9 criteria in this order:
Requirement Understanding, Class Responsibilities, Encapsulation, Coupling & Cohesion, Abstraction, Extensibility, Design Patterns, Edge Cases, Explanation Quality.

Shape:
{"overallScore":0,"criteria":[{"name":"Requirement Understanding","score":0,"maxScore":15,"evidence":"...","concern":"...","suggestion":"...","confidence":"high"}],"strengths":[],"concerns":[],"suggestions":[]}`;
};

const extractJsonObject = (text) => {
  if (!text || typeof text !== 'string') {
    throw new Error('AI returned an empty response');
  }

  let cleaned = text.trim();

  // Strip markdown fences anywhere in the response.
  cleaned = cleaned
    .replace(/```json/gi, '```')
    .replace(/```/g, '')
    .trim();

  // Prefer the outermost JSON object if the model added prose.
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('AI returned malformed JSON');
  }

  cleaned = cleaned.slice(start, end + 1);

  // Common free-model JSON issues.
  cleaned = cleaned
    .replace(/,\s*([}\]])/g, '$1') // trailing commas
    .replace(/[\u201C\u201D]/g, '"') // smart double quotes
    .replace(/[\u2018\u2019]/g, "'"); // smart single quotes

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('AI returned malformed JSON');
  }
};

const normalizeConfidence = (value) => {
  if (typeof value === 'string') {
    const key = value.toLowerCase().trim();
    if (key === 'high') return 0.9;
    if (key === 'medium') return 0.6;
    if (key === 'low') return 0.3;
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return 0.5;
  return clamp(numeric > 1 ? numeric / 10 : numeric, 0, 1);
};

const validateEvaluation = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('AI evaluation is not an object');
  }

  if (!Array.isArray(payload.criteria)) {
    throw new Error('AI evaluation criteria must be an array');
  }

  const criteriaByName = new Map(payload.criteria.map((item) => [item?.name, item]));

  const criteria = RUBRIC.map((rubricItem) => {
    const item = criteriaByName.get(rubricItem.name);
    if (!item) {
      throw new Error(`Missing rubric criterion: ${rubricItem.name}`);
    }

    const rawScore = Number(item.score);
    const score = Number.isNaN(rawScore)
      ? 0
      : clamp(rawScore, 0, rubricItem.maxScore);

    return {
      name: rubricItem.name,
      score,
      maxScore: rubricItem.maxScore,
      evidence: String(item.evidence || ''),
      concern: String(item.concern || ''),
      suggestion: String(item.suggestion || ''),
      confidence: normalizeConfidence(item.confidence),
    };
  });

  // Recalculate overallScore from criterion scores (do not trust the model).
  const overallScore = Number(
    clamp(
      criteria.reduce((sum, item) => sum + item.score, 0),
      0,
      100
    ).toFixed(1)
  );

  // Persist in the existing Evaluation/frontend 0–10 display contract.
  return {
    overallScore: Number((overallScore / 10).toFixed(1)),
    criteria: criteria.map((item) => ({
      name: item.name,
      score: Number(((item.score / item.maxScore) * 10).toFixed(1)),
      evidence: item.evidence,
      concern: item.concern,
      suggestion: item.suggestion,
      confidence: item.confidence,
    })),
    strengths: Array.isArray(payload.strengths) ? payload.strengths.map(String) : [],
    concerns: Array.isArray(payload.concerns) ? payload.concerns.map(String) : [],
    suggestions: Array.isArray(payload.suggestions) ? payload.suggestions.map(String) : [],
  };
};

const mapOpenRouterError = (status, data) => {
  if (status === 401) {
    return 'Invalid or missing OPENROUTER_API_KEY';
  }
  if (status === 402) {
    return 'OpenRouter model requires credits or is unavailable on the free tier';
  }
  if (status === 429) {
    return 'OpenRouter rate limit reached. Please retry shortly';
  }
  if (status >= 500) {
    return 'OpenRouter is temporarily unavailable. Please retry later';
  }
  return data?.error?.message || data?.message || `OpenRouter request failed (${status})`;
};

const callOpenRouter = async ({ apiKey, prompt, signal, useJsonFormat }) => {
  const body = {
    model: OPENROUTER_MODEL,
    temperature: 0.1,
    messages: [
      {
        role: 'system',
        content:
          'You are a strict JSON-only LLD evaluator. Reply with a single valid JSON object only. No markdown. No explanation. No trailing commas.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  };

  // Some free models ignore or mishandle response_format; keep it optional.
  if (useJsonFormat) {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5000',
      'X-Title': 'LowKeyDesign LLD Practice Platform',
    },
    body: JSON.stringify(body),
    signal,
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(mapOpenRouterError(response.status, data));
  }

  const text = data?.choices?.[0]?.message?.content || '';
  if (!text) {
    const reason = data?.choices?.[0]?.finish_reason || data?.error?.message;
    throw new Error(reason ? `AI returned empty content (${reason})` : 'AI returned an empty response');
  }

  return text;
};

const evaluateDesign = async ({ problem, design, findings }) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const prompt = buildPrompt({ problem, design, findings });
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    let lastError = null;

    // Attempt 1: ask for JSON mode. Attempt 2: plain completion (more compatible with free models).
    for (const useJsonFormat of [true, false]) {
      try {
        const text = await callOpenRouter({
          apiKey,
          prompt,
          signal: controller.signal,
          useJsonFormat,
        });
        const parsed = extractJsonObject(text);
        return validateEvaluation(parsed);
      } catch (error) {
        lastError = error;
        const retryable = /malformed JSON|empty response|empty content|Missing rubric|criteria must be an array/i
          .test(error.message || '');
        if (!retryable || useJsonFormat === false) {
          throw error;
        }
        console.error(`OpenRouter evaluation parse failed, retrying without json_object mode: ${error.message}`);
      }
    }

    throw lastError || new Error('AI evaluation failed');
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('OpenRouter request timed out. Please retry evaluation.');
    }
    if (error.message && (
      error.message.includes('fetch failed')
      || error.message.toLowerCase().includes('network')
      || error.message.toLowerCase().includes('econnrefused')
    )) {
      throw new Error('Network error while contacting OpenRouter. Please retry.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

module.exports = {
  evaluateDesign,
  OPENROUTER_MODEL,
  RUBRIC,
};
