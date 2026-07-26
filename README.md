# skillstack

> Comenius 
> 
> Is wel goed idee om eerst een soort vragenlijst in te vullen en dan gepersonaliseerd leren

## Development

> I use for indenting 8 spaces

> Plain css!


## Oncue -  BullMQ implementation

> Idea is to use bull as a queue system that will do tasks, so for skillstack it needs to compile code etc..

### Install

- npm i
- Rename env_example to .env
- change .env credentials 

Example call
```bash
curl -X POST http://localhost:3000/email-webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "email": "user@example.com",
    "attachments": [
      "https://example.com/file1.pdf"
    ]
  }'
```

### Workers

Created 3 workers for now, they need to be started

```bash
node workers/processing.worker.js
```

### API

API needs to be started (has 1 endpoint for now to send a mail)

```bash
node api.js
```

