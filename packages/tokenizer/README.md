# @vcltk/tokenizer

Fastly VCL Tokenizer

## Usage

```typescript
import { tokenize } from "@vcltk/tokenizer";

tokenize(`
  sub vcl_recv {
    if (req.url ~ "^/admin") {
      return (pass);
    }
  }
`);
```

## License

MIT
