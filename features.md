# Features to implement

- [ ] Add email verification
- [ ] Add password reset
- [ ] Send email on new assignment creation

## API Response Standardization

```json
{
  "errors": [
    {
      "msg": string,
      "type": string,
      "path": string,
      "location": "body" | "params" | "query"
    }
  ],
  "data": {
    "key": "value"
  }
}
```
