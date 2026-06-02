# adapt-definitions

**Definitions** is an _extension_ which adds glossary-style definitions to words within course text.

When a learner selects a marked word, a pop-up displays its definition. Definitions can be set inline on individual words, or globally so every occurrence of a word is matched automatically.

## course.json

```json
    "_definitions": {
        "_isEnabled": true,
        "title": "Definition",
        "body": "{{{word}}}: {{{definition}}}",
        "confirmText": "Close",
        "_showIcon": true
    }
```

## any json - single instance definition

```json
    {
        "body": "This next <span role='button' tabindex='0' definition='Has a brief description'>word</span>"
    }
```

## course.json - global definition for every word occurance

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

---

**Author / maintainer:** Mindtools Kineo<br>
**Accessibility support:** WAI AA<br>
**RTL support:** Yes<br>
**Cross-platform coverage:** Chrome, Chrome for Android, Firefox (ESR + latest version), Edge, Safari for macOS/iOS/iPadOS, Opera<br>
