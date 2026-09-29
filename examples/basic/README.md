# Example: can the AI send this email?

```bash
# from the repository root
npm install
npm run example
```

- **E** Intent: send a quote email to an external client, requested by an AI assistant
- **V** Possibility: a model proposes and ranks `send`, `ask_human`, `hold`
- **Λ** Decision Boundary: only an authorized human may send externally; routing to a human needs an approver on duty
- **Ǝ** Trace: saved to `traces/<trace_id>.json`

Result: `hold`, with the reason recorded.

Runs offline with a mock model. Set `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` to use a real one.
