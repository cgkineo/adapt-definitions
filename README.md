# adapt-definitions

### course.json
```json
    "_definitions": {
        "_isEnabled": true,
        "title": "Definition",
        "body": "{{{word}}}: {{{definition}}}",
        "confirmText": "Close",
        "_showIcon": true
    }
```

### any json - single instance definition
```json
    {
        "body": "This next <span role='button' tabindex='0' definition='Has a brief description'>word</span>"
    }
```

### course.json - global definition for every word occurance
```json
    "_definitions": {
        "_isEnabled": true,
        "title": "Definition",
        "body": "{{{word}}}: {{{definition}}}",
        "confirmText": "Close",
        "_showIcon": true,
        "_items": [
            {
                "words": [
                    "sam"
                ],
                "definition": "This is the sun of Sam"
            },
            {
                "words": [
                    "Adapt Framework"
                ],
                "definition": "This is a piece of software which</br>allows you to create e-learning."
            },
            {
                "words": [
                    "Adapt"
                ],
                "definition": "This is a community of people"
            },
            {
                "words": [
                    "the",
                    "a"
                ],
                "definition": "Excellent word this one"
            }
        ]
    }
```

