# PrepIt — Build Log

> Daily journal of what was built, what broke, and what was learned.
> This is the content goldmine for blog posts and interviews.

---

## Week 1 — Foundation + Core Interview Loop

### Day 1-2 — Auth + Setup
**Built:**
- Express + Node.js backend with MongoDB connection
- User model with bcrypt password hashing
- JWT auth — register, login, protected middleware
- React + TypeScript frontend with Vite
- React Router with nested + protected routes
- AuthContext with login, register, logout
- Login and Register pages

**Learned:**
- dotenv must be the first import before everything else or env vars are undefined
- JWT payload should only contain userId — not name or email, since those can change
- `return` after every `res.json()` — without it Express tries to send two responses and crashes
- Rules of Hooks — never call hooks after a conditional return

---

### Day 3 — Job Posting Parser (First AI Call)
**Built:**
- Anthropic SDK integration
- `parseJobPosting()` service — sends raw job posting text to Claude
- Claude extracts: jobTitle, companyName, requiredSkills, preferredSkills
- Session model with userId reference, TTL expiry, status field
- POST /api/sessions/create — protected route

**Learned:**
- Claude wraps JSON in markdown code blocks unless you explicitly say "Raw JSON only. No backticks."
- Always clean AI responses before JSON.parse() — `.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim()`
- Move fetcher functions outside React components — they get recreated on every render otherwise
- Never use `any` in TypeScript — define proper types

**First AI call result:**
```
Input:  "We are looking for a Senior React Developer at Google..."
Output: {
  jobTitle: "Senior React Developer",
  companyName: "Google",
  requiredSkills: ["React", "TypeScript", "Node.js"],
  preferredSkills: ["GraphQL", "AWS", "Docker"]
}
```

---

### Day 4-5 — Streaming Interview Loop
**Built:**
- Conversation model — one document per message, linked by sessionId
- SSE (Server-Sent Events) streaming endpoint — POST /api/interview/respond
- System prompt with role, company, skills, behavior instructions
- Frontend: useInterview custom hook with fetch streaming
- MessageBubble component parsing JSON responses
- ChatInput component with Enter key support

**Learned:**
- SSE only supports GET — use fetch() with streaming for POST requests
- Empty placeholder pattern: add `{ role: 'assistant', content: '' }` before streaming starts, then fill it chunk by chunk via `updated[updated.length - 1]`
- `jwt.verify()` is synchronous — adding `await` does nothing
- `finalMessage()` must be called AFTER the stream is consumed, not before

---

### Day 6-7 — Persistence + Token Tracking
**Built:**
- UsageLog model — tracks userId, sessionId, model, inputTokens, outputTokens, cost, latency
- `createClaudeStream()` and `logUsage()` separated in aiService.js
- Conversation history loading on session open via useQuery
- Sliding window — only last 10 messages sent to Claude

**Observed token growth:**
```
Round 1  →  1662 input tokens
Round 2  →  1953 input tokens  (+291 from history)
Round 6+ →  stable (window caps at 10 messages)
```

**Learned:**
- Separating createClaudeStream and logUsage keeps concerns clean
- Sliding window is essential — without it costs grow linearly with conversation length
- One Mongoose document per message (not arrays) — easier to query, aggregate, and add fields like score/feedback

---

## Week 2 — Smart Features + Prompt Mastery

### Day 8-9 — Difficulty Modes + Prompt Templates
**Built:**
- Three difficulty modes: friendly / standard / tough
- DIFFICULTY_CONFIG object with tone + behavior per mode
- prompts/ folder with v1.js and v2.js as separate files
- promptBuilder.js service — loads correct version via PROMPT_VERSION env var
- Switch prompt version with one env var change, no code edits needed
- No-repeat question tracking — injects asked questions into system prompt

**Learned:**
- Prompt instructions at the TOP get more attention from the model
- Switching behavior with env vars is cleaner than if/else in controller
- Scoring instructions must be explicit in every difficulty config — Claude interprets "encouraging" as skipping scores

---

### Day 10 — Prompt Iteration Sprint

**Test setup:** 5 standardized answers, same mock session (Google, Senior React Developer), Haiku 4.5

#### v1 — Original Prompt
```
Structure:   role → behavior → no-repeat list → JSON format
Tokens:      ~731 chars, no example, format at bottom
```

| Test | Input | Output | Cost | JSON |
|------|-------|--------|------|------|
| 1 | 197 | 187 | $0.001132 | ✅ |
| 2 | 235 | 197 | $0.001220 | ✅ |
| 3 | 266 | 250 | $0.001516 | ✅ |
| 4 | 335 | 257 | $0.001620 | ✅ |
| 5 | 415 | 316 | $0.001995 | ✅ |

**v1 Averages:**
- Input tokens: 290
- Output tokens: 241
- Cost per call: $0.001497
- Latency: 4512ms
- JSON compliance: 100%

---

#### v2 — Structured Prompt (Few-shot + Rubric + Format First)

**Changes made:**
1. Moved JSON format instruction to the very top
2. Added a concrete few-shot example of a perfect response
3. Added scoring rubric (9-10 exceptional, 7-8 good, 5-6 basic, 3-4 partial, 1-2 incorrect)
4. Compressed behavior to specific instructions

| Test | Input | Output | Cost | JSON |
|------|-------|--------|------|------|
| 1 | 354 | 141 | $0.001059 | ✅ |
| 2 | 389 | 142 | $0.001099 | ✅ |
| 3 | 419 | 152 | $0.001179 | ✅ |
| 4 | 464 | 152 | $0.001224 | ✅ |
| 5 | 505 | 154 | $0.001275 | ✅ |

**v2 Averages:**
- Input tokens: 426
- Output tokens: 148
- Cost per call: $0.001167
- Latency: 2653ms
- JSON compliance: 100%

---

#### v1 → v2 Comparison

```
                    v1          v2          change
─────────────────────────────────────────────────
Input tokens:       290    →    426         +136 (more context)
Output tokens:      241    →    148         -93  (more concise)
Cost per call:      $0.001497 → $0.001167   22% cheaper
Latency:            4512ms →   2653ms       41% faster
JSON compliance:    100%   →   100%         same
```

**Key finding:**
Adding 136 input tokens via structured format + few-shot example reduced output by 93 tokens. Net result: 22% cheaper and 41% faster. More structured context = more concise responses = lower total cost.

This is counterintuitive — more tokens in made it cheaper overall.

---

#### Next — v3 Target
- Compress few-shot example to reduce input tokens below 350
- Maintain output conciseness below 150 tokens
- Target: < $0.001000 per call

---

## Key Lessons So Far

```
1. The model is the engine. Your app is the car.
   Everyone has the same API. The prompt layer is the product.

2. Log everything from day one.
   You can't optimize what you don't measure.

3. Structured prompts make models more concise.
   More context in = less noise out = lower cost.

4. Sliding window is non-negotiable.
   Without it, costs grow linearly with conversation length.

5. One document per message.
   Makes aggregation, scoring, and dashboards trivial later.

6. Separate concerns early.
   prompt files, builder service, controller — each owns one thing.
```
